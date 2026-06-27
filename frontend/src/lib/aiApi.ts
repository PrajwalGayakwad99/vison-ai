// ─── Anthropic AI API Client ────────────────────────────────────────────
// Handles streaming responses from Claude API with graceful mock fallback
// when no API key is configured.

export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiStreamOptions {
  messages: AiMessage[];
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
const API_URL = 'https://api.anthropic.com/v1/messages';

// ─── Streaming Anthropic Call ───────────────────────────────────────────

export async function streamAiResponse(
  opts: AiStreamOptions,
  onChunk: (text: string) => void,
  onComplete: (accumulatedText: string) => void,
  onError: (error: string) => void
): Promise<void> {
  // If no API key, use mock responses
  if (!API_KEY) {
    useMockResponse(opts, onChunk, onComplete);
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: opts.model || 'claude-sonnet-4-20250514',
        max_tokens: opts.maxTokens || 1024,
        temperature: opts.temperature ?? 0.7,
        system: opts.systemPrompt,
        messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errBody}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const json = JSON.parse(trimmed.slice(6));
          if (json.type === 'content_block_delta' && json.delta?.text) {
            const chunk = json.delta.text;
            accumulatedText += chunk;
            onChunk(chunk);
          }
        } catch {
          // Skip malformed SSE events
        }
      }
    }
    onComplete(accumulatedText);
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Unknown API error');
  }
}

// ─── Non-Streaming Call (for debug / hints where we need structured parse) ───

export async function callAi(
  opts: AiStreamOptions
): Promise<string> {
  if (!API_KEY) {
    return getMockResponse(opts);
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model || 'claude-sonnet-4-20250514',
      max_tokens: opts.maxTokens || 1024,
      temperature: opts.temperature ?? 0.7,
      system: opts.systemPrompt,
      messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

// ─── Mock Responses (for development without API key) ───────────────────

const MOCK_RESPONSES: Record<string, string> = {
  socratic: `That's a great question! Let me ask you something first: look at the loop condition on line 9. What happens when \`sequence.length\` reaches the value of \`n\`? Think about what the condition evaluates to at that exact moment.

Take your time — the answer will reveal why your loop stops where it does.`,

  debug: `### Issue Found
**Location:** Line 10 — \`next_val = sequence[-1] + sequence[-2]\`

**What's Wrong:**
The expression uses Python's negative indexing, which works perfectly. However, notice that \`sequence\` starts with \`\[0, 1\]\`. On the first iteration, \`sequence[-1]\` is 1 and \`sequence[-2]\` is 0, giving us 1 — which is correct! But double-check: are you sure the loop guard on line 9 is comparing the right thing?

**Why It's Wrong Conceptually:**
This isn't actually an error in the code itself — it's a subtle off-by-one in how you're thinking about the loop. The loop continues while \`len(sequence) < n\`, meaning for n=5, it runs when length is 2, 3, and 4 (three iterations). That produces exactly 3 new values, giving us 5 total.

**Guiding Question:**
If you wanted to produce 7 Fibonacci numbers instead of 5, what single value would you change? And would the loop still behave correctly?`,

  hint: `Here's a nudge: think about what happens to the call stack when a function calls itself. Each recursive call pushes a new frame. When does a frame get popped off?`,

  progress: `Based on your session, here's what I noticed:

**Strengths:** ✓ You nailed iterative approaches and loop guards
**Review Recommended:** ↻ Recursion base cases — you hesitated on the factorial quiz
**Next Up:** Try implementing merge sort. It combines looping (which you're solid on) with recursion (your growth area).`,
};

async function useMockResponse(
  opts: AiStreamOptions,
  onChunk: (text: string) => void,
  onComplete: (accumulatedText: string) => void
): Promise<void> {
  const response = await getMockResponse(opts);
  // Simulate streaming by emitting chunks
  const words = response.split(' ');
  let accumulated = '';
  for (const word of words) {
    onChunk(word + ' ');
    accumulated += word + ' ';
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
  }
  onComplete(accumulated);
}

async function getMockResponse(opts: AiStreamOptions): Promise<string> {
  const systemLower = opts.systemPrompt.toLowerCase();
  const userLower = opts.messages[opts.messages.length - 1]?.content.toLowerCase() || '';

  if (systemLower.includes('debug')) return MOCK_RESPONSES.debug;
  if (systemLower.includes('hint') || userLower.includes('hint')) return MOCK_RESPONSES.hint;
  if (systemLower.includes('progress')) return MOCK_RESPONSES.progress;
  return MOCK_RESPONSES.socratic;
}
