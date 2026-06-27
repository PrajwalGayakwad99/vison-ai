// ─── API Client ───────────────────────────────────────────────────────────
// Abstraction layer for future backend integration.
// Currently returns mock data — swap implementations when backend is ready.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiClient<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, config);

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ─── Stub API Functions (mock data for now) ──────────────────────────────

export async function executeCode(_code: string, _language: string) {
  // TODO: POST /api/v1/execute
  return { output: '[Mock] Execution output', steps: [] };
}

export async function getCurriculum() {
  // TODO: GET /api/v1/curriculum
  return null; // Falls back to local curriculumData.ts
}

export async function getLeaderboard() {
  // TODO: GET /api/v1/leaderboard
  return null; // Falls back to local gamificationData.ts
}

export async function aiTutorChat(_messages: { role: string; content: string }[]) {
  // TODO: POST /api/v1/tutor
  return null; // Falls back to local aiApi.ts (Anthropic or mock)
}

export async function getStudyGroups() {
  // TODO: GET /api/v1/groups
  return null;
}

export async function submitCodeReview(_code: string, _topic: string) {
  // TODO: POST /api/v1/review
  return null;
}

export { API_URL };
export default apiClient;
