// ─── Collaboration & Community Seed Data ─────────────────────────────────────
// Realistic demo data for Study Groups, Peer Review, Forum, and AI Moderation.
// Replaces mock data in collabData.ts. Uses 8 consistent student profiles
// across all sections so the demo feels like one real community.

// ─── Demo Students (used consistently across groups, forum, reviews) ────────

export const DEMO_STUDENTS = [
  { id: 'stu-1', name: 'Aisha Patel', avatar: '🧑‍', color: '#8B5CF6', xp: 1250, reputation: 92 },
  { id: 'stu-2', name: 'Marcus Chen', avatar: '👨‍💻', color: '#34D399', xp: 980, reputation: 85 },
  { id: 'stu-3', name: 'Sofia Rodriguez', avatar: '👩‍💻', color: '#EC4899', xp: 1100, reputation: 88 },
  { id: 'stu-4', name: 'Jake Thompson', avatar: '🧑‍🔬', color: '#F59E0B', xp: 750, reputation: 70 },
  { id: 'stu-5', name: 'Priya Sharma', avatar: '👩‍🎓', color: '#60A5FA', xp: 1400, reputation: 95 },
  { id: 'stu-6', name: 'Dev Patel', avatar: '👨🎓', color: '#F87171', xp: 620, reputation: 65 },
  { id: 'stu-7', name: 'Emma Wilson', avatar: '‍🔬', color: '#A78BFA', xp: 890, reputation: 78 },
  { id: 'stu-8', name: 'Ryan Kim', avatar: '👨🔬', color: '#2DD4BF', xp: 540, reputation: 58 },
];

const NOW = Date.now();
const HR = 3600000;
const DAY = 86400000;

// ─── Study Groups ──────────────────────────────────────────────────────────

export const DEMO_GROUPS = [
  {
    id: 'grp-1',
    name: 'Recursion Study Squad',
    description: 'Mastering recursive thinking together. We work through base cases, call stacks, and classic problems like Tower of Hanoi.',
    topicFocus: 'recursion',
    maxMembers: 6,
    visibility: 'public',
    creatorId: 'stu-1',
    members: [
      { studentId: 'stu-1', name: 'Aisha Patel', avatar: '🧑‍💻', role: 'creator', joinedAt: NOW - DAY * 14, xpEarned: 120 },
      { studentId: 'stu-3', name: 'Sofia Rodriguez', avatar: '👩‍💻', role: 'member', joinedAt: NOW - DAY * 10, xpEarned: 85 },
      { studentId: 'stu-4', name: 'Jake Thompson', avatar: '🧑🔬', role: 'member', joinedAt: NOW - DAY * 5, xpEarned: 40 },
      { studentId: 'stu-8', name: 'Ryan Kim', avatar: '👨‍🔬', role: 'member', joinedAt: NOW - DAY * 2, xpEarned: 15 },
    ],
    createdAt: NOW - DAY * 14,
    lastActive: NOW - HR * 2,
    activityScore: 92,
    topicsCovered: ['recursion', 'recursion-basics', 'backtracking'],
    inviteCode: 'RECR42',
  },
  {
    id: 'grp-2',
    name: 'Graph Algorithms Crew',
    description: 'BFS, DFS, Dijkstra, and MST — diving deep into graph theory with hands-on problem solving.',
    topicFocus: 'graphs',
    maxMembers: 5,
    visibility: 'public',
    creatorId: 'stu-5',
    members: [
      { studentId: 'stu-5', name: 'Priya Sharma', avatar: '👩‍🎓', role: 'creator', joinedAt: NOW - DAY * 21, xpEarned: 200 },
      { studentId: 'stu-2', name: 'Marcus Chen', avatar: '👨💻', role: 'member', joinedAt: NOW - DAY * 12, xpEarned: 95 },
      { studentId: 'stu-7', name: 'Emma Wilson', avatar: '🧑‍🔬', role: 'member', joinedAt: NOW - DAY * 3, xpEarned: 30 },
    ],
    createdAt: NOW - DAY * 21,
    lastActive: NOW - DAY,
    activityScore: 78,
    topicsCovered: ['graphs', 'bfs', 'dfs', 'dijkstra'],
    inviteCode: 'GRPH77',
  },
  {
    id: 'grp-3',
    name: 'DSA Interview Prep',
    description: 'Cracking the coding interview together. Arrays, Hash Maps, Trees — focused on interview-style problems with timed practice.',
    topicFocus: 'hash-maps',
    maxMembers: 8,
    visibility: 'public',
    creatorId: 'stu-2',
    members: [
      { studentId: 'stu-2', name: 'Marcus Chen', avatar: '👨‍💻', role: 'creator', joinedAt: NOW - DAY * 30, xpEarned: 300 },
      { studentId: 'stu-3', name: 'Sofia Rodriguez', avatar: '👩‍💻', role: 'member', joinedAt: NOW - DAY * 20, xpEarned: 180 },
      { studentId: 'stu-5', name: 'Priya Sharma', avatar: '👩‍🎓', role: 'member', joinedAt: NOW - DAY * 18, xpEarned: 150 },
      { studentId: 'stu-6', name: 'Dev Patel', avatar: '👨‍🎓', role: 'member', joinedAt: NOW - DAY * 10, xpEarned: 70 },
      { studentId: 'stu-7', name: 'Emma Wilson', avatar: '🧑‍🔬', role: 'member', joinedAt: NOW - DAY * 7, xpEarned: 45 },
      { studentId: 'stu-8', name: 'Ryan Kim', avatar: '‍🔬', role: 'member', joinedAt: NOW - DAY * 3, xpEarned: 20 },
    ],
    createdAt: NOW - DAY * 30,
    lastActive: NOW - HR / 2,
    activityScore: 98,
    topicsCovered: ['arrays-lists', 'hash-maps', 'trees', 'linked-lists'],
    inviteCode: 'DSAPREP',
  },
  {
    id: 'grp-4',
    name: 'Beginners Coding Circle',
    description: 'New to programming? So are we! Learning loops, conditionals, and functions at a relaxed pace. No question is too basic.',
    topicFocus: 'loops',
    maxMembers: 10,
    visibility: 'public',
    creatorId: 'stu-6',
    members: [
      { studentId: 'stu-6', name: 'Dev Patel', avatar: '👨‍🎓', role: 'creator', joinedAt: NOW - DAY * 7, xpEarned: 60 },
      { studentId: 'stu-8', name: 'Ryan Kim', avatar: '👨‍🔬', role: 'member', joinedAt: NOW - DAY * 5, xpEarned: 35 },
      { studentId: 'stu-4', name: 'Jake Thompson', avatar: '🧑‍🔬', role: 'member', joinedAt: NOW - DAY * 4, xpEarned: 25 },
      { studentId: 'stu-7', name: 'Emma Wilson', avatar: '🧑‍', role: 'member', joinedAt: NOW - DAY * 3, xpEarned: 15 },
      { studentId: 'stu-1', name: 'Aisha Patel', avatar: '‍💻', role: 'member', joinedAt: NOW - DAY * 1, xpEarned: 5 },
    ],
    createdAt: NOW - DAY * 7,
    lastActive: NOW - HR * 5,
    activityScore: 65,
    topicsCovered: ['loops', 'conditionals', 'variables-data-types'],
    inviteCode: 'BEGIN1',
  },
  {
    id: 'grp-5',
    name: 'Project Team Alpha',
    description: 'Private group for building the Maze Solver project. Focused on implementation, code reviews, and debugging.',
    topicFocus: 'maze-solver',
    maxMembers: 3,
    visibility: 'private',
    creatorId: 'stu-5',
    members: [
      { studentId: 'stu-5', name: 'Priya Sharma', avatar: '👩‍🎓', role: 'creator', joinedAt: NOW - DAY * 5, xpEarned: 150 },
      { studentId: 'stu-2', name: 'Marcus Chen', avatar: '👨‍💻', role: 'member', joinedAt: NOW - DAY * 4, xpEarned: 100 },
      { studentId: 'stu-3', name: 'Sofia Rodriguez', avatar: '👩💻', role: 'member', joinedAt: NOW - DAY * 3, xpEarned: 80 },
    ],
    createdAt: NOW - DAY * 5,
    lastActive: NOW - HR,
    activityScore: 88,
    topicsCovered: ['graphs', 'recursion'],
    inviteCode: 'ALPHA3',
  },
];

