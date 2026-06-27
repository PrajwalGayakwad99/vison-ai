// ─── Curriculum Dependency Graph ────────────────────────────────────────────
// Standalone, testable module for DAG-based topic unlocking.
// No React dependencies — pure functions that can be unit tested.
//
// Database schema suggestion (for production):
//
//   topics (id, title, description, difficulty, estimated_minutes, module_id)
//   prerequisites (topic_id, prerequisite_id)  -- edge list for DAG
//   student_progress (student_id, topic_id, status, mastery_score, mode_completion_json)
//   projects (id, title, description, difficulty, estimated_hours)
//   project_requirements (project_id, topic_id)  -- which topics a project needs
//   project_milestones (project_id, id, title, description, completed)

import type {
  Topic,
  TopicStatus,
  StudentProgress,
  StudentTopicProgress,
  Curriculum,
} from '../data/curriculumData';
import { MASTERY_THRESHOLD, calcMasteryScore } from '../data/curriculumData';

// ── Can Unlock ──────────────────────────────────────────────────────────────
// A topic is unlockable if ALL of its prerequisite topics are "mastered"
// (mastery = calcMasteryScore() >= MASTERY_THRESHOLD, typically 80%).

export function canUnlock(
  topic: Topic,
  studentProgress: StudentProgress
): { unlocked: boolean; missingPrereqs: string[] } {
  if (topic.prerequisiteIds.length === 0) {
    return { unlocked: true, missingPrereqs: [] };
  }

  const missingPrereqs: string[] = [];

  for (const prereqId of topic.prerequisiteIds) {
    const progress = studentProgress.topicProgress[prereqId];
    if (!progress) {
      missingPrereqs.push(prereqId);
      continue;
    }

    // Check mastery: score >= 80%
    const masteryScore = calcMasteryScore(progress.modeCompletion);
    if (masteryScore < MASTERY_THRESHOLD) {
      missingPrereqs.push(prereqId);
    }
  }

  return {
    unlocked: missingPrereqs.length === 0,
    missingPrereqs,
  };
}

// ── Resolve Topic Status ───────────────────────────────────────────────────
// Given a topic and student progress, determine its current status.

export function resolveStatus(
  topic: Topic,
  studentProgress: StudentProgress
): TopicStatus {
  const progress = studentProgress.topicProgress[topic.id];
  if (!progress) {
    // No progress yet — check if unlocked
    const { unlocked } = canUnlock(topic, studentProgress);
    return unlocked ? 'unlocked' : 'locked';
  }

  // Use the stored status, but validate it against prerequisites
  const { unlocked } = canUnlock(topic, studentProgress);
  if (!unlocked && progress.status !== 'locked') {
    return 'locked'; // was completed but a prereq was reset
  }

  return progress.status;
}

// ── Get Next Recommended Topic ─────────────────────────────────────────────
// Walks modules in order, finds the first unlocked, incomplete topic.
// Prioritizes topics the student has already started (in-progress).

export function getNextRecommendedTopic(
  curriculum: Curriculum,
  studentProgress: StudentProgress
): Topic | null {
  // First pass: return any in-progress topic
  for (const module of curriculum.modules) {
    for (const topicId of module.topicIds) {
      const topic = curriculum.topics[topicId];
      if (!topic) continue;
      const progress = studentProgress.topicProgress[topicId];
      if (progress && progress.status === 'in-progress') {
        return topic;
      }
    }
  }

  // Second pass: return the first unlocked, incomplete topic
  for (const module of curriculum.modules) {
    for (const topicId of module.topicIds) {
      const topic = curriculum.topics[topicId];
      if (!topic) continue;
      const status = resolveStatus(topic, studentProgress);
      if (status === 'unlocked') {
        return topic;
      }
    }
  }

  return null; // all topics completed or still locked
}

// ── Build Dependency Graph for React Flow ───────────────────────────────────
// Converts the curriculum into nodes and edges for visualization.

