import { create } from "zustand";

export type Language = "python" | "java" | "javascript";

interface WorkspaceState {
  /** Currently active language in the editor */
  language: Language;
  /** Current source code in the editor */
  code: string;
  /** Output from the last execution */
  output: string;
  /** Whether the sandbox is currently running */
  isRunning: boolean;
  /** Active tutor conversation thread */
  tutorMessages: { role: "user" | "assistant"; content: string }[];

  // Actions
  setLanguage: (lang: Language) => void;
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  setIsRunning: (running: boolean) => void;
  addTutorMessage: (msg: { role: "user" | "assistant"; content: string }) => void;
  reset: () => void;
}

const defaultCode: Record<Language, string> = {
  python: 'print("Hello, Invincia!")\n',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Invincia!");\n  }\n}\n',
  javascript: 'console.log("Hello, Invincia!");\n',
};

export const useWorkspace = create<WorkspaceState>((set) => ({
  language: "python",
  code: defaultCode["python"],
  output: "",
  isRunning: false,
  tutorMessages: [],

  setLanguage: (lang) => set({ language: lang, code: defaultCode[lang] }),
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setIsRunning: (isRunning) => set({ isRunning }),
  addTutorMessage: (msg) =>
    set((s) => ({ tutorMessages: [...s.tutorMessages, msg] })),
  reset: () =>
    set({ code: defaultCode["python"], output: "", tutorMessages: [] }),
}));