// ─── Group Messages ───────────────────────────────────────────────────────

export const DEMO_GROUP_MESSAGES: Record<string, any[]> = {
  'grp-1': [
    { id: 'msg-1', groupId: 'grp-1', studentId: 'stu-1', studentName: 'Aisha Patel', studentAvatar: '🧑‍💻', content: 'Hey squad! Let\'s work through the Tower of Hanoi today. Who wants to try writing the recursive solution first?', timestamp: NOW - HR * 8, type: 'text' },
    { id: 'msg-2', groupId: 'grp-1', studentId: 'stu-4', studentName: 'Jake Thompson', studentAvatar: '🧑‍', content: 'I tried it last night but I keep getting the moves in the wrong order. My base case works for n=1 but n=3 gives wrong output.', timestamp: NOW - HR * 7, type: 'text' },
    { id: 'msg-3', groupId: 'grp-1', studentId: 'stu-3', studentName: 'Sofia Rodriguez', studentAvatar: '👩‍💻', content: 'Jake, the key is the order of the recursive calls. You need to:\n1. Move n-1 disks from source to auxiliary\n2. Move the nth disk from source to target\n3. Move n-1 disks from auxiliary to target\n\nThe auxiliary and target swap roles in each recursive call!', timestamp: NOW - HR * 6, type: 'text' },
    { id: 'msg-4', groupId: 'grp-1', studentId: 'stu-4', studentName: 'Jake Thompson', studentAvatar: '🧑‍🔬', content: 'Ohhh that makes sense! I was swapping source and target but keeping auxiliary fixed. Let me try again...', timestamp: NOW - HR * 5, type: 'text' },
    { id: 'msg-5', groupId: 'grp-1', studentId: 'stu-8', studentName: 'Ryan Kim', studentAvatar: '👨‍🔬', content: 'I\'m still confused about why the call stack doesn\'t overflow for Tower of Hanoi. Isn\'t it recursive too?', timestamp: NOW - HR * 4, type: 'text' },
    { id: 'msg-6', groupId: 'grp-1', studentId: 'stu-1', studentName: 'Aisha Patel', studentAvatar: '🧑‍💻', content: 'Great question Ryan! The depth is only n (the number of disks), not 2^n like naive fibonacci. Each call reduces n by 1, so for n=64 the max depth is 64 — totally fine for the stack.', timestamp: NOW - HR * 3, type: 'text' },
    { id: 'msg-7', groupId: 'grp-1', studentId: 'stu-4', studentName: 'Jake Thompson', studentAvatar: '🧑‍', content: 'IT WORKS!! 🎉\n\nstatic void hanoi(int n, char s, char t, char a) {\n  if (n == 1) {\n    System.out.println(s + " -> " + t);\n    return;\n  }\n  hanoi(n-1, s, a, t);\n  System.out.println(s + " -> " + t);\n  hanoi(n-1, a, t, s);\n}\n\nGot 7 moves for n=3, exactly right!', timestamp: NOW - HR * 2, type: 'code' },
    { id: 'msg-8', groupId: 'grp-1', studentId: 'stu-3', studentName: 'Sofia Rodriguez', studentAvatar: '👩‍💻', content: 'Nice work Jake! 💪 The number of moves is always 2^n - 1, so for n=3 you get 7. For n=64... well, that\'s about 585 billion years of moves 😄', timestamp: NOW - HR * 1.5, type: 'text' },
    { id: 'msg-9', groupId: 'grp-1', studentId: 'stu-8', studentName: 'Ryan Kim', studentAvatar: '‍🔬', content: 'Wait so the legend about monks moving 64 disks is actually true then? The world ends when they finish?', timestamp: NOW - HR, type: 'text' },
    { id: 'msg-10', groupId: 'grp-1', studentId: 'stu-1', studentName: 'Aisha Patel', studentAvatar: '🧑‍💻', content: 'That\'s the legend! Though with 2^64 - 1 moves at 1 move per second, it\'d take ~585 billion years. The universe is only 13.8 billion years old so we\'re safe 😂', timestamp: NOW - HR * 0.5, type: 'text' },
  ],
  'grp-3': [
    { id: 'msg-11', groupId: 'grp-3', studentId: 'stu-2', studentName: 'Marcus Chen', studentAvatar: '👨‍', content: 'Today\'s challenge: Two Sum in O(n). Who remembers the hash map trick?', timestamp: NOW - HR * 6, type: 'text' },
    { id: 'msg-12', groupId: 'grp-3', studentId: 'stu-6', studentName: 'Dev Patel', studentAvatar: '👨‍🎓', content: 'I always forget this one. Can someone explain the approach?', timestamp: NOW - HR * 5, type: 'text' },
    { id: 'msg-13', groupId: 'grp-3', studentId: 'stu-5', studentName: 'Priya Sharma', avatar: '👩‍🎓', content: 'For each number, check if (target - num) is already in the hash map. If yes, you found your pair! If not, add the current number to the map. One pass through the array.', timestamp: NOW - HR * 4, type: 'text' },
    { id: 'msg-14', groupId: 'grp-3', studentId: 'stu-3', studentName: 'Sofia Rodriguez', studentAvatar: '👩‍💻', content: 'Here\'s my Java solution:\n\nMap<Integer, Integer> map = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) {\n  int complement = target - nums[i];\n  if (map.containsKey(complement))\n    return new int[]{map.get(complement), i};\n  map.put(nums[i], i);\n}\nreturn new int[]{};', timestamp: NOW - HR * 3, type: 'code' },
    { id: 'msg-15', groupId: 'grp-3', studentId: 'stu-6', studentName: 'Dev Patel', studentAvatar: '👨‍', content: 'Oh wow that\'s elegant! The hash map stores each number\'s index, so when you find its complement you instantly know both positions. O(n) time and O(n) space.', timestamp: NOW - HR * 2, type: 'text' },
    { id: 'msg-16', groupId: 'grp-3', studentId: 'stu-7', studentName: 'Emma Wilson', studentAvatar: '🧑‍', content: 'Quick follow-up: what if the array is sorted? Can we do better than O(n) space?', timestamp: NOW - HR * 1.5, type: 'text' },
    { id: 'msg-17', groupId: 'grp-3', studentId: 'stu-2', studentName: 'Marcus Chen', avatar: '👨‍💻', content: 'Yes! Two pointers: one at start, one at end. If sum < target, move left pointer right. If sum > target, move right pointer left. O(n) time, O(1) space! 🎯', timestamp: NOW - HR, type: 'text' },
    { id: 'msg-18', groupId: 'grp-3', studentId: 'stu-8', studentName: 'Ryan Kim', avatar: '👨‍🔬', content: 'I love how there are always multiple ways to solve these. Hash map for unsorted, two pointers for sorted. Knowing both is the real skill.', timestamp: NOW - HR * 0.5, type: 'text' },
    { id: 'msg-19', groupId: 'grp-3', studentId: 'stu-5', studentName: 'Priya Sharma', avatar: '‍🎓', content: 'Exactly! Tomorrow let\'s tackle the "3 Sum" variation. Same concepts but with an extra loop. Good practice for interviews! ', timestamp: NOW - 300000, type: 'text' },
    { id: 'msg-20', groupId: 'grp-3', studentId: 'stu-4', studentName: 'Jake Thompson', avatar: '🧑‍🔬', content: 'Count me in! I\'ll review the hash map approach tonight so I\'m ready 💪', timestamp: NOW - 120000, type: 'text' },
  ],
};

