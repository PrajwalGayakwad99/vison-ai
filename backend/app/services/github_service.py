"""
GitHub Integration Service
=======================
Fetches public GitHub repository data using the GitHub API.
"""

from __future__ import annotations

from typing import Optional

import httpx


async def fetch_github_repos(
    github_username: str,
    max_repos: int = 5,
) -> list[dict]:
    """
    Fetch the top repositories for a GitHub user by star count.

    Args:
        github_username: GitHub username to fetch repos for
        max_repos: Maximum number of repos to return (default 5)

    Returns:
        List of dicts containing repo data:
        [
            {
                "repo_name": "repo-name",
                "description": "...",
                "url": "https://github.com/user/repo",
                "language": "Python",
                "stars": 100,
                "forks": 10
            },
            ...
        ]

    Raises:
        httpx.HTTPStatusError: If GitHub API returns an error
    """
    if not github_username:
        return []

    url = f"https://api.github.com/users/{github_username}/repos"

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VisionAI-Platform/1.0",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                url,
                headers=headers,
                params={
                    "sort": "stars",
                    "per_page": max_repos,
                    "direction": "desc",
                },
            )
            response.raise_for_status()
            repos_data = response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return []
        raise httpx.HTTPStatusError(
            f"GitHub API error: {e.response.status_code}",
            response=e.response,
            request=e.request,
        )
    except httpx.TimeoutException:
        return []

    # Extract relevant fields
    repos = []
    for repo in repos_data[:max_repos]:
        repos.append({
            "repo_name": repo.get("name", ""),
            "description": repo.get("description") or "",
            "url": repo.get("html_url", ""),
            "language": repo.get("language") or "Unknown",
            "stars": repo.get("stargazers_count", 0),
            "forks": repo.get("forks_count", 0),
        })

    return repos


def format_repos_for_display(repos: list[dict]) -> str:
    """
    Format repos into a markdown string for AI analysis.

    Args:
        repos: List of repo dicts

    Returns:
        Markdown-formatted string
    """
    if not repos:
        return "No public repositories found."

    lines = ["## Top GitHub Repositories\n"]
    for i, repo in enumerate(repos, 1):
        lines.append(f"{i}. **{repo['repo_name']}** ({repo['stars']} stars)")
        if repo.get("description"):
            lines.append(f"   - {repo['description']}")
        if repo.get("language"):
            lines.append(f"   - Language: {repo['language']}")
        lines.append("")

    return "\n".join(lines)


async def get_github_profile(github_username: str) -> Optional[dict]:
    """
    Fetch basic GitHub profile information.

    Args:
        github_username: GitHub username

    Returns:
        Dict with profile info or None
    """
    if not github_username:
        return None

    url = f"https://api.github.com/users/{github_username}"

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VisionAI-Platform/1.0",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

            return {
                "username": data.get("login"),
                "name": data.get("name"),
                "bio": data.get("bio"),
                "avatar_url": data.get("avatar_url"),
                "public_repos": data.get("public_repos", 0),
                "followers": data.get("followers", 0),
                "following": data.get("following", 0),
                "github_url": data.get("html_url"),
            }
    except httpx.HTTPStatusError:
        return None
    except httpx.TimeoutException:
        return None
