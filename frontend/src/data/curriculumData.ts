// ─── Curriculum Data ────────────────────────────────────────────────────────
// The canonical curriculum: Modules → Topics → Subtopics.
// Ordered from foundational to advanced. In production this comes from a DB.

// ─── Type Definitions ──────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TopicStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed' | 'mastered';
export type VisualizationType = 'heap' | 'flow' | 'stack' | 'tree' | 'graph' | 'custom';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  testCases: { input: string; expectedOutput: string }[];
  difficulty: Difficulty;
  aiGenerated?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  testCases: { input: string; expectedOutput: string }[];
  difficulty: Difficulty;
}

export interface Subtopic {
  id: string;
  title: string;
  content: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  explanation: string;
  visualizationType: VisualizationType;
  exercises: Exercise[];
  challenges: Challenge[];
  subtopics: Subtopic[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topicIds: string[];
  icon: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requiredTopicIds: string[];
  milestones: ProjectMilestone[];
  starterCode: string;
  difficulty: Difficulty;
  estimatedHours: number;
}

export interface Curriculum {
  modules: Module[];
  topics: Record<string, Topic>;
  projects: Project[];
}

export interface ModeCompletion {
  explanationViewed: boolean;
  visualizationInteracted: boolean;
  exercisesPassed: number;
  exercisesTotal: number;
  challengesPassed: number;
  challengesTotal: number;
}

export interface StudentTopicProgress {
  topicId: string;
  status: TopicStatus;
  modeCompletion: ModeCompletion;
  lastAccessed: number;
  timeSpentMinutes: number;
  assessmentScores: number[];
}

export interface StudentProjectProgress {
  projectId: string;
  status: string;
  milestonesCompleted: string[];
  lastAccessed: number;
}

export interface StudentProgress {
  studentId: string;
  topicProgress: Record<string, StudentTopicProgress>;
  projectProgress: Record<string, StudentProjectProgress>;
  cachedAiProblems: Record<string, any[]>;
}

// ─── Mastery Computation ───────────────────────────────────────────────────

export const MASTERY_THRESHOLD = 80;

export function calcMasteryScore(mc: ModeCompletion): number {
  let score = 0;
  if (mc.explanationViewed) score += 10;
  if (mc.visualizationInteracted) score += 10;
  if (mc.exercisesTotal > 0) score += (mc.exercisesPassed / mc.exercisesTotal) * 40;
  if (mc.challengesTotal > 0) score += (mc.challengesPassed / mc.challengesTotal) * 40;
  return Math.round(score);
}

// ─── Display Configs ───────────────────────────────────────────────────────

export const DIFFICULTY_CONFIG: Record<string, { color: string; label: string }> = {
  beginner:   { color: '#34D399', label: 'Beginner' },
  intermediate: { color: '#A78BFA', label: 'Intermediate' },
  advanced:   { color: '#FB923C', label: 'Advanced' },
  expert:     { color: '#F87171', label: 'Expert' },
};

export const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  locked:       { color: '#6B6A78', label: 'Locked' },
  unlocked:     { color: '#A78BFA', label: 'Unlocked' },
  'in-progress': { color: '#A78BFA', label: 'In Progress' },
  completed:    { color: '#34D399', label: 'Completed' },
  mastered:     { color: '#8B5CF6', label: 'Mastered' },
};

// ─── Curriculum Data ───────────────────────────────────────────────────────