// ─── Group Solutions/Notes ─────────────────────────────────────────────────

export const DEMO_GROUP_SOLUTIONS: Record<string, any[]> = {
  'grp-1': [
    { id: 'sol-1', groupId: 'grp-1', studentId: 'stu-1', studentName: 'Aisha Patel', title: 'Tower of Hanoi — Clean Recursive Solution', code: 'public class Hanoi {\n    static void solve(int n, char source, char target, char auxiliary) {\n        if (n == 1) {\n            System.out.println("Move disk 1 from " + source + " to " + target);\n            return;\n        }\n        solve(n - 1, source, auxiliary, target);\n        System.out.println("Move disk " + n + " from " + source + " to " + target);\n        solve(n - 1, auxiliary, target, source);\n    }\n}', language: 'java', topicId: 'recursion', createdAt: NOW - DAY * 3, upvotes: 12 },
    { id: 'sol-2', groupId: 'grp-1', studentId: 'stu-3', studentName: 'Sofia Rodriguez', title: 'Permutations via Backtracking', code: 'static void permute(String prefix, String remaining) {\n    if (remaining.isEmpty()) {\n        System.out.println(prefix);\n        return;\n    }\n    for (int i = 0; i < remaining.length(); i++) {\n        permute(prefix + remaining.charAt(i),\n                remaining.substring(0, i) + remaining.substring(i + 1));\n    }\n}', language: 'java', topicId: 'backtracking', createdAt: NOW - DAY * 1, upvotes: 8 },
    { id: 'sol-3', groupId: 'grp-1', studentId: 'stu-4', studentName: 'Jake Thompson', title: 'Fibonacci with Memoization — O(n) Time', code: 'static Map<Integer, Integer> memo = new HashMap<>();\nstatic int fib(int n) {\n    if (memo.containsKey(n)) return memo.get(n);\n    if (n <= 1) return n;\n    int result = fib(n - 1) + fib(n - 2);\n    memo.put(n, result);\n    return result;\n}', language: 'java', topicId: 'recursion', createdAt: NOW - DAY * 0.5, upvotes: 5 },
  ],
  'grp-3': [
    { id: 'sol-4', groupId: 'grp-3', studentId: 'stu-5', studentName: 'Priya Sharma', title: 'Two Sum — Hash Map O(n) Solution', code: 'public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement))\n            return new int[]{map.get(complement), i};\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}', language: 'java', topicId: 'hash-maps', createdAt: NOW - DAY * 2, upvotes: 15 },
    { id: 'sol-5', groupId: 'grp-3', studentId: 'stu-2', studentName: 'Marcus Chen', title: 'Two Sum — Two Pointers O(1) Space (Sorted Array)', code: 'public int[] twoSumSorted(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) return new int[]{left, right};\n        if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{};\n}', language: 'java', topicId: 'arrays-lists', createdAt: NOW - DAY * 1, upvotes: 10 },
    { id: 'sol-6', groupId: 'grp-3', studentId: 'stu-3', studentName: 'Sofia Rodriguez', title: 'Group Anagrams — HashMap with Sorted Key', code: 'public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> groups = new HashMap<>();\n    for (String s : strs) {\n        char[] chars = s.toCharArray();\n        Arrays.sort(chars);\n        String key = new String(chars);\n        groups.putIfAbsent(key, new ArrayList<>());\n        groups.get(key).add(s);\n    }\n    return new ArrayList<>(groups.values());\n}', language: 'java', topicId: 'hash-maps', createdAt: NOW - DAY * 0.5, upvotes: 7 },
  ],
};

// ─── Forum Categories ──────────────────────────────────────────────────────

export const DEMO_FORUM_CATEGORIES = [
  { id: 'cat-1', name: 'Recursion', description: 'Recursive thinking, base cases, call stacks, and classic problems.', topicId: 'recursion', icon: '🔄', threadCount: 28 },
  { id: 'cat-2', name: 'Trees & Graphs', description: 'Tree traversals, BFS/DFS, Dijkstra, and graph theory applications.', topicId: 'graphs', icon: '🌳', threadCount: 35 },
  { id: 'cat-3', name: 'Hash Maps', description: 'Hash tables, collision handling, and O(1) lookup patterns.', topicId: 'hash-maps', icon: '️', threadCount: 19 },
  { id: 'cat-4', name: 'Loops & Conditionals', description: 'Control flow, loop invariants, and branching logic.', topicId: 'loops', icon: '🔁', threadCount: 14 },
  { id: 'cat-5', name: 'Dynamic Programming', description: 'Memoization, tabulation, and recognizing DP patterns.', topicId: 'dp-basics', icon: '🧩', threadCount: 22 },
  { id: 'cat-6', name: 'General Discussion', description: 'Study tips, career advice, and anything else coding-related.', topicId: '', icon: '💬', threadCount: 45 },
];