export interface GraphNode {
  id: string;
  title: string;
  difficulty: string;
  status: TopicStatus;
  masteryScore: number;
  moduleTitle: string;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export function buildDependencyGraph(
  curriculum: Curriculum,
  studentProgress: StudentProgress
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodePositions: Record<string, { x: number; y: number }> = {};

  // Position nodes by module (columns) and topic order (rows)
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 60;
  const H_GAP = 280;
  const V_GAP = 90;
  const START_X = 50;
  const START_Y = 50;

  for (let mi = 0; mi < curriculum.modules.length; mi++) {
    const module = curriculum.modules[mi];
    const x = START_X + mi * H_GAP;

    for (let ti = 0; ti < module.topicIds.length; ti++) {
      const topicId = module.topicIds[ti];
      const topic = curriculum.topics[topicId];
      if (!topic) continue;

      const y = START_Y + ti * V_GAP;
      const status = resolveStatus(topic, studentProgress);
      const progress = studentProgress.topicProgress[topicId];
      const masteryScore = progress ? calcMasteryScore(progress.modeCompletion) : 0;

      nodePositions[topicId] = { x, y };

      nodes.push({
        id: topicId,
        title: topic.title,
        difficulty: topic.difficulty,
        status,
        masteryScore,
        moduleTitle: module.title,
        position: { x, y },
      });
    }
  }

  // Build edges from prerequisites
  for (const topicId of Object.keys(curriculum.topics)) {
    const topic = curriculum.topics[topicId];
    for (const prereqId of topic.prerequisiteIds) {
      if (nodePositions[prereqId]) {
        edges.push({
          id: `${prereqId}-${topicId}`,
          source: prereqId,
          target: topicId,
        });
      }
    }
  }

  return { nodes, edges };
}

// ── Get Missing Prerequisites (Human-Readable) ─────────────────────────────
// Returns topic titles for missing prerequisites, for UI display.

export function getMissingPrerequisiteTitles(
  topic: Topic,
  curriculum: Curriculum,
  studentProgress: StudentProgress
): string[] {
  const { missingPrereqs } = canUnlock(topic, studentProgress);
  return missingPrereqs
    .map((id) => curriculum.topics[id]?.title || id)
    .filter(Boolean);
}

// ── Get All Topics Required for a Project ──────────────────────────────────

export function canUnlockProject(
  requiredTopicIds: string[],
  studentProgress: StudentProgress,
  curriculum: Curriculum
): { unlocked: boolean; missingTopics: string[] } {
  const missingTopics: string[] = [];

  for (const topicId of requiredTopicIds) {
    const topic = curriculum.topics[topicId];
    if (!topic) {
      missingTopics.push(topicId);
      continue;
    }
    const { unlocked } = canUnlock(topic, studentProgress);
    if (!unlocked) {
      missingTopics.push(topic.title);
    }
  }

  return {
    unlocked: missingTopics.length === 0,
    missingTopics,
  };
}

// ── Compute Overall Curriculum Progress ────────────────────────────────────

export function computeCurriculumProgress(
  curriculum: Curriculum,
  studentProgress: StudentProgress
): {
  totalTopics: number;
  completedTopics: number;
  masteredTopics: number;
  overallPercentage: number;
  moduleProgress: { moduleId: string; moduleTitle: string; completed: number; total: number }[];
} {
  const moduleProgress: { moduleId: string; moduleTitle: string; completed: number; total: number }[] = [];
  let completedTopics = 0;
  let masteredTopics = 0;
  let totalTopics = 0;

  for (const module of curriculum.modules) {
    let modCompleted = 0;
    for (const topicId of module.topicIds) {
      totalTopics++;
      const status = resolveStatus(curriculum.topics[topicId], studentProgress);
      if (status === 'completed' || status === 'mastered') {
        completedTopics++;
        modCompleted++;
      }
      if (status === 'mastered') {
        masteredTopics++;
      }
    }
    moduleProgress.push({
      moduleId: module.id,
      moduleTitle: module.title,
      completed: modCompleted,
      total: module.topicIds.length,
    });
  }

  return {
    totalTopics,
    completedTopics,
    masteredTopics,
    overallPercentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
    moduleProgress,
  };
}
