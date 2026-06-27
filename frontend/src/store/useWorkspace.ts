import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export type LanguageId =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'ruby'
  | 'php'
  | 'csharp';

export const LANGUAGE_DISPLAY: Record<LanguageId, { name: string; ext: string; monacoLang: string; color: string; emoji: string }> = {
  python: { name: 'Python', ext: '.py', monacoLang: 'python', color: '#3b82f6', emoji: '🐍' },
  javascript: { name: 'JavaScript', ext: '.js', monacoLang: 'javascript', color: '#eab308', emoji: '🌐' },
  typescript: { name: 'TypeScript', ext: '.ts', monacoLang: 'typescript', color: '#3178c6', emoji: '🔷' },
  java: { name: 'Java', ext: '.java', monacoLang: 'java', color: '#f97316', emoji: '☕' },
  cpp: { name: 'C++', ext: '.cpp', monacoLang: 'cpp', color: '#60a5fa', emoji: '⚙️' },
  rust: { name: 'Rust', ext: '.rs', monacoLang: 'rust', color: '#f97316', emoji: '🦀' },
  go: { name: 'Go', ext: '.go', monacoLang: 'go', color: '#00add8', emoji: '🐹' },
  ruby: { name: 'Ruby', ext: '.rb', monacoLang: 'ruby', color: '#dc2626', emoji: '💎' },
  php: { name: 'PHP', ext: '.php', monacoLang: 'php', color: '#7c3aed', emoji: '🐘' },
  csharp: { name: 'C#', ext: '.cs', monacoLang: 'csharp', color: '#239120', emoji: '🔵' },
};

export const LANGUAGE_TEMPLATES: Record<LanguageId, string> = {
  python: `# Write your Python code here
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`,
  javascript: `// Write your JavaScript code here
function main() {
    console.log("Hello, World!");
}

main();
`,
  typescript: `// Write your TypeScript code here
function main(): void {
    console.log("Hello, World!");
}

main();
`,
  java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  rust: `// Write your Rust code here
fn main() {
    println!("Hello, World!");
}
`,
  go: `// Write your Go code here
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`,
  ruby: `# Write your Ruby code here
def main
    puts "Hello, World!"
end

main
`,
  php: `<?php
// Write your PHP code here
function main() {
    echo "Hello, World!\\n";
}

main();
`,
  csharp: `// Write your C# code here
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`,
};

export interface FileTab {
  id: string;
  name: string;
  language: LanguageId;
  code: string;
}

export interface ExecutionStep {
  lines: Record<string, number>;
  activeNodeId: string;
  traversedEdges: string[];
  activeEdgeId?: string;
  callStack: { name: string; line: number; active: boolean; offset: number }[];
  memoryCells: { name: string; type: string; val: string; address: string; changed?: boolean }[];
  variables: { name: string; val: string }[];
  heapRefs: { name: string; isRef: boolean; pointsTo?: string; address: string; value: string }[];
  chartData: { step: number; val: number }[];
  aiTip: string;
  output?: string;
}