// ─── Forum Threads ─────────────────────────────────────────────────────────

export const DEMO_FORUM_THREADS = [
  {
    id: 'thread-1', categoryId: 'cat-1', topicId: 'recursion',
    authorId: 'stu-4', authorName: 'Jake Thompson', authorAvatar: '🧑‍🔬',
    title: 'Why does my recursive Fibonacci give StackOverflowError for n > 30?',
    content: 'I implemented fibonacci recursively and it works fine for small inputs, but crashes for n > 30 with a StackOverflowError. I thought the base case would prevent infinite recursion? Here\'s my code:\n\n```java\nstatic int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```\n\nIs there a recursion depth limit I\'m hitting? I expected it to be slow but not crash.',
    codeSnippet: { code: 'static int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}', language: 'java' },
    tags: ['recursion', 'stack-overflow', 'fibonacci'],
    upvotes: 18, upvotedBy: ['stu-1', 'stu-2', 'stu-3', 'stu-5'],
    replyCount: 5, status: 'answered', acceptedAnswerId: 'reply-2',
    createdAt: NOW - DAY * 3, updatedAt: NOW - DAY * 2,
    isAiModerated: false,
  },
  {
    id: 'thread-2', categoryId: 'cat-2', topicId: 'graphs',
    authorId: 'stu-6', authorName: 'Dev Patel', authorAvatar: '👨🎓',
    title: 'BFS vs DFS — when should I use which one?',
    content: 'I understand both algorithms conceptually — BFS uses a queue and explores level by level, DFS uses a stack (or recursion) and goes deep first. But in practice, I\'m confused about which to choose. Is BFS always better for shortest path? When does DFS make more sense?',
    tags: ['bfs', 'dfs', 'graph-algorithms', 'comparison'],
    upvotes: 25, upvotedBy: ['stu-1', 'stu-2', 'stu-3', 'stu-5', 'stu-7'],
    replyCount: 4, status: 'answered', acceptedAnswerId: 'reply-6',
    createdAt: NOW - DAY * 5, updatedAt: NOW - DAY * 4,
    isAiModerated: false,
  },
  {
    id: 'thread-3', categoryId: 'cat-5', topicId: 'dp-basics',
    authorId: 'stu-7', authorName: 'Emma Wilson', authorAvatar: '🧑‍🔬',
    title: 'How do I identify if a problem needs Dynamic Programming?',
    content: 'I keep struggling to recognize when a problem can be solved with DP. I understand the concept of memoization and overlapping subproblems, but when I see a new problem, I can\'t tell if it\'s a DP problem or not. Are there specific patterns or keywords I should look for? Any intuition tricks?',
    tags: ['dynamic-programming', 'problem-solving', 'intuition'],
    upvotes: 34, upvotedBy: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5'],
    replyCount: 0, status: 'open',
    createdAt: NOW - DAY * 1, updatedAt: NOW - DAY * 1,
    isAiModerated: false,
  },
  {
    id: 'thread-4', categoryId: 'cat-3', topicId: 'hash-maps',
    authorId: 'stu-8', authorName: 'Ryan Kim', authorAvatar: '👨‍',
    title: 'HashMap collision handling — when does performance degrade?',
    content: 'I learned that HashMap gives O(1) average time but O(n) worst case. When does the worst case actually happen in practice? If I use Java\'s HashMap with String keys, should I worry about collisions? What\'s a good hash function to avoid them?',
    tags: ['hash-maps', 'performance', 'collision'],
    upvotes: 12, upvotedBy: ['stu-2', 'stu-5'],
    replyCount: 3, status: 'answered', acceptedAnswerId: 'reply-11',
    createdAt: NOW - DAY * 4, updatedAt: NOW - DAY * 3,
    isAiModerated: false,
  },
  {
    id: 'thread-5', categoryId: 'cat-4', topicId: 'loops',
    authorId: 'stu-6', authorName: 'Dev Patel', authorAvatar: '👨‍🎓',
    title: 'pls help asap need answer for my homework',
    content: 'i have an assignment due tomorrow and i need someone to solve it for me. its about loops. pls send code fast.',
    tags: [],
    upvotes: 0, upvotedBy: [],
    replyCount: 0, status: 'open',
    createdAt: NOW - HR * 2, updatedAt: NOW - HR * 2,
    isAiModerated: true,
    moderationFlag: { id: 'flag-1', postId: 'thread-5', postType: 'thread', action: 'flag_loweffort', reason: 'Post requests direct answers without showing any attempt. No code or problem description provided.', confidence: 0.95, detectedBy: 'ai', resolved: false, createdAt: NOW - HR * 2 },
  },
  {
    id: 'thread-6', categoryId: 'cat-1', topicId: 'recursion',
    authorId: 'stu-3', authorName: 'Sofia Rodriguez', authorAvatar: '👩‍💻',
    title: 'Tail recursion optimization in Java — does it work?',
    content: 'I heard that some languages optimize tail-recursive calls into loops, preventing stack overflow. Does Java do this? I wrote a tail-recursive factorial function but it still overflows for large inputs. Is there a way to get TCO in Java, or do I need to convert to iteration manually?',
    tags: ['recursion', 'tail-recursion', 'optimization', 'java'],
    upvotes: 9, upvotedBy: ['stu-1', 'stu-4', 'stu-5'],
    replyCount: 2, status: 'answered', acceptedAnswerId: 'reply-14',
    createdAt: NOW - DAY * 6, updatedAt: NOW - DAY * 5,
    isAiModerated: false,
  },
  {
    id: 'thread-7', categoryId: 'cat-2', topicId: 'graphs',
    authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑‍💻',
    title: 'Dijkstra\'s algorithm with negative edge weights — why does it fail?',
    content: 'I implemented Dijkstra\'s algorithm and it works great on most graphs, but when I tested it with negative edge weights, it gave wrong results. I read that Dijkstra doesn\'t work with negative weights, but I don\'t understand WHY. The algorithm just picks the closest unvisited node — why would negative weights break that?',
    tags: ['dijkstra', 'negative-weights', 'shortest-path'],
    upvotes: 21, upvotedBy: ['stu-2', 'stu-3', 'stu-5', 'stu-7'],
    replyCount: 3, status: 'answered', acceptedAnswerId: 'reply-17',
    createdAt: NOW - DAY * 7, updatedAt: NOW - DAY * 6,
    isAiModerated: false,
  },
  {
    id: 'thread-8', categoryId: 'cat-6', topicId: '',
    authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '👩‍🎓',
    title: 'Best resources for practicing DSA before interviews?',
    content: 'I have a tech interview in 3 weeks and want to focus my DSA practice efficiently. What are the best resources? I\'ve been doing LeetCode but I feel like I\'m just memorizing solutions rather than building intuition. Looking for advice from people who\'ve been through this.',
    tags: ['interview-prep', 'resources', 'practice'],
    upvotes: 28, upvotedBy: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-6', 'stu-7', 'stu-8'],
    replyCount: 5, status: 'answered', acceptedAnswerId: 'reply-21',
    createdAt: NOW - DAY * 2, updatedAt: NOW - DAY,
    isAiModerated: false,
  },
  {
    id: 'thread-9', categoryId: 'cat-3', topicId: 'hash-maps',
    authorId: 'stu-2', authorName: 'Marcus Chen', authorAvatar: '👨‍💻',
    title: 'Designing a cache with LRU eviction — HashMap + LinkedList?',
    content: 'I\'m trying to implement an LRU (Least Recently Used) cache with O(1) get and put operations. My approach: use a HashMap for O(1) lookups and a doubly linked list to track access order. When the cache is full, remove the tail (least recently used). Does this approach work? Any edge cases I\'m missing?',
    tags: ['lru-cache', 'hash-maps', 'linked-lists', 'design'],
    upvotes: 16, upvotedBy: ['stu-1', 'stu-3', 'stu-5'],
    replyCount: 2, status: 'answered', acceptedAnswerId: 'reply-23',
    createdAt: NOW - DAY * 3, updatedAt: NOW - DAY * 2,
    isAiModerated: false,
  },
  {
    id: 'thread-10', categoryId: 'cat-2', topicId: 'trees',
    authorId: 'stu-4', authorName: 'Jake Thompson', authorAvatar: '🧑‍🔬',
    title: 'When is a binary tree "balanced" and why does it matter?',
    content: 'I keep hearing that balanced trees are important for performance, but I\'m not clear on what "balanced" actually means. Is it about having equal numbers of nodes on left and right? Or equal height? And how does imbalance affect operations — I know it changes O(log n) to O(n) but I don\'t intuitively understand why.',
    tags: ['trees', 'balanced-trees', 'performance', 'big-o'],
    upvotes: 14, upvotedBy: ['stu-1', 'stu-2', 'stu-3'],
    replyCount: 3, status: 'answered', acceptedAnswerId: 'reply-26',
    createdAt: NOW - DAY * 8, updatedAt: NOW - DAY * 7,
    isAiModerated: false,
  },
];