export const CURRICULUM: Curriculum = {
  modules: [
    { id: 'fundamentals', title: 'Programming Fundamentals', description: 'Variables, types, operators, and control flow — the building blocks of every program.', difficulty: 'beginner', topicIds: ['variables', 'operators', 'control-flow', 'functions'], icon: '' },
    { id: 'data-structures', title: 'Data Structures', description: 'Arrays, linked lists, stacks, queues, trees, and graphs — how to organize data efficiently.', difficulty: 'intermediate', topicIds: ['arrays', 'linked-lists', 'stacks-queues', 'hash-tables', 'trees', 'graphs'], icon: '🏗️' },
    { id: 'algorithms', title: 'Core Algorithms', description: 'Searching, sorting, and traversal — the classic algorithms every developer should know.', difficulty: 'intermediate', topicIds: ['linear-search', 'binary-search', 'bubble-sort', 'merge-sort', 'bfs', 'dfs'], icon: '⚡' },
    { id: 'recursion', title: 'Recursion & Backtracking', description: 'Self-referential problem solving — from factorials to N-Queens.', difficulty: 'intermediate', topicIds: ['recursion-basics', 'backtracking', 'n-queens'], icon: '🔄' },
    { id: 'dynamic-programming', title: 'Dynamic Programming', description: 'Optimal substructure and overlapping subproblems — solve exponential problems in polynomial time.', difficulty: 'advanced', topicIds: ['dp-basics', 'fibonacci-dp', 'knapsack'], icon: '🧩' },
    { id: 'advanced-algorithms', title: 'Advanced Graph Algorithms', description: 'Shortest paths, minimum spanning trees, and topological sort.', difficulty: 'advanced', topicIds: ['dijkstra', 'mst', 'topological-sort'], icon: '🗺️' },
  ],
  topics: {
    // ─ Module 1: Fundamentals ────────────────────────────────────────────
    variables: {
      id: 'variables', title: 'Variables & Data Types', description: 'How computers store and name values in memory.', difficulty: 'beginner', estimatedMinutes: 20, prerequisiteIds: [],
      explanation: `# Variables & Data Types

A **variable** is a named container that holds a value. Think of it as a labeled box in the computer's memory.

## How It Works

\`\`\`python
n = 5          # 'n' is a box labeled "n" containing the value 5
name = "AXIOM" # 'name' is a box containing the string "AXIOM"
\`\`\`

### Memory View
- Each variable is allocated a **memory address** (e.g., \`0x7ffeb569a4\`)
- The variable name is just a **human-friendly label** for that address
- The **type** determines how many bytes are used and how to interpret the bits

## Common Types

| Type | Example | Bytes | Description |
|------|---------|-------|-------------|
| int | \`5\` | 4 | Whole numbers |
| float | \`3.14\` | 8 | Decimal numbers |
| str | \`"hello"\` | variable | Text |
| bool | \`True\` | 1 | True/False |`,
      visualizationType: 'heap',
      exercises: [
        { id: 'var-ex-1', title: 'Swap Two Variables', description: 'Write a program to swap the values of two variables without using a temporary variable.', starterCode: 'a = 5\nb = 10\n# Swap a and b without temp variable', solution: 'a = 5\nb = 10\na = a + b\nb = a - b\na = a - b', testCases: [{ input: '5, 10', expectedOutput: '10, 5' }], difficulty: 'beginner', aiGenerated: false },
      ],
      challenges: [
        { id: 'var-ch-1', title: 'Type Detective', description: 'Given a series of assignments, determine the final type and value of each variable.', starterCode: 'x = 10\ny = "20"\nz = x + int(y)\nw = str(z) + y', solution: 'w = "3020"', testCases: [{ input: '', expectedOutput: 'w = "3020"' }], difficulty: 'intermediate' },
      ],
      subtopics: [
        { id: 'var-1', title: 'Memory Allocation', content: 'Variables are allocated on the stack with unique memory addresses.' },
        { id: 'var-2', title: 'Type Systems', content: 'Static vs dynamic typing — how languages enforce type rules.' },
      ],
    },
    operators: {
      id: 'operators', title: 'Operators & Expressions', description: 'Arithmetic, comparison, and logical operators.', difficulty: 'beginner', estimatedMinutes: 15, prerequisiteIds: ['variables'],
      explanation: `# Operators & Expressions

Operators transform values into new values.

## Arithmetic
\`+\`, \`-\`, \`*\`, \`/\`, \`%\` (modulo), \`**\` (exponentiation)

## Comparison
\`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`

## Logical
\`and\`, \`or\`, \`not\` — combine boolean expressions`,
      visualizationType: 'flow',
      exercises: [
        { id: 'op-ex-1', title: 'Odd or Even', description: 'Use the modulo operator to check if a number is odd or even.', starterCode: 'n = 7\n# Print "even" or "odd"', solution: 'print("even" if n % 2 == 0 else "odd")', testCases: [{ input: '7', expectedOutput: 'odd' }, { input: '8', expectedOutput: 'even' }], difficulty: 'beginner', aiGenerated: false },
      ],
      challenges: [
        { id: 'op-ch-1', title: 'Bitwise Puzzle', description: 'Use only bitwise operators (AND, OR, XOR, shift) to solve problems without arithmetic.', starterCode: '# Swap two numbers using only XOR', solution: 'a = a ^ b\nb = a ^ b\na = a ^ b', testCases: [{ input: '3, 5', expectedOutput: '5, 3' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'op-1', title: 'Operator Precedence', content: 'The order in which operators are evaluated: PEMDAS for arithmetic, then comparison, then logical.' },
      ],
    },
    'control-flow': {
      id: 'control-flow', title: 'Control Flow', description: 'If/else, loops, and branching — controlling program execution.', difficulty: 'beginner', estimatedMinutes: 25, prerequisiteIds: ['operators'],
      explanation: `# Control Flow

Control flow determines which code runs and when.

## Conditionals
\`\`\`python
if n > 0:
    print("positive")
elif n == 0:
    print("zero")
else:
    print("negative")
\`\`\`

## Loops
- \`while\` — repeat while a condition is true
- \`for\` — iterate over a sequence

## Loop Control
- \`break\` — exit the loop immediately
- \`continue\` — skip to the next iteration`,
      visualizationType: 'flow',
      exercises: [
        { id: 'cf-ex-1', title: 'FizzBuzz', description: 'Print numbers 1-30, replacing multiples of 3 with "Fizz", 5 with "Buzz", both with "FizzBuzz".', starterCode: 'for i in range(1, 31):\n    # Your logic here', solution: 'for i in range(1, 31):\n    if i % 15 == 0: print("FizzBuzz")\n    elif i % 3 == 0: print("Fizz")\n    elif i % 5 == 0: print("Buzz")\n    else: print(i)', testCases: [{ input: '15', expectedOutput: 'FizzBuzz' }], difficulty: 'beginner', aiGenerated: false },
      ],
      challenges: [
        { id: 'cf-ch-1', title: 'Nested Loop Pattern', description: 'Print a diamond pattern using nested loops.', starterCode: 'n = 5\n# Print diamond pattern', solution: '# Upper half\nfor i in range(n):\n    print(" " * (n-i-1) + "*" * (2*i+1))\n# Lower half\nfor i in range(n-2, -1, -1):\n    print(" " * (n-i-1) + "*" * (2*i+1))', testCases: [{ input: '3', expectedOutput: '  *\n ***\n*****\n ***\n  *' }], difficulty: 'intermediate' },
      ],
      subtopics: [
        { id: 'cf-1', title: 'Branch Prediction', content: 'How CPUs optimize conditional branches and why predictable patterns run faster.' },
        { id: 'cf-2', title: 'Loop Invariants', content: 'A condition that remains true before and after each loop iteration — key to proving correctness.' },
      ],
    },
    functions: {
      id: 'functions', title: 'Functions & Scope', description: 'Reusable blocks of code, parameters, return values, and variable scope.', difficulty: 'beginner', estimatedMinutes: 20, prerequisiteIds: ['control-flow'],
      explanation: `# Functions & Scope

Functions encapsulate reusable logic.

\`\`\`python
def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\`\`\`

## Key Concepts
- **Parameters** — inputs to the function
- **Return value** — output from the function
- **Scope** — where a variable is accessible
- **Call stack** — tracks active function calls`,
      visualizationType: 'stack',
      exercises: [
        { id: 'fn-ex-1', title: 'Factorial Function', description: 'Write a recursive factorial function.', starterCode: 'def factorial(n):\n    # Your code here', solution: 'def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)', testCases: [{ input: '5', expectedOutput: '120' }], difficulty: 'beginner', aiGenerated: false },
      ],
      challenges: [
        { id: 'fn-ch-1', title: 'Closure Counter', description: 'Create a function that returns a counter using closures.', starterCode: 'def make_counter():\n    # Return a function that increments on each call', solution: 'def make_counter():\n    count = 0\n    def counter():\n        nonlocal count\n        count += 1\n        return count\n    return counter', testCases: [{ input: 'call 3 times', expectedOutput: '1, 2, 3' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'fn-1', title: 'Call Stack Mechanics', content: 'Each function call pushes a stack frame with local variables, parameters, and return address.' },
      ],
    },
    // ── Module 2: Data Structures ─────────────────────────────────────────
    arrays: {
      id: 'arrays', title: 'Arrays', description: 'Contiguous memory blocks — fast indexed access.', difficulty: 'beginner', estimatedMinutes: 15, prerequisiteIds: ['variables'],
      explanation: `# Arrays

An array stores elements in contiguous memory, allowing O(1) indexed access.

## Memory Layout
\`\`\`
Index:    0      1      2      3      4
         [10]   [20]   [30]   [40]   [50]
Address: 0x100  0x104  0x108  0x10C  0x110
\`\`\`

## Operations
| Operation | Time | Notes |
|-----------|------|-------|
| Access | O(1) | Direct memory calculation |
| Append | O(1)* | Amortized; may trigger resize |
| Insert | O(n) | Must shift elements |
| Delete | O(n) | Must shift elements |`,
      visualizationType: 'heap',
      exercises: [
        { id: 'arr-ex-1', title: 'Two Sum', description: 'Find two numbers in an array that add up to a target.', starterCode: 'def two_sum(nums, target):\n    # Return indices of two numbers', solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target-n], i]\n        seen[n] = i', testCases: [{ input: '[2,7,11,15], 9', expectedOutput: '[0, 1]' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'arr-ch-1', title: 'Rotate Array', description: 'Rotate an array to the right by k steps in-place with O(1) extra space.', starterCode: 'def rotate(nums, k):\n    # Rotate in-place', solution: 'def rotate(nums, k):\n    k = k % len(nums)\n    nums.reverse()\n    nums[:k] = reversed(nums[:k])\n    nums[k:] = reversed(nums[k:])', testCases: [{ input: '[1,2,3,4,5], 2', expectedOutput: '[4,5,1,2,3]' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'arr-1', title: 'Cache Locality', content: 'Contiguous memory access patterns are cache-friendly — arrays beat linked lists for iteration.' },
      ],
    },
    'linked-lists': {
      id: 'linked-lists', title: 'Linked Lists', description: 'Node-based structure — efficient insertions and deletions.', difficulty: 'intermediate', estimatedMinutes: 25, prerequisiteIds: ['arrays'],
      explanation: `# Linked Lists

Each node stores data and a pointer to the next node.

\`\`\`
Head → [A|→] → [B|→] → [C|→] → None
\`\`\`

## Types
- **Singly linked** — each node points to next
- **Doubly linked** — each node points to next AND previous
- **Circular** — last node points back to first

## Trade-offs vs Arrays
| | Array | Linked List |
|--|--|--|
| Access | O(1) | O(n) |
| Insert (beginning) | O(n) | O(1) |
| Insert (end) | O(1)* | O(n) / O(1) with tail |
| Memory overhead | Low | High (pointers) |`,
      visualizationType: 'flow',
      exercises: [
        { id: 'll-ex-1', title: 'Reverse Linked List', description: 'Reverse a singly linked list iteratively.', starterCode: 'def reverse_list(head):\n    # Return new head', solution: 'def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev', testCases: [{ input: '1→2→3→4→5', expectedOutput: '5→4→3→2→1' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'll-ch-1', title: 'Detect Cycle', description: "Detect if a linked list has a cycle using Floyd's algorithm (tortoise and hare).", starterCode: 'def has_cycle(head):\n    # Return True/False', solution: 'def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False', testCases: [{ input: '1→2→3→4→(back to 2)', expectedOutput: 'True' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'll-1', title: 'Pointer Arithmetic', content: 'Linked list operations are all about manipulating next/prev pointers — visualize with diagrams.' },
      ],
    },
    'stacks-queues': {
      id: 'stacks-queues', title: 'Stacks & Queues', description: 'LIFO and FIFO data structures — essential for algorithms.', difficulty: 'intermediate', estimatedMinutes: 20, prerequisiteIds: ['linked-lists'],
      explanation: `# Stacks & Queues

## Stack (LIFO — Last In, First Out)
Like a stack of plates — you add and remove from the top.
- **Push** — add to top
- **Pop** — remove from top
- **Peek** — view top without removing

## Queue (FIFO — First In, First Out)
Like a line at a store — first person in line is served first.
- **Enqueue** — add to back
- **Dequeue** — remove from front

## Applications
- Stack: function calls, undo operations, expression parsing
- Queue: BFS, task scheduling, buffering`,
      visualizationType: 'stack',
      exercises: [
        { id: 'sq-ex-1', title: 'Valid Parentheses', description: 'Check if a string of parentheses is valid using a stack.', starterCode: 'def is_valid(s):\n    # Return True/False', solution: 'def is_valid(s):\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]: return False\n        else:\n            stack.append(c)\n    return not stack', testCases: [{ input: '(){}[]', expectedOutput: 'True' }, { input: '([)]', expectedOutput: 'False' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'sq-ch-1', title: 'Implement Queue with Two Stacks', description: 'Implement a FIFO queue using only two stacks.', starterCode: 'class MyQueue:\n    def __init__(self): pass\n    def push(self, x): pass\n    def pop(self): pass', solution: 'class MyQueue:\n    def __init__(self):\n        self.in_stack = []\n        self.out_stack = []\n    def push(self, x):\n        self.in_stack.append(x)\n    def pop(self):\n        if not self.out_stack:\n            while self.in_stack:\n                self.out_stack.append(self.in_stack.pop())\n        return self.out_stack.pop()', testCases: [{ input: 'push 1, push 2, pop', expectedOutput: '1' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'sq-1', title: 'Call Stack as Stack', content: 'The program call stack IS a stack — recursive calls push frames, returns pop them.' },
      ],
    },
    'hash-tables': {
      id: 'hash-tables', title: 'Hash Tables', description: 'O(1) average lookups using hash functions.', difficulty: 'intermediate', estimatedMinutes: 20, prerequisiteIds: ['arrays'],
      explanation: `# Hash Tables

A hash table maps keys to values using a **hash function** that computes an array index.

\`\`\`
key → hash(key) → index → value
\`\`\`

## Collision Resolution
- **Chaining** — each bucket is a linked list
- **Open addressing** — probe for next empty slot

## Complexity
| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

The worst case happens when all keys hash to the same bucket.`,
      visualizationType: 'heap',
      exercises: [
        { id: 'ht-ex-1', title: 'First Non-Repeating Character', description: 'Find the first character that appears only once in a string.', starterCode: 'def first_unique(s):\n    # Return the character or None', solution: 'def first_unique(s):\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for c in s:\n        if counts[c] == 1:\n            return c\n    return None', testCases: [{ input: '"aabccdeff"', expectedOutput: '"b"' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'ht-ch-1', title: 'LRU Cache', description: 'Implement a Least Recently Used cache with O(1) get and put operations.', starterCode: 'class LRUCache:\n    def __init__(self, capacity): pass\n    def get(self, key): pass\n    def put(self, key, value): pass', solution: 'class LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.cache = {}\n        self.order = []\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.order.remove(key)\n        self.order.append(key)\n        return self.cache[key]\n    def put(self, key, value):\n        if key in self.cache:\n            self.order.remove(key)\n        elif len(self.cache) >= self.cap:\n            lru = self.order.pop(0)\n            del self.cache[lru]\n        self.cache[key] = value\n        self.order.append(key)', testCases: [{ input: 'put(1,1), put(2,2), get(1)', expectedOutput: '1' }], difficulty: 'expert' },
      ],
      subtopics: [
        { id: 'ht-1', title: 'Hash Functions', content: 'A good hash function distributes keys uniformly across buckets to minimize collisions.' },
      ],
    },
    trees: {
      id: 'trees', title: 'Trees & Binary Trees', description: 'Hierarchical structures — the foundation of search and sort algorithms.', difficulty: 'intermediate', estimatedMinutes: 30, prerequisiteIds: ['linked-lists'],
      explanation: `# Trees

A tree is a hierarchical structure where each node has zero or more children.

## Binary Tree
Each node has at most 2 children (left and right).

\`\`\`
        1
       / \\
      2   3
     / \\   \\
    4   5   6
\`\`\`

## Traversals
- **Pre-order** (NLR): 1, 2, 4, 5, 3, 6
- **In-order** (LNR): 4, 2, 5, 1, 3, 6
- **Post-order** (LRN): 4, 5, 2, 6, 3, 1
- **Level-order**: 1, 2, 3, 4, 5, 6`,
      visualizationType: 'tree',
      exercises: [
        { id: 'tree-ex-1', title: 'Maximum Depth', description: 'Find the maximum depth of a binary tree.', starterCode: 'def max_depth(root):\n    # Return the depth', solution: 'def max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))', testCases: [{ input: '[1,2,3,null,null,null,6]', expectedOutput: '3' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'tree-ch-1', title: 'Serialize & Deserialize', description: 'Convert a binary tree to a string and back.', starterCode: 'def serialize(root):\n    # Tree → string\n\ndef deserialize(data):\n    # string → tree', solution: 'def serialize(root):\n    if not root: return "#"\n    return str(root.val) + "," + serialize(root.left) + "," + serialize(root.right)\n\ndef deserialize(data):\n    nodes = iter(data.split(","))\n    def build():\n        val = next(nodes)\n        if val == "#": return None\n        node = TreeNode(int(val))\n        node.left = build()\n        node.right = build()\n        return node\n    return build()', testCases: [{ input: '[1,2,3,null,null,4,5]', expectedOutput: '[1,2,3,null,null,4,5]' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'tree-1', title: 'Balanced Trees', content: 'AVL and Red-Black trees maintain balance to guarantee O(log n) operations.' },
      ],
    },
    graphs: {
      id: 'graphs', title: 'Graphs', description: 'Nodes connected by edges — modeling real-world relationships.', difficulty: 'advanced', estimatedMinutes: 30, prerequisiteIds: ['trees'],
      explanation: `# Graphs

A graph consists of **vertices** (nodes) connected by **edges**.

## Representations
- **Adjacency List** — each node maps to a list of neighbors
- **Adjacency Matrix** — 2D array where \`\`matrix[i][j] = 1\`\` if edge exists

## Types
- **Directed** — edges have direction (A→B)
- **Undirected** — edges are bidirectional (A—B)
- **Weighted** — edges have associated costs
- **Cyclic/Acyclic** — contains cycles or not

## Applications
Social networks, road maps, dependency resolution, web links.`,
      visualizationType: 'graph',
      exercises: [
        { id: 'graph-ex-1', title: 'Number of Islands', description: 'Count islands (connected 1s) in a grid using DFS.', starterCode: 'def num_islands(grid):\n    # Return count of islands', solution: 'def num_islands(grid):\n    if not grid: return 0\n    count = 0\n    for r in range(len(grid)):\n        for c in range(len(grid[0])):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(grid, r, c)\n    return count\n\ndef dfs(grid, r, c):\n    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != "1": return\n    grid[r][c] = "0"\n    dfs(grid, r+1, c); dfs(grid, r-1, c)\n    dfs(grid, r, c+1); dfs(grid, r, c-1)', testCases: [{ input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', expectedOutput: '2' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'graph-ch-1', title: 'Course Schedule', description: "Determine if you can finish all courses given prerequisites (cycle detection in DAG).", starterCode: 'def can_finish(num_courses, prerequisites):\n    # Return True/False', solution: 'def can_finish(num_courses, prerequisites):\n    graph = [[] for _ in range(num_courses)]\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n    visited = [0] * num_courses  # 0=unvisited, 1=visiting, 2=visited\n    def has_cycle(node):\n        if visited[node] == 1: return True\n        if visited[node] == 2: return False\n        visited[node] = 1\n        for neighbor in graph[node]:\n            if has_cycle(neighbor): return True\n        visited[node] = 2\n        return False\n    return not any(has_cycle(i) for i in range(num_courses))', testCases: [{ input: '4, [[1,0],[2,1],[3,2]]', expectedOutput: 'True' }], difficulty: 'expert' },
      ],
      subtopics: [
        { id: 'graph-1', title: 'Graph Representations', content: 'Adjacency lists are space-efficient for sparse graphs; matrices are better for dense graphs.' },
      ],
    },
    // ── Module 3: Core Algorithms ─────────────────────────────────────────
    'linear-search': {
      id: 'linear-search', title: 'Linear Search', description: 'Check every element sequentially — simple but O(n).', difficulty: 'beginner', estimatedMinutes: 10, prerequisiteIds: ['arrays'],
      explanation: `# Linear Search

The simplest search: check each element one by one until you find the target.

\`\`\`python
def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1\n\`\`\`

## Complexity
- **Best case**: O(1) — found at first position
- **Worst case**: O(n) — found at last position or not found
- **Average case**: O(n/2) = O(n)`,
      visualizationType: 'flow',
      exercises: [
        { id: 'ls-ex-1', title: 'Find Element', description: 'Implement linear search and count comparisons made.', starterCode: 'def linear_search_with_count(arr, target):\n    # Return (index, comparisons)', solution: 'def linear_search_with_count(arr, target):\n    comparisons = 0\n    for i in range(len(arr)):\n        comparisons += 1\n        if arr[i] == target:\n            return i, comparisons\n    return -1, comparisons', testCases: [{ input: '[5,3,8,1,9], 8', expectedOutput: '(2, 3)' }], difficulty: 'beginner', aiGenerated: false },
      ],
      challenges: [
        { id: 'ls-ch-1', title: 'Sentinel Search', description: 'Optimize linear search by placing the target at the end as a sentinel.', starterCode: 'def sentinel_search(arr, target):\n    # O(n) but with fewer comparisons', solution: 'def sentinel_search(arr, target):\n    last = arr[-1]\n    arr[-1] = target\n    i = 0\n    while arr[i] != target:\n        i += 1\n    arr[-1] = last\n    if i < len(arr) - 1 or arr[-1] == target:\n        return i\n    return -1', testCases: [{ input: '[5,3,8,1,9], 8', expectedOutput: '2' }], difficulty: 'intermediate' },
      ],
      subtopics: [],
    },
    'binary-search': {
      id: 'binary-search', title: 'Binary Search', description: 'Halve the search space each step — O(log n) on sorted arrays.', difficulty: 'intermediate', estimatedMinutes: 20, prerequisiteIds: ['linear-search', 'arrays'],
      explanation: `# Binary Search

On a **sorted** array, compare the middle element and eliminate half the remaining elements each step.

\`\`\`python
def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n\`\`\`

## Visualization
\`\`\`
[1, 3, 5, 7, 9, 11, 13]  target=7
         mid=7 ✓ found!

[1, 3, 5, 7, 9, 11, 13]  target=3
         mid=7 → go left
[1, 3, 5]
  mid=3 ✓ found!
\`\`\``,
      visualizationType: 'flow',
      exercises: [
        { id: 'bs-ex-1', title: 'Find Target Index', description: 'Implement binary search on a sorted array.', starterCode: 'def binary_search(arr, target):\n    # Return index or -1', solution: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1', testCases: [{ input: '[1,3,5,7,9], 7', expectedOutput: '3' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'bs-ch-1', title: 'Search in Rotated Sorted Array', description: 'Binary search in an array that was rotated at an unknown pivot.', starterCode: 'def search_rotated(nums, target):\n    # Return index or -1', solution: 'def search_rotated(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]: right = mid - 1\n            else: left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]: left = mid + 1\n            else: right = mid - 1\n    return -1', testCases: [{ input: '[4,5,6,7,0,1,2], 0', expectedOutput: '4' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'bs-1', title: 'Lower/Upper Bound', content: 'Variants that find the first/last occurrence of a value in a sorted array with duplicates.' },
      ],
    },
    'bubble-sort': {
      id: 'bubble-sort', title: 'Bubble Sort', description: 'Repeatedly swap adjacent elements — simple but O(n²).', difficulty: 'beginner', estimatedMinutes: 15, prerequisiteIds: ['linear-search'],
      explanation: `# Bubble Sort

Repeatedly compare adjacent elements and swap if out of order. After each pass, the largest element "bubbles" to the end.

\`\`\`python
def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = True\n        if not swapped: break\n\`\`\`

## Visualization
\`\`\`
Pass 1: [5,3,8,1,9] → [3,5,1,8,9]  (9 bubbled)
Pass 2: [3,5,1,8,9] → [3,1,5,8,9]  (8 bubbled)
Pass 3: [3,1,5,8,9] → [1,3,5,8,9]  (5 bubbled)
Pass 4: [1,3,5,8,9] → [1,3,5,8,9]  (sorted! early exit)
\`\`\``,
      visualizationType: 'flow',
      exercises: [
        { id: 'bub-ex-1', title: 'Count Swaps', description: 'Modify bubble sort to count the total number of swaps performed.', starterCode: 'def bubble_sort_with_swaps(arr):\n    # Return (sorted_array, swap_count)', solution: 'def bubble_sort_with_swaps(arr):\n    arr = arr[:]\n    swaps = 0\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swaps += 1\n                swapped = True\n        if not swapped: break\n    return arr, swaps', testCases: [{ input: '[5,3,8,1,9]', expectedOutput: '[1,3,5,8,9], 5' }], difficulty: 'beginner', aiGenerated: false },
      ],
      challenges: [
        { id: 'bub-ch-1', title: 'Cocktail Shaker Sort', description: 'Bidirectional bubble sort — scan left-to-right then right-to-left.', starterCode: 'def cocktail_sort(arr):\n    # Bidirectional bubble sort', solution: 'def cocktail_sort(arr):\n    arr = arr[:]\n    start, end = 0, len(arr) - 1\n    swapped = True\n    while swapped:\n        swapped = False\n        for i in range(start, end):\n            if arr[i] > arr[i+1]:\n                arr[i], arr[i+1] = arr[i+1], arr[i]\n                swapped = True\n        end -= 1\n        if not swapped: break\n        swapped = False\n        for i in range(end, start, -1):\n            if arr[i] < arr[i-1]:\n                arr[i], arr[i-1] = arr[i-1], arr[i]\n                swapped = True\n        start += 1\n    return arr', testCases: [{ input: '[5,3,8,1,9]', expectedOutput: '[1,3,5,8,9]' }], difficulty: 'intermediate' },
      ],
      subtopics: [
        { id: 'bub-1', title: 'Why Bubble Sort Matters', content: "Despite its inefficiency, bubble sort teaches the fundamental concept of comparison-based sorting and early-exit optimization." },
      ],
    },
    'merge-sort': {
      id: 'merge-sort', title: 'Merge Sort', description: 'Divide and conquer — split, sort halves, merge. O(n log n) guaranteed.', difficulty: 'intermediate', estimatedMinutes: 25, prerequisiteIds: ['binary-search', 'recursion-basics'],
      explanation: `# Merge Sort

A **divide and conquer** algorithm:
1. Split the array in half
2. Recursively sort each half
3. Merge the sorted halves

\`\`\`python
def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\`\`\`

## Merge Step
Compare the front of each sorted half and append the smaller element.

## Complexity
- **Time**: O(n log n) — always, best/worst/average
- **Space**: O(n) — needs temporary arrays for merging`,
      visualizationType: 'tree',
      exercises: [
        { id: 'ms-ex-1', title: 'Implement Merge Sort', description: 'Write merge sort from scratch with a merge helper function.', starterCode: 'def merge_sort(arr):\n    # Divide and conquer\n\ndef merge(left, right):\n    # Merge two sorted arrays', solution: 'def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result', testCases: [{ input: '[5,3,8,1,9]', expectedOutput: '[1,3,5,8,9]' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'ms-ch-1', title: 'Count Inversions', description: 'Count the number of inversions (out-of-order pairs) using a modified merge sort.', starterCode: 'def count_inversions(arr):\n    # Return inversion count', solution: 'def count_inversions(arr):\n    if len(arr) <= 1: return arr, 0\n    mid = len(arr) // 2\n    left, inv_left = count_inversions(arr[:mid])\n    right, inv_right = count_inversions(arr[mid:])\n    merged, inv_merge = merge_count(left, right)\n    return merged, inv_left + inv_right + inv_merge\n\ndef merge_count(left, right):\n    result = []; inversions = 0; i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n            inversions += len(left) - i\n    result.extend(left[i:]); result.extend(right[j:])\n    return result, inversions', testCases: [{ input: '[5,3,8,1,9]', expectedOutput: '5' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'ms-1', title: 'Stable Sorting', content: 'Merge sort is stable — equal elements maintain their relative order. This matters for multi-key sorting.' },
      ],
    },
    bfs: {
      id: 'bfs', title: 'Breadth-First Search', description: 'Explore level by level using a queue — finds shortest path in unweighted graphs.', difficulty: 'intermediate', estimatedMinutes: 20, prerequisiteIds: ['graphs', 'queues'],
      explanation: `# Breadth-First Search (BFS)

Explore all neighbors at the current depth before moving deeper. Uses a **queue**.

\`\`\`python
def bfs(graph, start):\n    visited = set()\n    queue = [start]\n    visited.add(start)\n    while queue:\n        node = queue.pop(0)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return visited\n\`\`\`

## Level-by-Level Traversal
\`\`\`
Level 0:    A
Level 1:  B   C
Level 2: D E   F
\`\`\`

## Applications
- Shortest path in unweighted graphs
- Web crawling
- Finding connected components`,
      visualizationType: 'graph',
      exercises: [
        { id: 'bfs-ex-1', title: 'BFS Traversal', description: 'Implement BFS and return nodes in level-order.', starterCode: 'def bfs_traversal(graph, start):\n    # Return list of nodes in BFS order', solution: 'def bfs_traversal(graph, start):\n    visited = set()\n    queue = [start]\n    result = []\n    visited.add(start)\n    while queue:\n        node = queue.pop(0)\n        result.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return result', testCases: [{ input: '{A:[B,C], B:[D,E], C:[F], D:[], E:[], F:[]}, A', expectedOutput: '[A,B,C,D,E,F]' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'bfs-ch-1', title: 'Shortest Path in Grid', description: 'Find the shortest path from top-left to bottom-right in a maze grid.', starterCode: 'def shortest_path(grid):\n    # Return path length or -1', solution: 'def shortest_path(grid):\n    rows, cols = len(grid), len(grid[0])\n    if grid[0][0] or grid[rows-1][cols-1]: return -1\n    queue = [(0, 0, 1)]\n    grid[0][0] = 1\n    for r, c, dist in queue:\n        if r == rows-1 and c == cols-1: return dist\n        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]:\n            nr, nc = r+dr, c+dc\n            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:\n                grid[nr][nc] = 1\n                queue.append((nr, nc, dist+1))\n    return -1', testCases: [{ input: '[[0,1],[1,0]]', expectedOutput: '4' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'bfs-1', title: 'BFS vs DFS', content: 'BFS finds shortest paths; DFS uses less memory. Choose based on your goal.' },
      ],
    },
    dfs: {
      id: 'dfs', title: 'Depth-First Search', description: 'Explore as deep as possible first using recursion or a stack.', difficulty: 'intermediate', estimatedMinutes: 20, prerequisiteIds: ['graphs', 'stacks-queues'],
      explanation: `# Depth-First Search (DFS)

Explore as far as possible along each branch before backtracking.

\`\`\`python
def dfs(graph, node, visited):\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n\`\`\`

## Iterative (Stack-based)
\`\`\`python
def dfs_iterative(graph, start):\n    visited = set()\n    stack = [start]\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            stack.extend(reversed(graph[node]))\n\`\`\`

## Applications
- Topological sort
- Cycle detection
- Pathfinding
- Solving mazes`,
      visualizationType: 'graph',
      exercises: [
        { id: 'dfs-ex-1', title: 'DFS Traversal', description: 'Implement DFS and return nodes in DFS order.', starterCode: 'def dfs_traversal(graph, start):\n    # Return list of nodes in DFS order', solution: 'def dfs_traversal(graph, start):\n    visited = set()\n    result = []\n    def dfs(node):\n        visited.add(node)\n        result.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                dfs(neighbor)\n    dfs(start)\n    return result', testCases: [{ input: '{A:[B,C], B:[D,E], C:[F], D:[], E:[], F:[]}, A', expectedOutput: '[A,B,D,E,C,F]' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'dfs-ch-1', title: 'Word Search', description: 'Find a word in a 2D grid by moving in 4 directions.', starterCode: 'def word_search(board, word):\n    # Return True/False', solution: 'def word_search(board, word):\n    rows, cols = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]: return False\n        temp = board[r][c]; board[r][c] = "#"\n        found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)\n        board[r][c] = temp\n        return found\n    for r in range(rows):\n        for c in range(cols):\n            if dfs(r, c, 0): return True\n    return False', testCases: [{ input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', expectedOutput: 'True' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'dfs-1', title: 'Backtracking', content: 'DFS naturally supports backtracking — undo the last decision and try the next option.' },
      ],
    },
    // ── Module 4: Recursion ───────────────────────────────────────────────
    'recursion-basics': {
      id: 'recursion-basics', title: 'Recursion Fundamentals', description: 'Functions that call themselves — base case and recursive case.', difficulty: 'intermediate', estimatedMinutes: 25, prerequisiteIds: ['functions'],
      explanation: `# Recursion Fundamentals

A recursive function calls itself with a smaller input until it reaches a **base case**.

\`\`\`python
def factorial(n):\n    # Base case\n    if n <= 1: return 1\n    # Recursive case\n    return n * factorial(n - 1)\n\`\`\`

## Key Concepts
1. **Base case** — the stopping condition (prevents infinite recursion)
2. **Recursive case** — the function calls itself with a modified input
3. **Call stack** — each recursive call pushes a new frame

## Recursion Tree for factorial(4)
\`\`\`
factorial(4)
├── 4 * factorial(3)
│   ├── 3 * factorial(2)
│   │   ├── 2 * factorial(1)
│   │   │   └── 1 (base case)
│   │   └── = 2
│   └── = 6
└── = 24
\`\`\``,
      visualizationType: 'tree',
      exercises: [
        { id: 'rec-ex-1', title: 'Fibonacci Recursive', description: 'Implement recursive Fibonacci and count the number of function calls.', starterCode: 'def fibonacci_recursive(n):\n    # Return (fib(n), call_count)', solution: 'call_count = 0\ndef fibonacci_recursive(n):\n    global call_count\n    call_count += 1\n    if n <= 1: return n\n    return fibonacci_recursive(n-1) + fibonacci_recursive(n-2)', testCases: [{ input: '5', expectedOutput: '5, 15 calls' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'rec-ch-1', title: 'Tower of Hanoi', description: 'Solve Tower of Hanoi for n disks — print each move.', starterCode: 'def hanoi(n, source, target, auxiliary):\n    # Print each move', solution: 'def hanoi(n, source, target, auxiliary):\n    if n == 1:\n        print(f"Move disk 1 from {source} to {target}")\n        return\n    hanoi(n-1, source, auxiliary, target)\n    print(f"Move disk {n} from {source} to {target}")\n    hanoi(n-1, auxiliary, target, source)', testCases: [{ input: '3, A, C, B', expectedOutput: '7 moves' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'rec-1', title: 'Stack Overflow', content: 'Each recursive call consumes stack space. Python defaults to ~1000 frames — use iteration or sys.setrecursionlimit() for deep recursion.' },
      ],
    },
    backtracking: {
      id: 'backtracking', title: 'Backtracking', description: 'Try options, undo if they fail — recursion with exploration.', difficulty: 'advanced', estimatedMinutes: 25, prerequisiteIds: ['recursion-basics'],
      explanation: `# Backtracking

Systematically try all possibilities by:
1. **Choose** an option
2. **Explore** — recurse
3. **Un-choose** — backtrack if this path doesn't work

\`\`\`python
def backtrack(path, choices):\n    if is_solution(path):\n        solutions.append(path[:])\n        return\n    for choice in choices:\n        if is_valid(choice):\n            path.append(choice)          # Choose\n            backtrack(path, choices)     # Explore\n            path.pop()                    # Un-choose\n\`\`\`

## Classic Problems
- Permutations
- Subsets
- N-Queens
- Sudoku`,
      visualizationType: 'tree',
      exercises: [
        { id: 'bt-ex-1', title: 'Generate Permutations', description: 'Generate all permutations of [1, 2, 3] using backtracking.', starterCode: 'def permute(nums):\n    # Return all permutations', solution: 'def permute(nums):\n    result = []\n    def backtrack(path, remaining):\n        if not remaining:\n            result.append(path[:])\n            return\n        for i in range(len(remaining)):\n            path.append(remaining[i])\n            backtrack(path, remaining[:i] + remaining[i+1:])\n            path.pop()\n    backtrack([], nums)\n    return result', testCases: [{ input: '[1,2,3]', expectedOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'bt-ch-1', title: 'Sudoku Solver', description: 'Solve a Sudoku puzzle using backtracking.', starterCode: 'def solve_sudoku(board):\n    # Modify board in-place', solution: 'def solve_sudoku(board):\n    def is_valid(board, row, col, num):\n        for i in range(9):\n            if board[row][i] == num or board[i][col] == num: return False\n        r, c = 3*(row//3), 3*(col//3)\n        for i in range(3):\n            for j in range(3):\n                if board[r+i][c+j] == num: return False\n        return True\n    for i in range(9):\n        for j in range(9):\n            if board[i][j] == ".":\n                for num in "123456789":\n                    if is_valid(board, i, j, num):\n                        board[i][j] = num\n                        if solve_sudoku(board): return True\n                        board[i][j] = "."\n                return False\n    return True', testCases: [{ input: 'Partial board', expectedOutput: 'Solved board' }], difficulty: 'expert' },
      ],
      subtopics: [
        { id: 'bt-1', title: 'Pruning', content: 'Skip branches that can\'t possibly lead to a solution — this turns exponential backtracking into tractable search.' },
      ],
    },
    'n-queens': {
      id: 'n-queens', title: 'N-Queens Problem', description: 'Place N queens on an NxN board so no two attack each other.', difficulty: 'advanced', estimatedMinutes: 30, prerequisiteIds: ['backtracking'],
      explanation: `# N-Queens Problem

Place N queens on an NxN chessboard so no two queens share the same row, column, or diagonal.

## Backtracking Solution
Place queens row by row. For each row, try each column. If a placement is valid, recurse to the next row. If no column works, backtrack.

\`\`\`python
def solve_n_queens(n):\n    def is_safe(row, col, queens):\n        for r, c in queens:\n            if c == col or abs(r - row) == abs(c - col):\n                return False\n        return True\n    \n    def backtrack(row, queens):\n        if row == n:\n            solutions.append(queens[:])\n            return\n        for col in range(n):\n            if is_safe(row, col, queens):\n                queens.append((row, col))\n                backtrack(row + 1, queens)\n                queens.pop()\n    \n    solutions = []\n    backtrack(0, [])\n    return solutions\n\`\`\``,
      visualizationType: 'custom',
      exercises: [
        { id: 'nq-ex-1', title: 'Count Solutions', description: 'Count the number of distinct solutions for N-Queens.', starterCode: 'def total_n_queens(n):\n    # Return count of solutions', solution: 'def total_n_queens(n):\n    count = 0\n    cols = set()\n    pos_diag = set()\n    neg_diag = set()\n    def backtrack(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row+col) in pos_diag or (row-col) in neg_diag:\n                continue\n            cols.add(col); pos_diag.add(row+col); neg_diag.add(row-col)\n            backtrack(row + 1)\n            cols.remove(col); pos_diag.remove(row+col); neg_diag.remove(row-col)\n    backtrack(0)\n    return count', testCases: [{ input: '4', expectedOutput: '2' }, { input: '8', expectedOutput: '92' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'nq-ch-1', title: 'Unique Solutions Up to Symmetry', description: 'Count solutions that are unique under rotation and reflection.', starterCode: 'def unique_n_queens(n):\n    # Account for board symmetries', solution: '# Requires generating all solutions and filtering by symmetry group (D4 — 8 symmetries)', testCases: [{ input: '8', expectedOutput: '12' }], difficulty: 'expert' },
      ],
      subtopics: [],
    },
    // ── Module 5: Dynamic Programming ─────────────────────────────────────
    'dp-basics': {
      id: 'dp-basics', title: 'Dynamic Programming Basics', description: 'Memoization and tabulation — trading space for time.', difficulty: 'advanced', estimatedMinutes: 30, prerequisiteIds: ['recursion-basics'],
      explanation: `# Dynamic Programming

DP solves problems by breaking them into overlapping subproblems and storing results.

## Two Approaches

### Top-Down (Memoization)
Start from the original problem, recurse down, cache results.
\`\`\`python
memo = {}\ndef fib(n):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n\`\`\`

### Bottom-Up (Tabulation)
Start from base cases, build up iteratively.
\`\`\`python
def fib(n):\n    dp = [0, 1]\n    for i in range(2, n+1):\n        dp.append(dp[i-1] + dp[i-2])\n    return dp[n]\n\`\`\`

## When to Use DP
1. **Optimal substructure** — optimal solution built from optimal sub-solutions
2. **Overlapping subproblems** — same subproblems solved repeatedly`,
      visualizationType: 'flow',
      exercises: [
        { id: 'dp-ex-1', title: 'Climbing Stairs', description: 'You can climb 1 or 2 steps. How many ways to reach step n?', starterCode: 'def climb_stairs(n):\n    # Return number of ways', solution: 'def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1):\n        a, b = b, a + b\n    return b', testCases: [{ input: '5', expectedOutput: '8' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'dp-ch-1', title: 'Longest Increasing Subsequence', description: 'Find the length of the longest strictly increasing subsequence.', starterCode: 'def lis(nums):\n    # Return length of LIS', solution: 'def lis(nums):\n    if not nums: return 0\n    dp = [1] * len(nums)\n    for i in range(1, len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)', testCases: [{ input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'dp-1', title: 'State Space', content: 'The key to DP is defining the right "state" — what minimum information do you need to make a decision?' },
      ],
    },
    'fibonacci-dp': {
      id: 'fibonacci-dp', title: 'Fibonacci with DP', description: 'From exponential recursion to O(n) — the canonical DP example.', difficulty: 'intermediate', estimatedMinutes: 15, prerequisiteIds: ['dp-basics'],
      explanation: `# Fibonacci: A DP Case Study

## Recursive (Exponential — Bad)
\`\`\`python
def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n# fib(40) takes ~30 seconds!\n\`\`\`

## Memoized (O(n) — Good)
\`\`\`python\nmemo = {}\ndef fib(n):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n# fib(40) takes microseconds!\n\`\`\`

## Tabulated (O(n) — Better)
\`\`\`python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n): a, b = b, a + b\n    return a\n# O(1) space!\n\`\`\``,
      visualizationType: 'flow',
      exercises: [
        { id: 'fib-dp-ex-1', title: 'Memoized Fibonacci', description: 'Implement memoized Fibonacci and compare call counts with plain recursion.', starterCode: 'def fib_memo(n, memo=None):\n    # Return fib(n)', solution: 'def fib_memo(n, memo=None):\n    if memo is None: memo = {}\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)\n    return memo[n]', testCases: [{ input: '10', expectedOutput: '55' }], difficulty: 'intermediate', aiGenerated: false },
      ],
      challenges: [
        { id: 'fib-dp-ch-1', title: 'Matrix Exponentiation', description: 'Compute Fibonacci in O(log n) using matrix exponentiation.', starterCode: 'def fib_fast(n):\n    # O(log n) Fibonacci', solution: 'def fib_fast(n):\n    def multiply(A, B):\n        return [\n            [A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]],\n            [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]\n        ]\n    def power(A, n):\n        if n <= 1: return A\n        half = power(A, n//2)\n        result = multiply(half, half)\n        return multiply(result, A) if n % 2 else result\n    if n <= 1: return n\n    M = [[1,1],[1,0]]\n    return power(M, n-1)[0][0]', testCases: [{ input: '50', expectedOutput: '12586269025' }], difficulty: 'expert' },
      ],
      subtopics: [],
    },
    knapsack: {
      id: 'knapsack', title: '0/1 Knapsack', description: 'Maximize value within weight capacity — the classic DP problem.', difficulty: 'advanced', estimatedMinutes: 25, prerequisiteIds: ['dp-basics'],
      explanation: `# 0/1 Knapsack

Given items with weights and values, maximize total value without exceeding capacity. Each item can be taken at most once.

\`\`\`python\ndef knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0]*(capacity+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(capacity+1):\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])\n            else:\n                dp[i][w] = dp[i-1][w]\n    return dp[n][capacity]\n\`\`\`

## DP Table Visualization
Each cell \`\`dp[i][w]\`\` = max value using first i items with capacity w.`,
      visualizationType: 'flow',
      exercises: [
        { id: 'kn-ex-1', title: 'Knapsack', description: 'Solve the 0/1 knapsack problem with given weights and values.', starterCode: 'def knapsack(weights, values, capacity):\n    # Return max value', solution: 'def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0]*(capacity+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(capacity+1):\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])\n            else:\n                dp[i][w] = dp[i-1][w]\n    return dp[n][capacity]', testCases: [{ input: 'weights=[1,3,4,5], values=[1,4,5,7], capacity=7', expectedOutput: '9' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'kn-ch-1', title: 'Unbounded Knapsack', description: 'Each item can be used unlimited times.', starterCode: 'def unbounded_knapsack(weights, values, capacity):\n    # Each item can be used multiple times', solution: 'def unbounded_knapsack(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    for w in range(1, capacity + 1):\n        for i in range(len(weights)):\n            if weights[i] <= w:\n                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])\n    return dp[capacity]', testCases: [{ input: 'weights=[1,3,4], values=[1,4,5], capacity=7', expectedOutput: '9' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'kn-1', title: 'Space Optimization', content: 'The 2D DP table can be reduced to 1D since dp[i] only depends on dp[i-1].' },
      ],
    },
    // ── Module 6: Advanced Graph Algorithms ───────────────────────────────
    dijkstra: {
      id: 'dijkstra', title: "Dijkstra's Algorithm", description: 'Shortest path in weighted graphs — greedy + priority queue.', difficulty: 'advanced', estimatedMinutes: 30, prerequisiteIds: ['graphs', 'bfs', 'hash-tables'],
      explanation: `# Dijkstra's Algorithm

Finds the shortest path from a source to all other nodes in a **weighted** graph (no negative edges).

## Algorithm
1. Set distance to source = 0, all others = ∞
2. Use a **min-heap** (priority queue) to always process the closest unvisited node
3. For each neighbor, relax: if \`dist[u] + weight < dist[v]\`, update \`dist[v]\`

\`\`\`python\nimport heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    \n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist\n\`\`\``,
      visualizationType: 'graph',
      exercises: [
        { id: 'dij-ex-1', title: "Dijkstra's Shortest Path", description: 'Find shortest distances from a source node.', starterCode: 'def dijkstra(graph, start):\n    # Return dict of shortest distances', solution: 'import heapq\ndef dijkstra(graph, start):\n    dist = {node: float("inf") for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist', testCases: [{ input: '{A:[(B,4),(C,2)], B:[(C,1),(D,5)], C:[(D,8),(E,10)], D:[(E,2)], E:[]}, A', expectedOutput: '{A:0, B:4, C:2, D:9, E:11}' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'dij-ch-1', title: 'Network Delay Time', description: 'Given a network, find the time for a signal to reach all nodes.', starterCode: 'def network_delay_time(times, n, k):\n    # times = [(u, v, w), ...]', solution: 'import heapq\ndef network_delay_time(times, n, k):\n    graph = {i: [] for i in range(1, n+1)}\n    for u, v, w in times:\n        graph[u].append((v, w))\n    dist = {i: float("inf") for i in range(1, n+1)}\n    dist[k] = 0\n    pq = [(0, k)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return max(dist.values()) if max(dist.values()) < float("inf") else -1', testCases: [{ input: 'times=[(2,1,1),(2,3,1),(3,4,1)], n=4, k=2', expectedOutput: '2' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'dij-1', title: 'Greedy Choice Property', content: "Dijkstra works because the greedy choice (closest unvisited node) is always optimal — but only with non-negative weights." },
      ],
    },
    mst: {
      id: 'mst', title: 'Minimum Spanning Tree', description: "Connect all nodes with minimum total edge weight — Kruskal's and Prim's.", difficulty: 'advanced', estimatedMinutes: 25, prerequisiteIds: ['graphs', 'dijkstra'],
      explanation: `# Minimum Spanning Tree (MST)

A tree that connects all nodes with the minimum total edge weight.

## Kruskal's Algorithm (Union-Find)
1. Sort all edges by weight
2. Add edges one by one, skipping those that would create a cycle
3. Stop when n-1 edges are added

## Prim's Algorithm (Greedy)
1. Start from any node
2. Always add the cheapest edge connecting the tree to a new node
3. Repeat until all nodes are included

## Applications
- Network design
- Cluster analysis
- Approximation algorithms`,
      visualizationType: 'graph',
      exercises: [
        { id: 'mst-ex-1', title: "Kruskal's MST", description: "Implement Kruskal's algorithm to find the MST weight.", starterCode: 'def kruskal_mst(n, edges):\n    # edges = [(u, v, w), ...]\n    # Return total MST weight', solution: 'def kruskal_mst(n, edges):\n    parent = list(range(n))\n    def find(x):\n        if parent[x] != x: parent[x] = find(parent[x])\n        return parent[x]\n    def union(x, y):\n        px, py = find(x), find(y)\n        if px != py: parent[px] = py; return True\n        return False\n    edges.sort(key=lambda e: e[2])\n    weight = 0\n    for u, v, w in edges:\n        if union(u, v): weight += w\n    return weight', testCases: [{ input: '4, [(0,1,1),(1,2,2),(2,3,3),(0,3,4),(0,2,5)]', expectedOutput: '6' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'mst-ch-1', title: 'Connect Cities with Minimum Cost', description: 'Given cities and possible connections with costs, find minimum cost to connect all cities.', starterCode: 'def connect_cities(n, connections):\n    # Return min cost or -1', solution: 'def connect_cities(n, connections):\n    parent = list(range(n+1))\n    def find(x):\n        if parent[x] != x: parent[x] = find(parent[x])\n        return parent[x]\n    def union(x, y):\n        px, py = find(x), find(y)\n        if px != py: parent[px] = py; return True\n        return False\n    connections.sort(key=lambda e: e[2])\n    cost = edges_used = 0\n    for u, v, w in connections:\n        if union(u, v):\n            cost += w\n            edges_used += 1\n    return cost if edges_used == n - 1 else -1', testCases: [{ input: '3, [(1,2,5),(1,3,6),(2,3,1)]', expectedOutput: '6' }], difficulty: 'advanced' },
      ],
      subtopics: [
        { id: 'mst-1', title: 'Cut Property', content: 'The lightest edge crossing any cut must be in the MST — this is why greedy works.' },
      ],
    },
    'topological-sort': {
      id: 'topological-sort', title: 'Topological Sort', description: 'Linear ordering of a DAG — essential for build systems and scheduling.', difficulty: 'advanced', estimatedMinutes: 20, prerequisiteIds: ['graphs', 'dfs'],
      explanation: `# Topological Sort

A linear ordering of vertices such that for every directed edge u→v, u comes before v. Only works on **DAGs** (Directed Acyclic Graphs).

## Kahn's Algorithm (BFS-based)
1. Compute in-degree for each node
2. Add all nodes with in-degree 0 to a queue
3. Process nodes: remove from queue, decrease in-degree of neighbors, add newly 0-degree nodes

## DFS-based
1. Do DFS, add nodes to result after visiting all descendants
2. Reverse the result

## Applications
- Build systems (Make, npm)
- Course scheduling
- Task dependencies`,
      visualizationType: 'graph',
      exercises: [
        { id: 'topo-ex-1', title: 'Topological Sort', description: "Implement topological sort using Kahn's algorithm.", starterCode: 'def topological_sort(n, edges):\n    # Return ordering or [] if cycle', solution: 'def topological_sort(n, edges):\n    in_degree = [0] * n\n    graph = [[] for _ in range(n)]\n    for u, v in edges:\n        graph[u].append(v)\n        in_degree[v] += 1\n    queue = [i for i in range(n) if in_degree[i] == 0]\n    result = []\n    while queue:\n        node = queue.pop(0)\n        result.append(node)\n        for neighbor in graph[node]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0: queue.append(neighbor)\n    return result if len(result) == n else []', testCases: [{ input: '4, [(0,1),(0,2),(1,3),(2,3)]', expectedOutput: '[0,1,2,3]' }], difficulty: 'advanced', aiGenerated: false },
      ],
      challenges: [
        { id: 'topo-ch-1', title: 'Alien Dictionary', description: 'Given a sorted list of words in an alien language, determine the character order.', starterCode: 'def alien_order(words):\n    # Return character order or ""', solution: 'def alien_order(words):\n    graph = {c: set() for c in "".join(words)}\n    in_degree = {c: 0 for c in graph}\n    for i in range(len(words)-1):\n        w1, w2 = words[i], words[i+1]\n        if len(w1) > len(w2) and w1[:len(w2)] == w2: return ""\n        for c1, c2 in zip(w1, w2):\n            if c1 != c2:\n                if c2 not in graph[c1]:\n                    graph[c1].add(c2)\n                    in_degree[c2] += 1\n                break\n    queue = [c for c in in_degree if in_degree[c] == 0]\n    result = []\n    while queue:\n        c = queue.pop(0)\n        result.append(c)\n        for neighbor in graph[c]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0: queue.append(neighbor)\n    return "".join(result) if len(result) == len(graph) else ""', testCases: [{ input: '["wrt","wrf","er","ett","rftt"]', expectedOutput: '"wertf"' }], difficulty: 'expert' },
      ],
      subtopics: [
        { id: 'topo-1', title: 'DAG Verification', content: "Topological sort also serves as cycle detection — if the result has fewer nodes than the graph, there's a cycle." },
      ],
    },
  },
  projects: [
    {
      id: 'task-manager-cli',
      title: 'Build a Task Manager CLI',
      description: 'A command-line task manager that supports CRUD operations, due dates, priorities, and file persistence.',
      requiredTopicIds: ['variables', 'control-flow', 'functions', 'arrays', 'hash-tables'],
      milestones: [
        { id: 'tm-1', title: 'Core Data Model', description: 'Define Task struct/class with title, description, priority, due date, and status.', completed: false },
        { id: 'tm-2', title: 'CRUD Operations', description: 'Implement add, list, complete, and delete commands.', completed: false },
        { id: 'tm-3', title: 'File Persistence', description: 'Save and load tasks from a JSON/CSV file.', completed: false },
        { id: 'tm-4', title: 'Priority & Filtering', description: 'Sort by priority, filter by status, search by keyword.', completed: false },
        { id: 'tm-5', title: 'Polish & Testing', description: 'Add input validation, error messages, and a help command.', completed: false },
      ],
      starterCode: '# Task Manager CLI\n# Implement the following commands:\n#   add <title> [--priority HIGH|MEDIUM|LOW] [--due DATE]\n#   list [--status TODO|DONE]\n#   complete <id>\n#   delete <id>\n#   help',
      difficulty: 'intermediate',
      estimatedHours: 8,
    },
    {
      id: 'pathfinding-visualizer',
      title: 'Build a Pathfinding Visualizer',
      description: 'An interactive visualizer for BFS, DFS, and Dijkstra algorithms on a grid. Users can place walls, start, and end points.',
      requiredTopicIds: ['arrays', 'graphs', 'bfs', 'dfs', 'dijkstra', 'hash-tables'],
      milestones: [
        { id: 'pf-1', title: 'Grid Rendering', description: 'Render an interactive grid where users can toggle wall cells.', completed: false },
        { id: 'pf-2', title: 'BFS Visualization', description: 'Visualize BFS with animated cell exploration and path reconstruction.', completed: false },
        { id: 'pf-3', title: 'DFS Visualization', description: 'Add DFS with backtracking visualization.', completed: false },
        { id: 'pf-4', title: 'Dijkstra Visualization', description: 'Implement weighted cells and Dijkstra\'s algorithm visualization.', completed: false },
        { id: 'pf-5', title: 'Speed Controls & UI Polish', description: 'Add speed slider, algorithm selector, and clear board button.', completed: false },
      ],
      starterCode: '# Pathfinding Visualizer\n# Build an interactive grid with:\n# - Click to place/remove walls\n# - Drag to set start and end points\n# - Animated algorithm execution\n# - Path reconstruction display',
      difficulty: 'advanced',
      estimatedHours: 16,
    },
    {
      id: 'spell-checker',
      title: 'Build a Spell Checker',
      description: 'A spell checker using a Trie data structure for fast prefix lookups, with suggestions based on edit distance.',
      requiredTopicIds: ['trees', 'arrays', 'functions', 'hash-tables'],
      milestones: [
        { id: 'sc-1', title: 'Trie Implementation', description: 'Build a Trie with insert, search, and startsWith operations.', completed: false },
        { id: 'sc-2', title: 'Dictionary Loading', description: 'Load a word list from a file into the Trie.', completed: false },
        { id: 'sc-3', title: 'Edit Distance', description: 'Implement Levenshtein distance for finding similar words.', completed: false },
        { id: 'sc-4', title: 'Suggestions Engine', description: 'Generate suggestions by exploring near-matches in the Trie.', completed: false },
        { id: 'sc-5', title: 'CLI Interface', description: 'Build a command-line interface for interactive spell checking.', completed: false },
      ],
      starterCode: '# Spell Checker\n# Build a Trie-based spell checker with:\n# - Dictionary loading from file\n# - Word validation\n# - Edit distance suggestions\n# - Interactive CLI',
      difficulty: 'intermediate',
      estimatedHours: 10,
    },
  ],
};

// ─── DSA Learning Path Seed Data Merge ──────────────────────────────────────
// Merges the DSA seed data (12 topics + 3 projects) into the curriculum.
// The seed file uses snake-case IDs (e.g. "variables-data-types") that don't
// clash with existing topics (e.g. "variables").

import { DSA_SEED_DATA } from './dsaSeedData';

// Add DSA module
CURRICULUM.modules.push({
  id: 'dsa-learning-path',
  title: 'DSA Learning Path',
  description: 'A complete Data Structures & Algorithms path — 12 topics from Variables to Dijkstra\'s, with full exercises, challenges, and projects.',
  difficulty: 'beginner',
  topicIds: DSA_SEED_DATA.topics.map((t) => t.id),
  icon: '🚀',
});

// Merge seed topics into the topics record
const topicsRecord = CURRICULUM.topics as Record<string, any>;
for (const topic of DSA_SEED_DATA.topics) {
  topicsRecord[topic.id] = topic;
}

// Merge seed projects
for (const project of DSA_SEED_DATA.projects) {
  CURRICULUM.projects.push({
    id: project.id,
    title: project.title,
    description: project.description,
    requiredTopicIds: project.prerequisiteTopicIds,
    milestones: project.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      completed: false,
    })),
    starterCode: project.starterScaffold.structure.join('\n'),
    difficulty: project.difficulty as Difficulty,
    estimatedHours: project.estimatedHours,
  });
}
