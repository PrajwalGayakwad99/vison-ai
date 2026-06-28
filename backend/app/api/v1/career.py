"""
Career Development API Router
=========================
Endpoints for portfolio management, GitHub sync, and AI-powered career assessments.
"""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.schemas import (
    PortfolioCreate,
    PortfolioOut,
    PortfolioUpdate,
    PortfolioWithUser,
    GithubSyncResponse,
    SkillAssessmentOut,
    SkillAssessmentResponse,
    RecruiterSearchResponse,
    RecruiterSearchResult,
)
from app.services.db import get_db
from app.services import github_service
from app.services import career_ai
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/career", tags=["career"])


# =============================================================================
# PORTFOLIO ENDPOINTS
# =============================================================================

@router.get("/portfolio/me", response_model=PortfolioOut)
async def get_my_portfolio(
    current_user: dict = Depends(get_current_user),
) -> PortfolioOut:
    """Get the current user's portfolio."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    db = get_db()
    result = (
        db.table("portfolios")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    return PortfolioOut(**result.data)


@router.post("/portfolio/me", response_model=PortfolioOut)
async def create_or_update_portfolio(
    payload: PortfolioCreate,
    current_user: dict = Depends(get_current_user),
) -> PortfolioOut:
    """Create or update the current user's portfolio."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    # Check if portfolio exists
    existing = (
        db.table("portfolios")
        .select("id")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    data = payload.model_dump()
    data["updated_at"] = now

    if existing.data:
        # Update
        result = (
            db.table("portfolios")
            .update(data)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        # Create
        data["user_id"] = user_id
        data["created_at"] = now
        result = db.table("portfolios").insert(data).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save portfolio")

    return PortfolioOut(**result.data[0])


@router.patch("/portfolio/me", response_model=PortfolioOut)
async def update_portfolio(
    payload: PortfolioUpdate,
    current_user: dict = Depends(get_current_user),
) -> PortfolioOut:
    """Partially update the current user's portfolio."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    data = {k: v for k, v in payload.model_dump().items() if v is not None}
    data["updated_at"] = now

    result = (
        db.table("portfolios")
        .update(data)
        .eq("user_id", user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    return PortfolioOut(**result.data[0])


# =============================================================================
# GITHUB SYNC
# =============================================================================

@router.post("/portfolio/sync-github", response_model=GithubSyncResponse)
async def sync_github_repos(
    github_username: str = Query(..., description="Your GitHub username"),
    current_user: dict = Depends(get_current_user),
) -> GithubSyncResponse:
    """Fetch GitHub repos and save to the user's profile."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    # Fetch repos from GitHub
    repos = await github_service.fetch_github_repos(github_username, max_repos=10)

    if not repos:
        return GithubSyncResponse(
            success=False,
            repos_synced=0,
            message="No public repositories found or GitHub user not found",
        )

    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    synced_count = 0

    for repo in repos:
        repo_data = {
            "user_id": user_id,
            "repo_name": repo["repo_name"],
            "description": repo.get("description"),
            "url": repo["url"],
            "language": repo.get("language"),
            "stars": repo.get("stars", 0),
            "forks": repo.get("forks", 0),
            "last_synced_at": now,
        }

        # Upsert repo
        db.table("github_repos").upsert(
            repo_data,
            on_conflict="user_id,repo_name",
        ).execute()
        synced_count += 1

    # Update portfolio with GitHub username
    db.table("portfolios").update({
        "github_username": github_username,
        "updated_at": now,
    }).eq("user_id", user_id).execute()

    return GithubSyncResponse(
        success=True,
        repos_synced=synced_count,
        message=f"Successfully synced {synced_count} repositories",
    )


@router.get("/portfolio/github-repos")
async def get_github_repos(
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Get the current user's synced GitHub repos."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    db = get_db()
    result = (
        db.table("github_repos")
        .select("*")
        .eq("user_id", user_id)
        .order("stars", desc=True)
        .execute()
    )

    return result.data or []


# =============================================================================
# AI CAREER ASSESSMENT
# =============================================================================

@router.post("/portfolio/generate-assessment", response_model=SkillAssessmentResponse)
async def generate_career_assessment(
    current_user: dict = Depends(get_current_user),
) -> SkillAssessmentResponse:
    """Generate an AI-powered career assessment based on user data."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    db = get_db()

    # Get user XP
    user_result = db.table("users").select("xp").eq("id", user_id).single().execute()
    user_xp = user_result.data.get("xp", 0) if user_result.data else 0

    # Get completed modules
    progress_result = (
        db.table("user_progress")
        .select("module_id, status")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .execute()
    )
    completed_module_ids = [p.get("module_id") for p in progress_result.data or [] if p.get("module_id")]

    # Get module names
    module_names = []
    if completed_module_ids:
        modules_result = (
            db.table("modules")
            .select("title")
            .in_("id", completed_module_ids)
            .execute()
        )
        module_names = [m.get("title", "") for m in modules_result.data or []]

    # Get GitHub repos for additional context
    repos_result = (
        db.table("github_repos")
        .select("repo_name, language, stars")
        .eq("user_id", user_id)
        .order("stars", desc=True)
        .limit(5)
        .execute()
    )
    github_repos = [
        {
            "repo_name": r.get("repo_name"),
            "language": r.get("language"),
            "stars": r.get("stars", 0),
        }
        for r in repos_result.data or []
    ]

    # Generate career profile with AI
    profile = career_ai.generate_career_profile(
        user_xp=user_xp,
        completed_modules=module_names,
        github_repos=github_repos if github_repos else None,
    )

    now = datetime.now(timezone.utc).isoformat()

    # Save assessment
    assessment_data = {
        "user_id": user_id,
        "ai_generated_profile": profile.get("summary", ""),
        "recommended_job_roles": profile.get("recommended_roles", []),
        "skill_breakdown": profile.get("skill_breakdown", {}),
        "total_xp_analyzed": user_xp,
        "modules_completed": len(completed_module_ids),
        "generated_at": now,
    }

    # Upsert assessment
    db.table("skill_assessments").upsert(
        assessment_data,
        on_conflict="user_id",
    ).execute()

    # Get saved assessment
    saved = (
        db.table("skill_assessments")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if saved.data:
        return SkillAssessmentResponse(
            success=True,
            assessment=SkillAssessmentOut(**saved.data),
            message="Career assessment generated successfully",
        )

    return SkillAssessmentResponse(
        success=False,
        assessment=None,
        message="Failed to save assessment",
    )


@router.get("/portfolio/assessment", response_model=SkillAssessmentOut)
async def get_latest_assessment(
    current_user: dict = Depends(get_current_user),
) -> SkillAssessmentOut:
    """Get the current user's latest career assessment."""
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")

    db = get_db()
    result = (
        db.table("skill_assessments")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="No assessment found. Generate one first.")

    return SkillAssessmentOut(**result.data)


# =============================================================================
# RECRUITER ENDPOINTS
# =============================================================================

@router.get("/recruiters/search", response_model=RecruiterSearchResponse)
async def search_public_portfolios(
    skill: Optional[str] = Query(None, description="Filter by skill"),
    min_xp: int = Query(0, ge=0, description="Minimum XP"),
    limit: int = Query(20, ge=1, le=100, description="Results limit"),
    current_user: dict = Depends(get_current_user),
) -> RecruiterSearchResponse:
    """
    Search public portfolios for recruiting purposes.

    This endpoint is accessible to all authenticated users.
    For production, add role-based access control for recruiters only.
    """
    db = get_db()

    # Get public portfolios with user info
    query = (
        db.table("portfolios")
        .select("*, users!inner(username, xp)")
        .eq("is_public", True)
        .gte("users.xp", min_xp)
        .order("users.xp", desc=True)
        .limit(limit)
    )

    result = query.execute()
    portfolios = result.data or []

    # Get latest assessments for each user
    results = []
    for portfolio in portfolios:
        user_id = portfolio.get("user_id")

        # Get assessment
        assessment_result = (
            db.table("skill_assessments")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        assessment = None
        top_skills = []
        if assessment_result.data:
            assessment = SkillAssessmentOut(**assessment_result.data)
            # Extract skills from breakdown
            breakdown = assessment_result.data.get("skill_breakdown", {})
            top_skills = sorted(breakdown.items(), key=lambda x: x[1], reverse=True)[:3]
            top_skills = [s[0] for s in top_skills]

        # Filter by skill if specified
        if skill and skill.lower() not in " ".join(top_skills).lower():
            continue

        results.append(RecruiterSearchResult(
            user_id=user_id,
            username=portfolio.get("users", {}).get("username", ""),
            bio=portfolio.get("bio"),
            linkedin_url=portfolio.get("linkedin_url"),
            xp=portfolio.get("users", {}).get("xp", 0),
            top_skills=top_skills,
            latest_assessment=assessment,
        ))

    return RecruiterSearchResponse(
        results=results,
        total_count=len(results),
    )


@router.get("/recruiters/candidate/{user_id}")
async def get_candidate_profile(
    user_id: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Get a complete candidate profile for recruiting."""
    db = get_db()

    # Get user
    user_result = db.table("users").select("*").eq("id", user_id).single().execute()
    if not user_result.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_result.data

    # Get portfolio
    portfolio_result = (
        db.table("portfolios")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    portfolio = portfolio_result.data or {}

    # Get GitHub repos
    repos_result = (
        db.table("github_repos")
        .select("*")
        .eq("user_id", user_id)
        .order("stars", desc=True)
        .limit(10)
        .execute()
    )
    repos = repos_result.data or []

    # Get latest assessment
    assessment_result = (
        db.table("skill_assessments")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    assessment = assessment_result.data or {}

    # Get completed modules
    completed_result = (
        db.table("user_progress")
        .select("module_id")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .execute()
    )
    modules_completed = len([p for p in completed_result.data or [] if p.get("module_id")])

    # Get achievements
    achievements_result = (
        db.table("user_achievements")
        .select("achievements(name, icon, description)")
        .eq("user_id", user_id)
        .execute()
    )
    achievements = [
        {"name": a.get("achievements", {}).get("name"),
         "icon": a.get("achievements", {}).get("icon")}
        for a in achievements_result.data or []
        if a.get("achievements")
    ]

    return {
        "candidate": {
            "user_id": user_id,
            "username": user.get("username"),
            "xp": user.get("xp", 0),
            "modules_completed": modules_completed,
            "achievements": achievements,
        },
        "portfolio": portfolio,
        "github_repos": repos,
        "skill_assessment": assessment,
    }