// ─── Forum Replies ─────────────────────────────────────────────────────────

export const DEMO_FORUM_REPLIES: Record<string, any[]> = {
  'thread-1': [
    { id: 'reply-1', threadId: 'thread-1', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑‍💻', content: 'The issue isn\'t just recursion depth — it\'s the **exponential time complexity** O(2^n). For fibonacci(30), you\'re making roughly 2.6 million function calls. Each call pushes a new frame onto the call stack. Java\'s default stack size can handle about 10,000-20,000 frames, so around n=30-35 you hit the limit.', upvotes: 10, upvotedBy: ['stu-4', 'stu-6'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 3 + HR * 2 },
    { id: 'reply-2', threadId: 'thread-1', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '‍🎓', content: 'Here\'s the fix — use **memoization** to bring it down to O(n) time:\n\n```java\nstatic Map<Integer, Integer> memo = new HashMap<>();\n\nstatic int fibonacci(int n) {\n    if (memo.containsKey(n)) return memo.get(n);\n    if (n <= 1) return n;\n    int result = fibonacci(n - 1) + fibonacci(n - 2);\n    memo.put(n, result);\n    return result;\n}\n```\n\nNow fibonacci(40) runs instantly because each value is computed only once. The call stack depth is still n, but n=40 is well within stack limits.', codeSnippet: { code: 'static Map<Integer, Integer> memo = new HashMap<>();\nstatic int fibonacci(int n) {\n    if (memo.containsKey(n)) return memo.get(n);\n    if (n <= 1) return n;\n    int result = fibonacci(n - 1) + fibonacci(n - 2);\n    memo.put(n, result);\n    return result;\n}', language: 'java' }, upvotes: 22, upvotedBy: ['stu-4', 'stu-1', 'stu-3', 'stu-6', 'stu-8'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 3 + HR * 4 },
    { id: 'reply-3', threadId: 'thread-1', authorId: 'stu-2', authorName: 'Marcus Chen', authorAvatar: '👨‍💻', content: 'For even better performance, skip recursion entirely and use iteration:\n\n```java\nstatic int fibonacci(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}\n```\n\nO(n) time, O(1) space, and zero risk of stack overflow. This is the version you\'d want in production.', codeSnippet: { code: 'static int fibonacci(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}', language: 'java' }, upvotes: 15, upvotedBy: ['stu-4', 'stu-1', 'stu-7'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 3 + HR * 6 },
  ],
  'thread-2': [
    { id: 'reply-5', threadId: 'thread-2', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑‍💻', content: '**BFS** is your go-to when:\n• You need the **shortest path** in an unweighted graph\n• You want to explore level by level (e.g., "find all people 2 degrees away")\n• The answer is likely close to the starting point\n\n**DFS** shines when:\n• You need to explore **all possibilities** (e.g., finding all paths)\n• **Memory is limited** — DFS only stores the current path, BFS stores the entire frontier\n• You\'re looking for **any** valid path, not necessarily the shortest\n• The solution is likely **deep** in the search space\n\nFor weighted graphs, neither BFS nor DFS alone solves shortest path — that\'s where **Dijkstra** comes in.', upvotes: 30, upvotedBy: ['stu-6', 'stu-2', 'stu-3', 'stu-4', 'stu-7', 'stu-8'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 5 + HR * 3 },
    { id: 'reply-6', threadId: 'thread-2', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '👩‍🎓', content: 'One practical example: in a maze solver, BFS guarantees the shortest path from start to exit, but uses more memory (the queue can grow large). DFS might find a path faster if the exit is deep, but it could be a very long winding path. For interview problems, if they ask for "shortest path" → BFS. If they ask "is there a path" → either works.', upvotes: 18, upvotedBy: ['stu-6', 'stu-2', 'stu-3'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 5 + HR * 5 },
    { id: 'reply-7', threadId: 'thread-2', authorId: 'stu-3', authorName: 'Sofia Rodriguez', authorAvatar: '👩‍💻', content: 'Also worth noting: BFS naturally gives you "levels" which is useful for things like "find the minimum number of steps" problems. DFS gives you a natural backtracking pattern which is great for constraint satisfaction problems like N-Queens or Sudoku.', upvotes: 12, upvotedBy: ['stu-6', 'stu-4'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 5 + HR * 7 },
    { id: 'reply-8', threadId: 'thread-2', authorId: 'stu-6', authorName: 'Dev Patel', authorAvatar: '👨‍🎓', content: 'This is super helpful! The memory difference makes a lot of sense now. For BFS on a wide graph, the queue could hold thousands of nodes. For DFS, you only store the current path. That explains why DFS is preferred for deep trees.', upvotes: 8, upvotedBy: ['stu-1'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 4 + HR * 2 },
  ],
  'thread-4': [
    { id: 'reply-10', threadId: 'thread-4', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑‍💻', content: 'The worst case happens when **all keys hash to the same bucket**. In Java 8+, this triggers a fallback to a balanced tree (O(log n)), but in earlier versions it was O(n) for everything. With String keys in Java, the hash function is well-designed (s[0]*31^(n-1) + ...), so real-world collisions are rare. You\'d need to deliberately craft malicious keys to trigger worst-case behavior.', upvotes: 8, upvotedBy: ['stu-8', 'stu-2'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 4 + HR * 3 },
    { id: 'reply-11', threadId: 'thread-4', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '‍🎓', content: 'To add to Aisha\'s answer: in practice, you almost never need to worry about HashMap performance with standard Java types (String, Integer, etc.). The hash functions are well-tested. You only need to care if:\n\n1. You\'re using **custom objects as keys** without proper `hashCode()`/`equals()` implementations\n2. You\'re in a **competitive programming** setting where someone might craft adversarial inputs\n3. You need **deterministic iteration order** (use LinkedHashMap instead)\n\nFor custom objects, always override both `hashCode()` and `equals()` together — that\'s the most common HashMap bug I see in code reviews.', codeSnippet: { code: '@Override\npublic boolean equals(Object o) {\n    if (this == o) return true;\n    if (!(o instanceof MyClass)) return false;\n    MyClass other = (MyClass) o;\n    return Objects.equals(this.field, other.field);\n}\n\n@Override\npublic int hashCode() {\n    return Objects.hash(field);\n}', language: 'java' }, upvotes: 14, upvotedBy: ['stu-8', 'stu-1', 'stu-2', 'stu-3'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 4 + HR * 5 },
    { id: 'reply-12', threadId: 'thread-4', authorId: 'stu-2', authorName: 'Marcus Chen', authorAvatar: '👨‍💻', content: 'Also: if you know the approximate number of entries, set the initial capacity to avoid rehashing. `new HashMap<>(expectedSize / 0.75)` — the 0.75 is Java\'s default load factor.', upvotes: 6, upvotedBy: ['stu-8'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 3 + HR * 8 },
  ],
  'thread-6': [
    { id: 'reply-13', threadId: 'thread-6', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '👩‍🎓', content: 'Short answer: **Java does NOT support tail call optimization (TCO).** The JVM spec doesn\'t require it, and HotSpot doesn\'t implement it. Your tail-recursive factorial will still overflow just like any other recursive function.', upvotes: 7, upvotedBy: ['stu-3', 'stu-4'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 6 + HR * 3 },
    { id: 'reply-14', threadId: 'thread-6', authorId: 'stu-2', authorName: 'Marcus Chen', authorAvatar: '👨‍💻', content: 'To add to Priya\'s answer: Languages like Scala (on JVM) and Kotlin support TCO through compiler-level **trampoline** transformations or `tailrec` keyword that rewrites the recursion into a loop at compile time. In Java, you need to manually convert:\n\n```java\n// Tail-recursive (still overflows in Java)\nstatic int fact(int n, int acc) {\n    if (n <= 1) return acc;\n    return fact(n - 1, n * acc);\n}\n\n// Manual conversion to iteration (no overflow)\nstatic int fact(int n) {\n    int acc = 1;\n    while (n > 1) { acc *= n; n--; }\n    return acc;\n}\n```\n\nSo yes, convert to iteration manually. It\'s not hard once you identify the accumulator pattern.', codeSnippet: { code: 'static int fact(int n) {\n    int acc = 1;\n    while (n > 1) { acc *= n; n--; }\n    return acc;\n}', language: 'java' }, upvotes: 11, upvotedBy: ['stu-3', 'stu-4', 'stu-1'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 6 + HR * 5 },
  ],
  'thread-7': [
    { id: 'reply-16', threadId: 'thread-7', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '👩‍🎓', content: 'Dijkstra\'s greedy choice is: "pick the closest unvisited node, and we\'re done with it." This works because with non-negative weights, going through any other node can only make the path longer. But with **negative edges**, a path through a "farther" node might actually be shorter because a negative edge compensates for the extra distance. Dijkstra\'s greedy assumption breaks.', upvotes: 12, upvotedBy: ['stu-1', 'stu-4', 'stu-7'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 7 + HR * 4 },
    { id: 'reply-17', threadId: 'thread-7', authorId: 'stu-3', authorName: 'Sofia Rodriguez', authorAvatar: '👩‍💻', content: 'Here\'s a concrete example:\n\n```\nA --(2)--> B\nA --(5)--> C\nB --(-4)--> C\n```\n\nDijkstra from A:\n1. Visit A (dist 0). Set B=2, C=5.\n2. Visit B (dist 2). Try to update C: 2 + (-4) = -2 < 5. Update C=-2.\n3. Visit C (dist -2). Done.\n\nWait, that seems to work? The issue is subtler — Dijkstra **marks B as "done"** after step 2. If there were a negative edge FROM C back TO B, Dijkstra would never revisit B to update its distance. That\'s the real failure mode.\n\nFor negative weights, use **Bellman-Ford** instead — it relaxes all edges V-1 times, so it handles negatives correctly (but is O(V*E) instead of O(E log V)).', codeSnippet: { code: '// Bellman-Ford for negative weights\nint[] dist = new int[V];\nArrays.fill(dist, INF);\ndist[source] = 0;\nfor (int i = 0; i < V - 1; i++) {\n    for (Edge e : edges) {\n        if (dist[e.from] + e.weight < dist[e.to])\n            dist[e.to] = dist[e.from] + e.weight;\n    }\n}', language: 'java' }, upvotes: 19, upvotedBy: ['stu-1', 'stu-4', 'stu-2', 'stu-7', 'stu-8'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 7 + HR * 6 },
    { id: 'reply-18', threadId: 'thread-7', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑‍', content: 'Great explanation Sofia! The key insight: Dijkstra\'s priority queue processes each node exactly once. With negative edges, you might need to process a node multiple times (which Bellman-Ford does by design). That\'s why the greedy approach fails — "once processed, never revisited" is the fatal assumption.', upvotes: 8, upvotedBy: ['stu-4', 'stu-3'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 6 + HR * 10 },
  ],
  'thread-8': [
    { id: 'reply-20', threadId: 'thread-8', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑💻', content: 'My advice: focus on **patterns**, not individual problems. There are maybe 15-20 core DSA patterns (sliding window, two pointers, BFS/DFS, DP on trees, etc.). Once you recognize the pattern, the solution becomes mechanical.\n\nBest resources:\n1. **NeetCode 150** — curated list covering all patterns\n2. **Grokking the Coding Interview** (Educative) — pattern-based approach\n3. **LeetCode Discuss** — read top solutions to learn idiomatic approaches\n\nDon\'t memorize solutions. Instead, after solving a problem, ask: "What pattern is this?" and "What variations of this pattern exist?"', upvotes: 20, upvotedBy: ['stu-5', 'stu-2', 'stu-3', 'stu-4'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 2 + HR * 3 },
    { id: 'reply-21', threadId: 'thread-8', authorId: 'stu-3', authorName: 'Sofia Rodriguez', authorAvatar: '👩‍', content: 'Adding to Aisha\'s list: **blind75.com** is a great curated list. Also, practice explaining your solutions out loud — interviewers care about your thought process as much as the code.\n\nFor building intuition: after solving a problem, try to solve a **variation** of it the next day without looking at the solution. This forces genuine understanding vs memorization.\n\nExample: after solving Two Sum, try Three Sum the next day. After solving regular BFS, try BFS with level tracking.', upvotes: 16, upvotedBy: ['stu-5', 'stu-1', 'stu-6', 'stu-7'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 2 + HR * 6 },
    { id: 'reply-22', threadId: 'thread-8', authorId: 'stu-2', authorName: 'Marcus Chen', authorAvatar: '‍💻', content: '3 weeks is tight but doable. My recommendation:\n- Week 1: Arrays, Strings, Two Pointers, Sliding Window (~20 problems)\n- Week 2: Trees, Graphs, BFS/DFS (~20 problems)\n- Week 3: DP, Greedy, and mixed practice (~15 problems)\n\nDo 3-4 problems per day, and spend equal time reviewing solutions you didn\'t get.', upvotes: 12, upvotedBy: ['stu-5', 'stu-6'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 1 + HR * 10 },
    { id: 'reply-23', threadId: 'thread-9', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '🧑‍💻', content: 'Yes, HashMap + Doubly Linked List is the classic approach! The HashMap gives you O(1) lookup by key, and the DLL tracks access order. When you access a node, move it to the head of the list. When evicting, remove from the tail.\n\nKey detail: the DLL nodes need to store both key and value, and the HashMap maps key → DLL node. This way you can find and remove a node from the DLL in O(1).', upvotes: 10, upvotedBy: ['stu-2', 'stu-3', 'stu-5'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 3 + HR * 4 },
    { id: 'reply-24', threadId: 'thread-9', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '👩‍', content: 'Edge cases to watch for:\n1. **get() on a key that exists** — you must move it to head (update recency)\n2. **put() with an existing key** — update value AND move to head\n3. **put() when full** — evict tail BEFORE inserting new node\n4. **Capacity of 0 or 1** — handle gracefully\n\nJava actually has `LinkedHashMap` with `removeEldestEntry()` override that does most of this for you, but interviewers usually want you to implement from scratch.', codeSnippet: { code: 'class LRUCache {\n    private final int capacity;\n    private final Map<Integer, Node> map;\n    private final Node head, tail;\n    \n    // ... full implementation\n}', language: 'java' }, upvotes: 8, upvotedBy: ['stu-2'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 3 + HR * 6 },
    { id: 'reply-25', threadId: 'thread-10', authorId: 'stu-1', authorName: 'Aisha Patel', authorAvatar: '‍💻', content: 'A binary tree is **height-balanced** if for every node, the heights of its left and right subtrees differ by at most 1. It\'s about **height**, not node count.\n\nWhy it matters: operations on a BST (search, insert, delete) take O(h) time where h is the tree height. In a balanced tree, h = O(log n). In a completely unbalanced tree (essentially a linked list), h = O(n).\n\nExample of worst case: inserting 1, 2, 3, 4, 5 into a BST in order gives a degenerate tree that\'s just a linked list — every operation becomes O(n).', upvotes: 10, upvotedBy: ['stu-4', 'stu-2', 'stu-3'], isAcceptedAnswer: true, isAiGenerated: false, createdAt: NOW - DAY * 8 + HR * 4 },
    { id: 'reply-26', threadId: 'thread-10', authorId: 'stu-5', authorName: 'Priya Sharma', authorAvatar: '👩‍🎓', content: 'Visual example:\n\n**Balanced (height 2):**\n```\n      3\n     / \\\n    1   5\n   / \\   \\\n  0   2   6\n```\n\n**Unbalanced (height 5):**\n```\n    1\n     \\\n      2\n       \\\n        3\n         \\\n          4\n           \\\n            5\n```\n\nBoth trees store the same 5 elements. Search for 5 takes 2 steps in the balanced tree but 5 steps in the unbalanced one. For 1000 elements, that\'s 10 vs 1000 steps — a huge difference!', upvotes: 14, upvotedBy: ['stu-4', 'stu-2', 'stu-3', 'stu-6'], isAcceptedAnswer: false, isAiGenerated: false, createdAt: NOW - DAY * 8 + HR * 6 },
    { id: 'reply-27', threadId: 'thread-3', authorId: 'ai-tutor', authorName: 'AXIOM AI Tutor', authorAvatar: '🤖', content: 'Great question, Emma! Recognizing DP problems is a skill that develops with practice. Here are the key indicators:\n\n**1. Optimization problems** — "Find the maximum/minimum/longest/shortest..." DP excels at finding optimal solutions.\n\n**2. Overlapping subproblems** — If you find yourself solving the same subproblem multiple times (like fibonacci computing fib(3) repeatedly), DP is likely applicable.\n\n**3. Optimal substructure** — If the optimal solution to the big problem can be built from optimal solutions to smaller subproblems.\n\n**Common DP patterns to look for:**\n• "How many ways to..." → counting DP\n• "Minimum cost/maximum value..." → optimization DP  \n• "Can you reach/target..." → boolean DP\n• Grid problems with movement constraints → 2D DP\n\n**Quick checklist:**\n1. Can you define the problem in terms of smaller versions of itself?\n2. Are there overlapping computations?\n3. Does the problem have a clear "state" that changes incrementally?\n\nIf yes to all three, you likely have a DP problem. Start by writing the recursive solution with memoization (top-down), then convert to tabulation (bottom-up) if needed.\n\nWant to practice? Try: Climbing Stairs (easy), House Robber (medium), Longest Increasing Subsequence (medium).', codeSnippet: null, upvotes: 28, upvotedBy: ['stu-7', 'stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5', 'stu-6'], isAcceptedAnswer: false, isAiGenerated: true, createdAt: NOW - DAY + HR * 12 },
  ],
};

// ─── Peer Code Reviews ────────────────────────────────────────────────────

export const DEMO_REVIEWS = [
  {
    id: 'review-1', submitterId: 'stu-4', submitterName: 'Jake Thompson',
    code: 'public class Main {\n    static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n    public static void main(String[] args) {\n        System.out.println(fibonacci(10));\n    }\n}',
    language: 'java', topicId: 'recursion',
    description: 'Is my recursive fibonacci correct? I\'m worried about efficiency for larger inputs. Any suggestions for improvement?',
    status: 'in-review',
    reviewers: [
      { reviewerId: 'stu-1', reviewerName: 'Aisha Patel', reviewerAvatar: '🧑‍💻', xpReward: 15, status: 'completed', completedAt: NOW - HR * 3 },
      { reviewerId: 'stu-5', reviewerName: 'Priya Sharma', reviewerAvatar: '👩‍🎓', xpReward: 15, status: 'assigned' },
    ],
    comments: [
      { id: 'rc-1', reviewId: 'review-1', reviewerId: 'stu-1', reviewerName: 'Aisha Patel', line: 3, content: 'The logic is correct! Base cases and recursive relation are right. However, this is O(2^n) — for n=40 it makes ~2 billion calls. Consider memoization.', createdAt: NOW - HR * 5, isResolved: false },
      { id: 'rc-2', reviewId: 'review-1', reviewerId: 'stu-1', reviewerName: 'Aisha Patel', line: 2, content: 'Also consider: what happens for negative input? You might want `if (n < 0) throw new IllegalArgumentException()` as a guard.', createdAt: NOW - HR * 4, isResolved: false },
    ],
    overallRating: 4, overallFeedback: 'Good understanding of recursion basics! The code is correct and clean. Next step: learn memoization to handle larger inputs efficiently.',
    createdAt: NOW - DAY, updatedAt: NOW - HR * 3,
    markedHelpfulBy: ['stu-4'],
  },
  {
    id: 'review-2', submitterId: 'stu-6', submitterName: 'Dev Patel',
    code: 'public class Main {\n    static void bfs(List<List<Integer>> graph, int start) {\n        boolean[] visited = new boolean[graph.size()];\n        Queue<Integer> queue = new LinkedList<>();\n        queue.offer(start);\n        visited[start] = true;\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            System.out.print(node + " ");\n            for (int neighbor : graph.get(node)) {\n                if (!visited[neighbor]) {\n                    visited[neighbor] = true;\n                    queue.offer(neighbor);\n                }\n            }\n        }\n    }\n}',
    language: 'java', topicId: 'graphs',
    description: 'Does this BFS handle disconnected graphs? I want to make sure all nodes are visited even if the graph has multiple components.',
    status: 'pending',
    reviewers: [],
    comments: [],
    overallRating: undefined, overallFeedback: undefined,
    createdAt: NOW - HR * 6, updatedAt: NOW - HR * 6,
    markedHelpfulBy: [],
  },
  {
    id: 'review-3', submitterId: 'stu-8', submitterName: 'Ryan Kim',
    code: 'public class Main {\n    static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'{\' || c == \'[\') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if ((c == \')\' && top != \'(\') ||\n                    (c == \'}\' && top != \'{\') ||\n                    (c == \']\' && top != \'[\')) return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}',
    language: 'java', topicId: 'stacks-queues',
    description: 'My Valid Parentheses solution using a stack. Does it handle all edge cases? Any code style improvements?',
    status: 'completed',
    reviewers: [
      { reviewerId: 'stu-3', reviewerName: 'Sofia Rodriguez', reviewerAvatar: '‍💻', xpReward: 10, status: 'completed', completedAt: NOW - DAY * 2 },
      { reviewerId: 'stu-2', reviewerName: 'Marcus Chen', reviewerAvatar: '👨‍💻', xpReward: 10, status: 'completed', completedAt: NOW - DAY * 2 + HR * 2 },
    ],
    comments: [
      { id: 'rc-3', reviewId: 'review-3', reviewerId: 'stu-3', reviewerName: 'Sofia Rodriguez', line: 5, content: 'Clean solution! One suggestion: use `Deque<Character> stack = new ArrayDeque<>();` instead of `Stack<>` — Stack is legacy and synchronized, ArrayDeque is faster.', createdAt: NOW - DAY * 3, isResolved: true },
      { id: 'rc-4', reviewId: 'review-3', reviewerId: 'stu-2', reviewerName: 'Marcus Chen', line: 8, content: 'The matching logic is solid. Consider extracting the pair-matching into a Map for cleaner code: `Map<Character, Character> pairs = Map.of(\')\', \'(\', \'}\', \'{\', \']\', \'[\');`', createdAt: NOW - DAY * 3 + HR, isResolved: false },
    ],
    overallRating: 5, overallFeedback: 'Excellent implementation! The stack approach is exactly right. Minor suggestions about using ArrayDeque and a Map for bracket pairs — both are style improvements, not correctness issues.',
    createdAt: NOW - DAY * 3, updatedAt: NOW - DAY * 2,
    markedHelpfulBy: ['stu-8'],
  },
];

// ─── Reviewer Reputations ──────────────────────────────────────────────────

export const DEMO_REVIEWER_REPUTATIONS = [
  { studentId: 'stu-1', reviewsGiven: 18, helpfulCount: 16, totalXp: 180 },
  { studentId: 'stu-2', reviewsGiven: 14, helpfulCount: 11, totalXp: 140 },
  { studentId: 'stu-3', reviewsGiven: 22, helpfulCount: 20, totalXp: 220 },
  { studentId: 'stu-5', reviewsGiven: 25, helpfulCount: 23, totalXp: 250 },
  { studentId: 'stu-7', reviewsGiven: 8, helpfulCount: 6, totalXp: 80 },
];

// ─── Moderation Flags ──────────────────────────────────────────────────────

export const DEMO_MODERATION_FLAGS = [
  {
    id: 'flag-1',
    postId: 'thread-5',
    postType: 'thread',
    action: 'flag_loweffort',
    reason: 'Post requests direct answers without showing any attempt. No code or problem description provided. Contains "pls help asap need answer" language pattern typical of low-effort requests.',
    confidence: 0.95,
    detectedBy: 'ai',
    resolved: false,
    createdAt: NOW - HR * 2,
  },
  {
    id: 'flag-2',
    postId: 'thread-11',
    postType: 'reply',
    action: 'flag_offtopic',
    reason: 'Reply discusses cryptocurrency trading strategies in a thread about binary search trees. Completely unrelated to the programming/learning context of the forum.',
    confidence: 0.88,
    detectedBy: 'ai',
    resolved: false,
    resolvedBy: undefined,
    createdAt: NOW - DAY * 2,
  },
  {
    id: 'flag-3',
    postId: 'thread-12',
    postType: 'thread',
    action: 'flag_hostile',
    reason: 'Thread title and content contain dismissive language toward other students ("only idiots struggle with this"). Creates an unwelcoming environment for learners at different levels.',
    confidence: 0.82,
    detectedBy: 'ai',
    resolved: true,
    resolvedBy: 'stu-1',
    createdAt: NOW - DAY * 5,
  },
];
