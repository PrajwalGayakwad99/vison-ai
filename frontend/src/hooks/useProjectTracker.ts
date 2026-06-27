// ─── useProjectTracker Hook ─────────────────────────────────────────────────
// Manages project state: unlocking, milestone completion, and progress tracking.

import { useState, useCallback, useMemo } from 'react';
import { CURRICULUM } from '../data/curriculumData';
import type { Project, ProjectMilestone, StudentProgress, StudentProjectProgress } from '../data/curriculumData';
import { canUnlockProject } from '../lib/curriculumGraph';

function loadProjectProgress(): Record<string, StudentProjectProgress> {
  try {
    const raw = localStorage.getItem('axiom-project-progress');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProjectProgress(progress: Record<string, StudentProjectProgress>) {
  try {
    localStorage.setItem('axiom-project-progress', JSON.stringify(progress));
  } catch { /* ignore */ }
}

export function useProjectTracker(studentProgress: StudentProgress) {
  const [projectProgress, setProjectProgress] = useState<Record<string, StudentProjectProgress>>(loadProjectProgress);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const curriculum = CURRICULUM;

  const save = useCallback((updater: (p: Record<string, StudentProjectProgress>) => Record<string, StudentProjectProgress>) => {
    setProjectProgress((prev) => {
      const next = updater(prev);
      saveProjectProgress(next);
      return next;
    });
  }, []);

  // ── Derived Data ──────────────────────────────────────────────────────

  const projects: (Project & { unlocked: boolean; missingTopics: string[]; completionPercentage: number })[] = useMemo(() => {
    return curriculum.projects.map((project) => {
      const { unlocked, missingTopics } = canUnlockProject(project.requiredTopicIds, studentProgress, curriculum);
      const pp = projectProgress[project.id];
      const completedMilestones = pp?.milestonesCompleted?.length || 0;
      const completionPercentage = project.milestones.length > 0
        ? Math.round((completedMilestones / project.milestones.length) * 100)
        : 0;

      return {
        ...project,
        unlocked,
        missingTopics,
        completionPercentage,
      };
    });
  }, [curriculum, studentProgress, projectProgress]);

  const activeProject: (Project & { milestones: ProjectMilestone[]; unlocked: boolean; missingTopics: string[] }) | null = useMemo(() => {
    if (!activeProjectId) return null;
    const project = curriculum.projects.find((p) => p.id === activeProjectId);
    if (!project) return null;
    const { unlocked, missingTopics } = canUnlockProject(project.requiredTopicIds, studentProgress, curriculum);
    const pp = projectProgress[activeProjectId];
    const milestones = project.milestones.map((m) => ({
      ...m,
      completed: pp?.milestonesCompleted?.includes(m.id) || false,
    }));

    return {
      ...project,
      milestones,
      unlocked,
      missingTopics,
    };
  }, [activeProjectId, curriculum, studentProgress, projectProgress]);

  // ── Actions ───────────────────────────────────────────────────────────

  const selectProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);

    // Initialize progress if needed
    save((prev) => {
      if (!prev[projectId]) {
        prev[projectId] = {
          projectId,
          status: 'unlocked',
          milestonesCompleted: [],
          lastAccessed: Date.now(),
        };
      }
      prev[projectId].lastAccessed = Date.now();
      return prev;
    });
  }, [save]);

  const completeMilestone = useCallback((milestoneId: string) => {
    if (!activeProjectId) return;
    save((prev) => {
      const pp = prev[activeProjectId];
      if (!pp) return prev;
      if (!pp.milestonesCompleted.includes(milestoneId)) {
        pp.milestonesCompleted = [...pp.milestonesCompleted, milestoneId];
      }
      // Check if all milestones complete
      const project = curriculum.projects.find((p) => p.id === activeProjectId);
      if (project && pp.milestonesCompleted.length >= project.milestones.length) {
        pp.status = 'completed';
      } else {
        pp.status = 'in-progress';
      }
      return prev;
    });
  }, [activeProjectId, curriculum, save]);

  const goBack = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  return {
    projects,
    activeProject,
    activeProjectId,
    selectProject,
    completeMilestone,
    goBack,
  };
}
