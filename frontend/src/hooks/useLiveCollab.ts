// ── useLiveCollab Hook ─────────────────────────────────────────────────────
// Real-time collaborative editing with Yjs CRDT sync + Monaco binding.
//
// Architecture:
//   Yjs document → y-monaco binding → Monaco editor
//   WebSocket provider (y-websocket) → syncs across clients
//   Awareness protocol → cursor presence, selection ranges
//
// For production: replace MOCK_WEBSOCKET_URL with a real y-websocket server.
// Alternative providers: y-webrtc (P2P), y-indexeddb (offline-first).

import { useState, useCallback, useRef, useEffect } from 'react';
import type { CursorPresence, CollaborationSession, CollaborationParticipant } from '../data/collabData';

// Lazy-load Yjs only when needed (it's a large dependency)
let Yjs: any = null;
let MonacoBinding: any = null;
let WebsocketProvider: any = null;
let Awareness: any = null;

async function loadYjs() {
  if (Yjs) return;
  try {
    // Dynamic imports via variable to avoid TS module resolution errors
    // yjs packages are optional — install separately for real-time collab
    const yjsMod = await import('yjs' as string);
    const monacoMod = await import('y-monaco' as string);
    const wsMod = await import('y-websocket' as string);
    const awareMod = await import('y-protocols/awareness.js' as string);
    Yjs = yjsMod;
    MonacoBinding = monacoMod.MonacoBinding;
    WebsocketProvider = wsMod.WebsocketProvider;
    Awareness = awareMod.Awareness;
  } catch {
    // yjs and related packages not installed — collaboration is stub-only
    throw new Error('Real-time collaboration requires yjs packages. Install: yjs y-monaco y-websocket y-protocols');
  }
}

const MOCK_WEBSOCKET_URL = process.env.NEXT_PUBLIC_COLLAB_WS_URL || 'ws://localhost:1234';

export function useLiveCollab() {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [participants, setParticipants] = useState<CollaborationParticipant[]>([]);
  const [cursors, setCursors] = useState<CursorPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const docRef = useRef<any>(null);
  const providerRef = useRef<any>(null);
  const bindingRef = useRef<any>(null);
  const awarenessRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // ── Create or Join Session ─────────────────────────────────────────────

  const createSession = useCallback(async (title: string, code: string, language: string, isPublic = true) => {
    setIsLoading(true);
    setError(null);

    try {
      await loadYjs();

      const roomId = `axiom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();

      const doc = new Yjs.Doc();
      const text = doc.getText('monaco');
      text.insert(0, code);

      const provider = new WebsocketProvider(MOCK_WEBSOCKET_URL, roomId, doc, {
        awareness: new Awareness(doc),
      });

      const awareness = provider.awareness;
      awareness.setLocalStateField('user', {
        name: 'You',
        color: '#8B5CF6',
        avatar: '👤',
      });

      docRef.current = doc;
      providerRef.current = provider;
      awarenessRef.current = awareness;

      // Listen for awareness changes (cursor presence)
      awareness.on('change', () => {
        const states = Array.from(awareness.getStates().values());
        const cursorList: CursorPresence[] = states
          .map((s: any) => s.user)
          .filter(Boolean)
          .map((user: any) => ({
            studentId: user.studentId || 'anonymous',
            name: user.name,
            color: user.color,
            avatar: user.avatar,
            position: user.position || { line: 1, column: 1 },
            selection: user.selection,
          }));
        setCursors(cursorList);
      });

      // Listen for connection state
      provider.on('connection-close', () => setIsConnected(false));
      provider.on('connection-error', (err: Error) => setError(err.message));

      const newSession: CollaborationSession = {
        id: roomId,
        title,
        hostId: 'current-user',
        code,
        language,
        participants: [
          {
            studentId: 'current-user',
            name: 'You',
            avatar: '👤',
            color: '#8B5CF6',
            isOnline: true,
            lastSeen: Date.now(),
          },
        ],
        createdAt: Date.now(),
        lastActive: Date.now(),
        inviteCode,
        isPublic,
      };

      setSession(newSession);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinSession = useCallback(async (inviteCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await loadYjs();

      const roomId = `axiom-invite-${inviteCode.toLowerCase()}`;
      const doc = new Yjs.Doc();

      const provider = new WebsocketProvider(MOCK_WEBSOCKET_URL, roomId, doc, {
        awareness: new Awareness(doc),
      });

      const awareness = provider.awareness;
      awareness.setLocalStateField('user', {
        name: 'You',
        color: '#34D399',
        avatar: '👤',
      });

      docRef.current = doc;
      providerRef.current = provider;
      awarenessRef.current = awareness;

      awareness.on('change', () => {
        const states = Array.from(awareness.getStates().values());
        setCursors(
          states
            .map((s: any) => s.user)
            .filter(Boolean)
            .map((user: any) => ({
              studentId: user.studentId || 'anonymous',
              name: user.name,
              color: user.color,
              avatar: user.avatar,
              position: user.position || { line: 1, column: 1 },
              selection: user.selection,
            }))
        );
      });

      setSession({
        id: roomId,
        title: 'Collaborative Session',
        hostId: 'unknown',
        code: '',
        language: 'python',
        participants: [],
        createdAt: Date.now(),
        lastActive: Date.now(),
        inviteCode,
        isPublic: true,
      });
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Bind to Monaco Editor ──────────────────────────────────────────────

  const bindMonaco = useCallback((editor: any, monaco: any) => {
    if (!docRef.current || !providerRef.current) return;

    editorRef.current = editor;
    monacoRef.current = monaco;

    const text = docRef.current.getText('monaco');
    const binding = new MonacoBinding(
      text,
      editor.getModel(),
      new Set([editor]),
      providerRef.current.awareness
    );

    bindingRef.current = binding;
  }, []);

  // ── Update Awareness (cursor position) ─────────────────────────────────

  const updateCursor = useCallback((position: { line: number; column: number }, selection?: any) => {
    if (!awarenessRef.current) return;
    awarenessRef.current.setLocalStateField('user', {
      ...awarenessRef.current.getLocalState()?.user,
      position,
      selection,
    });
  }, []);

  // ─ Leave Session ──────────────────────────────────────────────────────

  const leaveSession = useCallback(() => {
    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }
    if (providerRef.current) {
      providerRef.current.destroy();
      providerRef.current = null;
    }
    if (docRef.current) {
      docRef.current.destroy();
      docRef.current = null;
    }

    docRef.current = null;
    providerRef.current = null;
    bindingRef.current = null;
    awarenessRef.current = null;
    editorRef.current = null;
    monacoRef.current = null;

    setSession(null);
    setParticipants([]);
    setCursors([]);
    setIsConnected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, [leaveSession]);

  return {
    session,
    participants,
    cursors,
    isConnected,
    error,
    isLoading,
    createSession,
    joinSession,
    bindMonaco,
    updateCursor,
    leaveSession,
  };
}