interface WorkspaceState {
  code: string;
  language: LanguageId;
  files: FileTab[];
  activeFileId: string;
  activeTab: 'flow' | 'memory' | 'heap' | 'compare' | 'quiz';
  currentStep: number;
  steps: ExecutionStep[];
  isPlaying: boolean;
  speed: number;
  socketConnected: boolean;
  aiTutorOpen: boolean;
  messages: ChatMessage[];
  quizAnswered: number | null;
  quizCorrect: boolean | null;
  sideRailCollapsed: boolean;
  directnessLevel: number;
  learningMode: 'practice' | 'quiz' | 'debugging' | 'explore';
  activeToolbarView: 'flow' | 'memory' | 'heap' | 'compare' | 'quiz' | 'debug' | null;
  setCode: (code: string) => void;
  setLanguage: (lang: LanguageId) => void;
  setActiveFile: (id: string) => void;
  addFile: (file: FileTab) => void;
  removeFile: (id: string) => void;
  updateFileCode: (id: string, code: string) => void;
  setActiveTab: (tab: 'flow' | 'memory' | 'heap' | 'compare' | 'quiz') => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  runCode: () => void;
  setSocketConnected: (connected: boolean) => void;
  setAiTutorOpen: (open: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  answerQuiz: (idx: number) => void;
  resetQuiz: () => void;
  toggleSideRail: () => void;
  setDirectnessLevel: (level: number) => void;
  setLearningMode: (mode: 'practice' | 'quiz' | 'debugging' | 'explore') => void;
  setActiveToolbarView: (view: 'flow' | 'memory' | 'heap' | 'compare' | 'quiz' | 'debug' | null) => void;
}

const DEFAULT_CODE: Record<string, string> = {
  python: `def fibonacci(n):
    # AXIOM Interactive Execution
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

print(fibonacci(5))`,
  javascript: `function fibonacci(n) {
  // AXIOM Interactive Execution
  if (n <= 0) return [];
  if (n === 1) return [0];

  const sequence = [0, 1];
  while (sequence.length < n) {
    const nextVal = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    sequence.push(nextVal);
  }
  return sequence;
}

console.log(fibonacci(5));`,
  cpp: `#include <iostream>
#include <vector>

// AXIOM Interactive Execution
std::vector<int> fibonacci(int n) {
    if (n <= 0) return {};
    if (n == 1) return {0};

    std::vector<int> sequence = {0, 1};
    while (sequence.size() < n) {
        int nextVal = sequence.back() + sequence[sequence.size() - 2];
        sequence.push_back(nextVal);
    }
    return sequence;
}

int main() {
    auto res = fibonacci(5);
    return 0;
}`,
  java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    // AXIOM Interactive Execution
    public static List<Integer> fibonacci(int n) {
        if (n <= 0) return new ArrayList<>();
        if (n == 1) return Arrays.asList(0);

        List<Integer> sequence = new ArrayList<>(Arrays.asList(0, 1));
        while (sequence.size() < n) {
            int nextVal = sequence.get(sequence.size() - 1) + sequence.get(sequence.size() - 2);
            sequence.add(nextVal);
        }
        return sequence;
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}`,
  typescript: `function fibonacci(n: number): number[] {
    // AXIOM Interactive Execution
    if (n <= 0) return [];
    if (n === 1) return [0];

    const sequence: number[] = [0, 1];
    while (sequence.length < n) {
        const nextVal = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        sequence.push(nextVal);
    }
    return sequence;
}

console.log(fibonacci(5));`,
  rust: `fn fibonacci(n: i32) -> Vec<i32> {
    // AXIOM Interactive Execution
    if n <= 0 { return vec![]; }
    if n == 1 { return vec![0]; }

    let mut sequence = vec![0, 1];
    while sequence.len() < n as usize {
        let next_val = sequence[sequence.len() - 1] + sequence[sequence.len() - 2];
        sequence.push(next_val);
    }
    sequence
}

fn main() {
    println!("{:?}", fibonacci(5));
}`,
  go: `package main

import "fmt"

// AXIOM Interactive Execution
func fibonacci(n int) []int {
    if n <= 0 { return []int{} }
    if n == 1 { return []int{0} }

    sequence := []int{0, 1}
    for len(sequence) < n {
        nextVal := sequence[len(sequence)-1] + sequence[len(sequence)-2]
        sequence = append(sequence, nextVal)
    }
    return sequence
}

func main() {
    fmt.Println(fibonacci(5))
}`,
  ruby: `# AXIOM Interactive Execution
def fibonacci(n)
    return [] if n <= 0
    return [0] if n == 1

    sequence = [0, 1]
    while sequence.length < n
        next_val = sequence[-1] + sequence[-2]
        sequence << next_val
    end
    sequence
end

puts fibonacci(5).inspect`,
  php: `<?php
// AXIOM Interactive Execution
function fibonacci(int $n): array {
    if ($n <= 0) return [];
    if ($n === 1) return [0];

    $sequence = [0, 1];
    while (count($sequence) < $n) {
        $nextVal = $sequence[count($sequence) - 1] + $sequence[count($sequence) - 2];
        $sequence[] = $nextVal;
    }
    return $sequence;
}

print_r(fibonacci(5));`,
  csharp: `using System;
using System.Collections.Generic;

public class Main {
    // AXIOM Interactive Execution
    public static List<int> Fibonacci(int n) {
        if (n <= 0) return new List<int>();
        if (n == 1) return new List<int> { 0 };

        var sequence = new List<int> { 0, 1 };
        while (sequence.Count < n) {
            int nextVal = sequence[sequence.Count - 1] + sequence[sequence.Count - 2];
            sequence.Add(nextVal);
        }
        return sequence;
    }

    public static void Main() {
        Console.WriteLine(string.Join(", ", Fibonacci(5)));
    }
}`,
};

const MOCK_STEPS: ExecutionStep[] = [
  { lines: { python: 1, javascript: 1, cpp: 5, java: 7 }, activeNodeId: 'start', traversedEdges: [], callStack: [{ name: 'fibonacci(n=5)', line: 1, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }], variables: [{ name: 'n', val: '5' }], heapRefs: [], chartData: [], aiTip: 'We enter the fibonacci function with argument n = 5. A stack frame is created.' },
  { lines: { python: 3, javascript: 3, cpp: 6, java: 8 }, activeNodeId: 'check-base-1', traversedEdges: ['start-base1'], activeEdgeId: 'start-base1', callStack: [{ name: 'fibonacci(n=5)', line: 3, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }], variables: [{ name: 'n', val: '5' }], heapRefs: [], chartData: [], aiTip: 'Checking base case: Is n ≤ 0? Since n is 5, this condition is false.' },
  { lines: { python: 5, javascript: 4, cpp: 7, java: 9 }, activeNodeId: 'check-base-2', traversedEdges: ['start-base1', 'base1-base2'], activeEdgeId: 'base1-base2', callStack: [{ name: 'fibonacci(n=5)', line: 5, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }], variables: [{ name: 'n', val: '5' }], heapRefs: [], chartData: [], aiTip: 'Checking second base case: Is n == 1? This is also false, so we bypass return [0].' },
  { lines: { python: 8, javascript: 6, cpp: 9, java: 11 }, activeNodeId: 'init-seq', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq'], activeEdgeId: 'base2-initseq', callStack: [{ name: 'fibonacci(n=5)', line: 8, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980', changed: true }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1]' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }], aiTip: 'Initializing the sequence array on the heap. The local variable "sequence" holds a reference (pointer) to heap address 0x3d82ae.' },
  { lines: { python: 9, javascript: 7, cpp: 10, java: 12 }, activeNodeId: 'loop-check', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck'], activeEdgeId: 'initseq-loopcheck', callStack: [{ name: 'fibonacci(n=5)', line: 9, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1]' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }], aiTip: 'Checking loop condition: is len(sequence) (2) < n (5)? Yes → entering loop body.' },
  { lines: { python: 10, javascript: 8, cpp: 11, java: 13 }, activeNodeId: 'calc-next', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext'], activeEdgeId: 'loopcheck-calcnext', callStack: [{ name: 'fibonacci(n=5)', line: 10, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }, { name: 'next_val', type: 'int', val: '1', address: '0x7ffeb5697c', changed: true }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1]' }, { name: 'next_val', val: '1' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }], aiTip: 'Calculating next value: sequence[-1] + sequence[-2] = 1 + 0 = 1.' },
  { lines: { python: 11, javascript: 9, cpp: 12, java: 14 }, activeNodeId: 'append', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append'], activeEdgeId: 'calcnext-append', callStack: [{ name: 'fibonacci(n=5)', line: 11, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }, { name: 'next_val', type: 'int', val: '1', address: '0x7ffeb5697c' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1]' }, { name: 'next_val', val: '1' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }], aiTip: 'Appending next_val (1) to the sequence. The heap object grows.' },
  { lines: { python: 9, javascript: 7, cpp: 10, java: 12 }, activeNodeId: 'loop-check', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck'], activeEdgeId: 'append-loopcheck', callStack: [{ name: 'fibonacci(n=5)', line: 9, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1]' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }], aiTip: 'Loop iteration 2: is len(sequence) (3) < n (5)? Yes → continuing.' },
  { lines: { python: 10, javascript: 8, cpp: 11, java: 13 }, activeNodeId: 'calc-next', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck'], activeEdgeId: 'loopcheck-calcnext', callStack: [{ name: 'fibonacci(n=5)', line: 10, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }, { name: 'next_val', type: 'int', val: '2', address: '0x7ffeb5697c', changed: true }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1]' }, { name: 'next_val', val: '2' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }], aiTip: 'Calculating next value: 1 + 1 = 2.' },
  { lines: { python: 11, javascript: 9, cpp: 12, java: 14 }, activeNodeId: 'append', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck'], activeEdgeId: 'calcnext-append', callStack: [{ name: 'fibonacci(n=5)', line: 11, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }, { name: 'next_val', type: 'int', val: '2', address: '0x7ffeb5697c' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1, 2]' }, { name: 'next_val', val: '2' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1, 2]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }], aiTip: 'Appending next_val (2). Heap now holds 4 elements.' },
  { lines: { python: 9, javascript: 7, cpp: 10, java: 12 }, activeNodeId: 'loop-check', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck'], activeEdgeId: 'append-loopcheck', callStack: [{ name: 'fibonacci(n=5)', line: 9, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1, 2]' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1, 2]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }], aiTip: 'Loop iteration 3: is len(sequence) (4) < n (5)? Yes → final iteration.' },
  { lines: { python: 10, javascript: 8, cpp: 11, java: 13 }, activeNodeId: 'calc-next', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck'], activeEdgeId: 'loopcheck-calcnext', callStack: [{ name: 'fibonacci(n=5)', line: 10, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }, { name: 'next_val', type: 'int', val: '3', address: '0x7ffeb5697c', changed: true }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1, 2]' }, { name: 'next_val', val: '3' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1, 2]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }], aiTip: 'Calculating next value: 2 + 1 = 3.' },
  { lines: { python: 11, javascript: 9, cpp: 12, java: 14 }, activeNodeId: 'append', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck'], activeEdgeId: 'calcnext-append', callStack: [{ name: 'fibonacci(n=5)', line: 11, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }, { name: 'next_val', type: 'int', val: '3', address: '0x7ffeb5697c' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1, 2, 3]' }, { name: 'next_val', val: '3' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1, 2, 3]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2, 3]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }, { step: 5, val: 3 }], aiTip: 'Appending next_val (3). All 5 Fibonacci numbers computed.' },
  { lines: { python: 9, javascript: 7, cpp: 10, java: 12 }, activeNodeId: 'loop-check', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck', 'loopcheck-return'], activeEdgeId: 'append-loopcheck', callStack: [{ name: 'fibonacci(n=5)', line: 9, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1, 2, 3]' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1, 2, 3]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2, 3]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }, { step: 5, val: 3 }], aiTip: 'Loop exit: is len(sequence) (5) < n (5)? No → loop terminates.' },
  { lines: { python: 12, javascript: 11, cpp: 14, java: 16 }, activeNodeId: 'return', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck', 'loopcheck-return'], activeEdgeId: 'loopcheck-return', callStack: [{ name: 'fibonacci(n=5)', line: 12, active: true, offset: 0 }], memoryCells: [{ name: 'n', type: 'int', val: '5', address: '0x7ffeb569a4' }, { name: 'sequence', type: 'list', val: '0x3d82ae', address: '0x7ffeb56980' }], variables: [{ name: 'n', val: '5' }, { name: 'sequence', val: '[0, 1, 1, 2, 3]' }], heapRefs: [{ name: 'sequence', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb56980', value: '[0, 1, 1, 2, 3]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2, 3]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }, { step: 5, val: 3 }], aiTip: 'Returning the completed sequence.' },
  { lines: { python: 14, javascript: 14, cpp: 18, java: 21 }, activeNodeId: 'end', traversedEdges: ['start-base1', 'base1-base2', 'base2-initseq', 'initseq-loopcheck', 'loopcheck-calcnext', 'calcnext-append', 'append-loopcheck', 'loopcheck-return', 'return-end'], activeEdgeId: 'return-end', callStack: [], memoryCells: [], variables: [{ name: 'result', val: '[0, 1, 1, 2, 3]' }], heapRefs: [{ name: 'result', isRef: true, pointsTo: '0x3d82ae', address: '0x7ffeb569a0', value: '[0, 1, 1, 2, 3]' }, { name: '0x3d82ae', isRef: false, address: '0x3d82ae', value: '[0, 1, 1, 2, 3]' }], chartData: [{ step: 1, val: 0 }, { step: 2, val: 1 }, { step: 3, val: 1 }, { step: 4, val: 2 }, { step: 5, val: 3 }], output: '[0, 1, 1, 2, 3]\n[AXIOM Engine] Process finished with exit code 0', aiTip: 'Execution complete! Result [0, 1, 1, 2, 3] returned and printed.' }
];

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  code: DEFAULT_CODE.python,
  language: 'python',
  files: [
    { id: 'default-python', name: 'fibonacci.py', language: 'python', code: DEFAULT_CODE.python },
  ],
  activeFileId: 'default-python',
  activeTab: 'flow',
  currentStep: 0,
  steps: MOCK_STEPS,
  isPlaying: false,
  speed: 1000,
  socketConnected: false,
  aiTutorOpen: false,
  quizAnswered: null,
  quizCorrect: null,
  sideRailCollapsed: true,
  directnessLevel: 0,
  learningMode: 'practice',
  activeToolbarView: null,
  messages: [
    { id: 'welcome', role: 'assistant', content: 'Hello! I am your AXIOM AI Tutor. Run this Fibonacci code and step through to see memory heap changes, stack frame push/pops, and loop transitions in real time!', timestamp: new Date() },
  ],

  setCode: (code) => {
    const { activeFileId } = get();
    set((state) => ({
      code,
      files: state.files.map((f) => (f.id === activeFileId ? { ...f, code } : f)),
    }));
  },

  setLanguage: (language) => {
    const { files } = get();
    const existing = files.find((f) => f.language === language);
    if (existing) {
      set({ language, code: existing.code, activeFileId: existing.id });
    } else {
      const extMap: Record<LanguageId, string> = { python: 'py', javascript: 'js', typescript: 'ts', cpp: 'cpp', java: 'java', rust: 'rs', go: 'go', ruby: 'rb', php: 'php', csharp: 'cs' };
      const newFile: FileTab = { id: `lang-${language}-${Date.now()}`, name: `fibonacci.${extMap[language]}`, language, code: DEFAULT_CODE[language] };
      set({ language, code: DEFAULT_CODE[language], files: [...files, newFile], activeFileId: newFile.id });
    }
  },

  setActiveFile: (id) => {
    const { files } = get();
    const file = files.find((f) => f.id === id);
    if (file) set({ activeFileId: id, language: file.language, code: file.code });
  },

  addFile: (file) => {
    const { files } = get();
    set({ files: [...files, file], activeFileId: file.id, language: file.language, code: file.code });
  },

  removeFile: (id) => {
    const { files, activeFileId } = get();
    const remaining = files.filter((f) => f.id !== id);
    if (remaining.length === 0) return;
    const newActive = activeFileId === id ? remaining[remaining.length - 1] : remaining.find((f) => f.id === activeFileId) || remaining[0];
    set({ files: remaining, activeFileId: newActive.id, language: newActive.language, code: newActive.code });
  },

  updateFileCode: (id, code) => {
    const { files, activeFileId } = get();
    const updated = files.map((f) => (f.id === id ? { ...f, code } : f));
    set({ files: updated, ...(activeFileId === id ? { code } : {}) });
  },

  setActiveTab: (activeTab) => set({ activeTab }),

  setCurrentStep: (currentStep) => set({ currentStep }),

  nextStep: () => set((state) => {
    if (state.currentStep < state.steps.length - 1) return { currentStep: state.currentStep + 1 };
    return { isPlaying: false };
  }),

  prevStep: () => set((state) => {
    if (state.currentStep > 0) return { currentStep: state.currentStep - 1 };
    return {};
  }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setSpeed: (speed) => set({ speed }),

  runCode: () => set({ currentStep: 0, isPlaying: false, quizAnswered: null, quizCorrect: null }),

  setSocketConnected: (socketConnected) => set({ socketConnected }),

  setAiTutorOpen: (aiTutorOpen) => set({ aiTutorOpen }),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7), timestamp: new Date() }],
  })),

  clearMessages: () => set({ messages: [] }),

  answerQuiz: (idx) => set({ quizAnswered: idx, quizCorrect: idx === 0 }),

  resetQuiz: () => set({ quizAnswered: null, quizCorrect: null }),

  toggleSideRail: () => set((state) => ({ sideRailCollapsed: !state.sideRailCollapsed })),

  setDirectnessLevel: (directnessLevel) => set({ directnessLevel }),

  setLearningMode: (learningMode) => set({ learningMode }),

  setActiveToolbarView: (activeToolbarView) => set({ activeToolbarView }),
}));
