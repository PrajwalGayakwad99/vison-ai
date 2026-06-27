// ─── AI Interaction Logger ──────────────────────────────────────────────
// Tags every AI interaction for later analytics. Stores in-memory with
// a localStorage mirror so we can query across sessions.

export type AiInteractionTag =
  | 'socratic'
  | 'debug'
  | 'hint'
  | 'progress'
  | 'voice'
  | 'direct_answer';

export interface AiInteraction {
  id: string;
  tag: AiInteractionTag;
  timestamp: number;
  userPrompt: string;
  assistantResponse: string;
  directnessLevel: number;
  topic?: string;
  language?: string;
}

const STORAGE_KEY = 'axiom-ai-interactions';
const MAX_STORED = 500; // cap localStorage size

function load(): AiInteraction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: AiInteraction[]) {
  try {
    const trimmed = items.slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full — silently drop
  }
}

export function logInteraction(
  tag: AiInteractionTag,
  userPrompt: string,
  assistantResponse: string,
  directnessLevel: number,
  meta?: { topic?: string; language?: string }
): AiInteraction {
  const entry: AiInteraction = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    tag,
    timestamp: Date.now(),
    userPrompt,
    assistantResponse,
    directnessLevel,
    topic: meta?.topic,
    language: meta?.language,
  };
  const list = load();
  list.push(entry);
  save(list);
  return entry;
}

export function getInteractionsByTag(tag: AiInteractionTag): AiInteraction[] {
  return load().filter((i) => i.tag === tag);
}

export function getAllInteractions(): AiInteraction[] {
  return load();
}

export function getSessionStats(): {
  total: number;
  byTag: Record<AiInteractionTag, number>;
  avgDirectness: number;
  languages: Record<string, number>;
} {
  const items = load();
  const byTag = {} as Record<AiInteractionTag, number>;
  const languages = {} as Record<string, number>;
  let totalDirectness = 0;

  for (const item of items) {
    byTag[item.tag] = (byTag[item.tag] || 0) + 1;
    totalDirectness += item.directnessLevel;
    if (item.language) languages[item.language] = (languages[item.language] || 0) + 1;
  }

  return {
    total: items.length,
    byTag: {
      socratic: byTag.socratic || 0,
      debug: byTag.debug || 0,
      hint: byTag.hint || 0,
      progress: byTag.progress || 0,
      voice: byTag.voice || 0,
      direct_answer: byTag.direct_answer || 0,
    },
    avgDirectness: items.length ? totalDirectness / items.length : 0,
    languages,
  };
}
