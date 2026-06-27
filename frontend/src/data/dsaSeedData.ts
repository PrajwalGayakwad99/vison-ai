// ─── DSA Learning Path Seed Data ─────────────────────────────────────────────
// A self-contained "Data Structures & Algorithms" curriculum path with 12 topics,
// dependency graph, AI-generated practice problem samples, and 3 projects.
// Drop into any database/seed file or use as mock data for UI development.

export const DSA_SEED_DATA = {

// ─── 1. Topics (12, foundational → advanced) ───────────────────────────────

topics: [
  {
    id: "variables-data-types",
    title: "Variables & Data Types",
    description: "How computers store and name values in memory. Every program starts here — understanding how data lives in memory is the foundation for everything that follows.",
    difficulty: "beginner",
    estimatedMinutes: 20,
    prerequisiteIds: [],
    explanation: `# Variables & Data Types

A **variable** is a named container that holds a value. Think of it as a labeled box in the computer's memory. When you write \`int age = 21;\`, Java reserves 4 bytes of memory, stores the number 21 there, and remembers that the label "age" points to those bytes.

## How It Works in Java

Every variable has a **type** that tells Java how much memory to allocate and how to interpret the bits. Primitive types (\`int\`, \`double\`, \`boolean\`, \`char\`) store values directly, while reference types (\`String\`, arrays, objects) store a memory address pointing to the actual data.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int age = 21;              // 4 bytes — whole numbers
        double price = 19.99;      // 8 bytes — decimal numbers
        boolean isActive = true;   // 1 byte — true or false
        String name = "AXIOM";     // reference — points to char data
        char grade = 'A';          // 2 bytes — single character

        System.out.println(age + " " + name);
    }
}
\`\`\`

### Memory View

| Variable | Type    | Value    | Bytes |
|----------|---------|----------|-------|
| age      | int     | 21       | 4     |
| price    | double  | 19.99    | 8     |
| isActive | boolean | true     | 1     |
| name     | String  | "AXIOM"  | ref   |
| grade    | char    | 'A'      | 2     |

Understanding types prevents bugs — you can't accidentally store text in a number variable, and Java catches these mistakes at compile time.`,
    visualizationType: "heap",
    exercises: [
      {
        id: "var-dt-ex-1",
        title: "Swap Two Variables",
        description: "Write a Java program to swap the values of two integer variables without using a temporary third variable. Use arithmetic operations.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = 10;\n        // Swap a and b WITHOUT a temp variable\n        \n        System.out.println(a + \" \" + b);\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = 10;\n        a = a + b;\n        b = a - b;\n        a = a - b;\n        System.out.println(a + \" \" + b);\n    }\n}",
        testCases: [
          { input: "5 10", expectedOutput: "10 5" },
          { input: "100 200", expectedOutput: "200 100" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "var-dt-ex-2",
        title: "Temperature Converter",
        description: "Write a program that converts a temperature from Celsius to Fahrenheit using the formula F = C * 9/5 + 32. Use appropriate data types for decimal precision.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        double celsius = 36.6;\n        // Convert to Fahrenheit\n        \n        System.out.println(fahrenheit);\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        double celsius = 36.6;\n        double fahrenheit = celsius * 9.0 / 5.0 + 32;\n        System.out.println(fahrenheit);\n    }\n}",
        testCases: [
          { input: "0.0", expectedOutput: "32.0" },
          { input: "100.0", expectedOutput: "212.0" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "var-dt-ex-3",
        title: "String Concatenation",
        description: "Create variables for firstName, lastName, and age. Print a greeting string like \"Hello, John Doe! You are 25 years old.\" using string concatenation.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        String firstName = \"John\";\n        String lastName = \"Doe\";\n        int age = 25;\n        // Build the greeting string\n        \n        System.out.println(greeting);\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        String firstName = \"John\";\n        String lastName = \"Doe\";\n        int age = 25;\n        String greeting = \"Hello, \" + firstName + \" \" + lastName + \"! You are \" + age + \" years old.\";\n        System.out.println(greeting);\n    }\n}",
        testCases: [
          { input: "", expectedOutput: "Hello, John Doe! You are 25 years old." }
        ],
        difficulty: "beginner",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "var-dt-ch-1",
        title: "Type Detective",
        description: "Given the code below, trace through each assignment and determine the final value and type of each variable. Fix the code so it compiles and prints the correct results.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        String y = \"20\";\n        // This won't compile — fix it:\n        // int z = x + y;\n        \n        // Make z = 30, w = \"3020\"\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        String y = \"20\";\n        int z = x + Integer.parseInt(y);\n        String w = String.valueOf(z) + y;\n        System.out.println(z);      // 30\n        System.out.println(w);      // 3020\n    }\n}",
        testCases: [
          { input: "", expectedOutput: "30\n3020" }
        ],
        difficulty: "intermediate"
      }
    ],
    subtopics: [
      { id: "var-dt-1", title: "Memory Allocation", content: "Variables are allocated on the stack with unique memory addresses. Primitive types store values directly; reference types store addresses." },
      { id: "var-dt-2", title: "Type Systems", content: "Java is statically typed — types are checked at compile time, catching many bugs before the program runs." }
    ]
  },

  {
    id: "conditionals",
    title: "Conditionals",
    description: "Making decisions in code with if/else and switch statements. Your program can now behave differently based on input — the first step toward intelligence.",
    difficulty: "beginner",
    estimatedMinutes: 25,
    prerequisiteIds: ["variables-data-types"],
    explanation: `# Conditionals

Conditionals let your program make decisions. Without them, every run of your code would do exactly the same thing. With \`if/else\` and \`switch\`, your program can react to different inputs and situations.

## How It Works

Java evaluates a boolean expression (true or false) and runs different code blocks based on the result. You can chain multiple conditions with \`else if\` for multi-way branching.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int score = 85;

        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else if (score >= 70) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F");
        }
        // Output: Grade: B
    }
}
\`\`\`

### Switch Statements

For checking a variable against multiple specific values, \`switch\` is cleaner:

\`\`\`java
String day = "Monday";
switch (day) {
    case "Monday": System.out.println("Start of week"); break;
    case "Friday": System.out.println("Weekend soon!"); break;
    default: System.out.println("Regular day");
}
\`\`\`

### Common Patterns
- **Range checks**: \`if (x > 0 && x < 100)\` — value is within a range
- **Null safety**: \`if (str != null && !str.isEmpty())\` — check before using
- **Ternary operator**: \`String label = (age >= 18) ? "Adult" : "Minor";\` — compact if/else`,
    visualizationType: "flow",
    exercises: [
      {
        id: "cond-ex-1",
        title: "Odd or Even Checker",
        description: "Write a program that reads an integer and prints \"even\" if it's divisible by 2, or \"odd\" otherwise. Use the modulo operator.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int n = 7;\n        // Print \"even\" or \"odd\"\n        \n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int n = 7;\n        if (n % 2 == 0) {\n            System.out.println(\"even\");\n        } else {\n            System.out.println(\"odd\");\n        }\n    }\n}",
        testCases: [
          { input: "7", expectedOutput: "odd" },
          { input: "8", expectedOutput: "even" },
          { input: "0", expectedOutput: "even" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "cond-ex-2",
        title: "Leap Year Checker",
        description: "A year is a leap year if it's divisible by 4, except century years which must be divisible by 400. Write a program that checks if a year is a leap year.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int year = 2024;\n        // Determine if leap year\n        \n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int year = 2024;\n        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n        System.out.println(isLeap ? \"Leap Year\" : \"Not a Leap Year\");\n    }\n}",
        testCases: [
          { input: "2024", expectedOutput: "Leap Year" },
          { input: "1900", expectedOutput: "Not a Leap Year" },
          { input: "2000", expectedOutput: "Leap Year" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "cond-ex-3",
        title: "Simple Calculator",
        description: "Write a program that takes two numbers and an operator (+, -, *, /) and prints the result. Handle division by zero gracefully.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        double a = 10, b = 3;\n        char op = '/';\n        // Compute result based on operator\n        \n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        double a = 10, b = 3;\n        char op = '/';\n        double result;\n        switch (op) {\n            case '+': result = a + b; break;\n            case '-': result = a - b; break;\n            case '*': result = a * b; break;\n            case '/': result = b != 0 ? a / b : Double.POSITIVE_INFINITY; break;\n            default: result = 0;\n        }\n        System.out.println(result);\n    }\n}",
        testCases: [
          { input: "10, 3, +", expectedOutput: "13.0" },
          { input: "10, 3, /", expectedOutput: "3.333..." },
          { input: "5, 0, /", expectedOutput: "Infinity" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "cond-ch-1",
        title: "Triangle Classifier",
        description: "Given three side lengths, determine if the triangle is equilateral, isosceles, scalene, or invalid (violates triangle inequality). Handle edge cases like zero or negative sides.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        double a = 3, b = 4, c = 5;\n        // Classify the triangle\n        \n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        double a = 3, b = 4, c = 5;\n        if (a <= 0 || b <= 0 || c <= 0) {\n            System.out.println(\"Invalid\");\n        } else if (a + b <= c || a + c <= b || b + c <= a) {\n            System.out.println(\"Invalid\");\n        } else if (a == b && b == c) {\n            System.out.println(\"Equilateral\");\n        } else if (a == b || b == c || a == c) {\n            System.out.println(\"Isosceles\");\n        } else {\n            System.out.println(\"Scalene\");\n        }\n    }\n}",
        testCases: [
          { input: "3, 4, 5", expectedOutput: "Scalene" },
          { input: "5, 5, 5", expectedOutput: "Equilateral" },
          { input: "1, 2, 10", expectedOutput: "Invalid" }
        ],
        difficulty: "intermediate"
      }
    ],
    subtopics: [
      { id: "cond-1", title: "Boolean Algebra", content: "Understanding &&, ||, and ! operators — and how short-circuit evaluation can prevent errors." },
      { id: "cond-2", title: "Branch Prediction", content: "CPUs predict which branch will be taken. Predictable patterns (sorted data) run faster than random ones." }
    ]
  },

  {
    id: "loops",
    title: "Loops",
    description: "Repeating actions with for, while, and do-while loops. Loops let you process collections, generate sequences, and solve problems that require iteration.",
    difficulty: "beginner",
    estimatedMinutes: 30,
    prerequisiteIds: ["conditionals"],
    explanation: `# Loops

Loops let you repeat a block of code multiple times without writing it out. Instead of printing "Hello" 100 times with 100 print statements, a loop does it in 3 lines.

## The Three Loop Types

**For loop** — when you know how many times to repeat:

\`\`\`java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}
\`\`\`

**While loop** — when you repeat until a condition changes:

\`\`\`java
int count = 0;
while (count < 5) {
    System.out.println("Count: " + count);
    count++;
}
\`\`\`

**Do-while** — runs at least once, then checks the condition.

## Breaking Out

Use \`break\` to exit a loop early, and \`continue\` to skip to the next iteration. These are essential for search algorithms and input validation.

### Fibonacci Sequence Example

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int n = 10;\n        int a = 0, b = 1;\n        System.out.print(a + " " + b);\n        for (int i = 2; i < n; i++) {\n            int next = a + b;\n            System.out.print(" " + next);\n            a = b;\n            b = next;\n        }\n    }\n}
// Output: 0 1 1 2 3 5 8 13 21 34
\`\`\``,
    visualizationType: "flow",
    exercises: [
      {
        id: "loop-ex-1",
        title: "FizzBuzz",
        description: "Print numbers 1 to 30. For multiples of 3 print \"Fizz\", for multiples of 5 print \"Buzz\", for multiples of both print \"FizzBuzz\".",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 30; i++) {\n            // Your logic here\n            \n        }\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 30; i++) {\n            if (i % 15 == 0) System.out.println(\"FizzBuzz\");\n            else if (i % 3 == 0) System.out.println(\"Fizz\");\n            else if (i % 5 == 0) System.out.println(\"Buzz\");\n            else System.out.println(i);\n        }\n    }\n}",
        testCases: [
          { input: "1", expectedOutput: "1" },
          { input: "3", expectedOutput: "Fizz" },
          { input: "15", expectedOutput: "FizzBuzz" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "loop-ex-2",
        title: "Factorial Calculator",
        description: "Calculate the factorial of a number n (n!) using a for loop. Factorial of 5 = 5 × 4 × 3 × 2 × 1 = 120.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        // Calculate factorial\n        \n        System.out.println(factorial);\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        long factorial = 1;\n        for (int i = 1; i <= n; i++) {\n            factorial *= i;\n        }\n        System.out.println(factorial);\n    }\n}",
        testCases: [
          { input: "5", expectedOutput: "120" },
          { input: "0", expectedOutput: "1" },
          { input: "10", expectedOutput: "3628800" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "loop-ex-3",
        title: "Sum of Digits",
        description: "Given a positive integer, compute the sum of its digits using a while loop. Example: 1234 → 1 + 2 + 3 + 4 = 10.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int n = 1234;\n        // Sum the digits\n        \n        System.out.println(sum);\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int n = 1234;\n        int sum = 0;\n        while (n > 0) {\n            sum += n % 10;\n            n /= 10;\n        }\n        System.out.println(sum);\n    }\n}",
        testCases: [
          { input: "1234", expectedOutput: "10" },
          { input: "999", expectedOutput: "27" },
          { input: "7", expectedOutput: "7" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "loop-ch-1",
        title: "Prime Number Generator",
        description: "Print all prime numbers up to n using nested loops. A prime number is only divisible by 1 and itself. Optimize by checking only up to the square root.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int n = 30;\n        // Print all primes up to n\n        \n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int n = 30;\n        for (int i = 2; i <= n; i++) {\n            boolean isPrime = true;\n            for (int j = 2; j * j <= i; j++) {\n                if (i % j == 0) { isPrime = false; break; }\n            }\n            if (isPrime) System.out.print(i + \" \");\n        }\n    }\n}",
        testCases: [
          { input: "10", expectedOutput: "2 3 5 7" },
          { input: "30", expectedOutput: "2 3 5 7 11 13 17 19 23 29" }
        ],
        difficulty: "intermediate"
      }
    ],
    subtopics: [
      { id: "loop-1", title: "Loop Invariants", content: "A condition that stays true before and after each iteration — the key to proving loops are correct." },
      { id: "loop-2", title: "Off-by-One Errors", content: "The most common loop bug: using < vs <=, starting at 0 vs 1. Always trace edge cases." }
    ]
  },

  {
    id: "arrays-lists",
    title: "Arrays & Lists",
    description: "Contiguous memory blocks for storing collections of data. Arrays give O(1) indexed access — the workhorse data structure behind almost every algorithm.",
    difficulty: "beginner",
    estimatedMinutes: 25,
    prerequisiteIds: ["loops"],
    explanation: `# Arrays & Lists

An **array** stores elements in contiguous memory, allowing O(1) access by index. It's the most fundamental data structure — even higher-level structures like lists, stacks, and strings are built on top of arrays.

## Memory Layout

\`\`\`
Index:    0      1      2      3      4
         [10]   [20]   [30]   [40]   [50]
Address: 0x100  0x104  0x108  0x10C  0x110
\`\`\`

Each element sits right next to the previous one. To access index 3, Java calculates: base_address + (3 × element_size).

## Operations

| Operation | Time | Notes |
|-----------|------|-------|
| Access    | O(1) | Direct memory calculation |
| Append    | O(1)* | Amortized; may trigger resize |
| Insert    | O(n) | Must shift elements right |
| Delete    | O(n) | Must shift elements left |
| Search    | O(n) | Must check each element |

## Java Arrays vs ArrayList

\`\`\`java
public class Main {
    public static void main(String[] args) {
        // Fixed-size array
        int[] nums = new int[5];
        nums[0] = 10;

        // Dynamic ArrayList
        java.util.ArrayList<Integer> list = new java.util.ArrayList<>();
        list.add(10);
        list.add(20);
        list.add(30);

        // Enhanced for loop
        for (int n : list) {
            System.out.println(n);
        }
    }
}
\`\`\`

Arrays have a fixed size set at creation. ArrayList is a wrapper around an array that automatically grows when you add elements — use it when you don't know the size upfront.`,
    visualizationType: "heap",
    exercises: [
      {
        id: "arr-ex-1",
        title: "Find Maximum Element",
        description: "Write a program that finds the largest number in an array. Iterate through all elements, tracking the maximum seen so far.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {3, 7, 2, 9, 1, 8, 4};\n        // Find the maximum\n        \n        System.out.println(max);\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {3, 7, 2, 9, 1, 8, 4};\n        int max = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] > max) max = nums[i];\n        }\n        System.out.println(max);\n    }\n}",
        testCases: [
          { input: "[3,7,2,9,1,8,4]", expectedOutput: "9" },
          { input: "[1]", expectedOutput: "1" },
          { input: "[-5,-2,-9]", expectedOutput: "-2" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "arr-ex-2",
        title: "Reverse an Array",
        description: "Reverse an array in-place by swapping elements from both ends moving toward the center.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n        // Reverse in-place\n        \n        for (int n : nums) System.out.print(n + \" \");\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int temp = nums[left];\n            nums[left] = nums[right];\n            nums[right] = temp;\n            left++;\n            right--;\n        }\n        for (int n : nums) System.out.print(n + \" \");\n    }\n}",
        testCases: [
          { input: "[1,2,3,4,5]", expectedOutput: "5 4 3 2 1" },
          { input: "[1,2]", expectedOutput: "2 1" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "arr-ex-3",
        title: "Two Sum",
        description: "Find two numbers in an array that add up to a target value. Return their indices. Assume exactly one solution exists.",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n        // Find two indices that sum to target\n        \n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] + nums[j] == target) {\n                    System.out.println(i + \" \" + j);\n                    return;\n                }\n            }\n        }\n    }\n}",
        testCases: [
          { input: "[2,7,11,15], 9", expectedOutput: "0 1" },
          { input: "[3,2,4], 6", expectedOutput: "1 2" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "arr-ch-1",
        title: "Rotate Array",
        description: "Rotate an array to the right by k steps in-place with O(1) extra space. Example: [1,2,3,4,5] rotated by 2 → [4,5,1,2,3].",
        starterCode: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n        int k = 2;\n        // Rotate in-place\n        \n        for (int n : nums) System.out.print(n + \" \");\n    }\n}",
        solution: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n        int k = 2 % nums.length;\n        reverse(nums, 0, nums.length - 1);\n        reverse(nums, 0, k - 1);\n        reverse(nums, k, nums.length - 1);\n        for (int n : nums) System.out.print(n + \" \");\n    }\n    static void reverse(int[] a, int i, int j) {\n        while (i < j) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }\n    }\n}",
        testCases: [
          { input: "[1,2,3,4,5], 2", expectedOutput: "4 5 1 2 3" },
          { input: "[1,2,3], 4", expectedOutput: "3 1 2" }
        ],
        difficulty: "intermediate"
      }
    ],
    subtopics: [
      { id: "arr-1", title: "Cache Locality", content: "Contiguous memory access patterns are cache-friendly — arrays beat linked lists for iteration speed." },
      { id: "arr-2", title: "Dynamic Resizing", content: "ArrayList doubles its backing array when full. This gives O(1) amortized append but occasional O(n) resize cost." }
    ]
  },

  {
    id: "functions",
    title: "Functions",
    description: "Reusable blocks of code with parameters and return values. Functions let you break complex problems into smaller, testable pieces — the key to writing maintainable code.",
    difficulty: "beginner",
    estimatedMinutes: 25,
    prerequisiteIds: ["loops"],
    explanation: `# Functions

A **function** (or method in Java) is a named block of code that performs a specific task. You define it once, then call it from anywhere in your program. Functions take **parameters** as input and optionally **return** a value.

## Why Functions Matter

Without functions, you'd copy-paste the same logic everywhere. With functions, you write it once, test it once, and reuse it infinitely. This is called **DRY** — Don't Repeat Yourself.

## Defining and Calling Functions

\`\`\`java
public class Main {
    // Function definition
    static int fibonacci(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }

    public static void main(String[] args) {
        // Function calls
        System.out.println(fibonacci(5));  // Output: 5
        System.out.println(fibonacci(10)); // Output: 55
    }
}
\`\`\`

## Key Concepts

- **Parameters** — inputs the function receives (like \`n\` above)
- **Return value** — output the function sends back (\`int\` after \`static\`)
- **void** — return nothing (use when the function just prints or modifies state)
- **Scope** — variables defined inside a function are not visible outside it
- **Call stack** — each function call pushes a frame onto the stack; returns pop it

### Method Overloading

Java lets you define multiple functions with the same name but different parameter types:

\`\`\`java
static int add(int a, int b) { return a + b; }\nstatic double add(double a, double b) { return a + b; }
\`\`\``,
    visualizationType: "stack",
    exercises: [
      {
        id: "fn-ex-1",
        title: "Factorial Function",
        description: "Write a function that calculates the factorial of n iteratively. Return 1 for n = 0.",
        starterCode: "public class Main {\n    // Write factorial function here\n    \n    public static void main(String[] args) {\n        System.out.println(factorial(5)); // 120\n    }\n}",
        solution: "public class Main {\n    static long factorial(int n) {\n        long result = 1;\n        for (int i = 2; i <= n; i++) result *= i;\n        return result;\n    }\n    public static void main(String[] args) {\n        System.out.println(factorial(5));\n    }\n}",
        testCases: [
          { input: "5", expectedOutput: "120" },
          { input: "0", expectedOutput: "1" },
          { input: "10", expectedOutput: "3628800" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "fn-ex-2",
        title: "Palindrome Checker",
        description: "Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore case and spaces.",
        starterCode: "public class Main {\n    // Write isPalindrome function here\n    \n    public static void main(String[] args) {\n        System.out.println(isPalindrome(\"racecar\")); // true\n    }\n}",
        solution: "public class Main {\n    static boolean isPalindrome(String s) {\n        String cleaned = s.toLowerCase().replace(\" \", \"\");\n        int left = 0, right = cleaned.length() - 1;\n        while (left < right) {\n            if (cleaned.charAt(left) != cleaned.charAt(right)) return false;\n            left++; right--;\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        System.out.println(isPalindrome(\"racecar\"));\n    }\n}",
        testCases: [
          { input: "\"racecar\"", expectedOutput: "true" },
          { input: "\"hello\"", expectedOutput: "false" },
          { input: "\"A man a plan a canal Panama\"", expectedOutput: "true" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "fn-ex-3",
        title: "Count Vowels",
        description: "Write a function that counts the number of vowels (a, e, i, o, u) in a string, case-insensitive.",
        starterCode: "public class Main {\n    // Write countVowels function here\n    \n    public static void main(String[] args) {\n        System.out.println(countVowels(\"AXIOM\")); // 3\n    }\n}",
        solution: "public class Main {\n    static int countVowels(String s) {\n        int count = 0;\n        for (char c : s.toLowerCase().toCharArray()) {\n            if (\"aeiou\".indexOf(c) >= 0) count++;\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        System.out.println(countVowels(\"AXIOM\"));\n    }\n}",
        testCases: [
          { input: "\"AXIOM\"", expectedOutput: "3" },
          { input: "\"bcdfg\"", expectedOutput: "0" },
          { input: "\"education\"", expectedOutput: "5" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "fn-ch-1",
        title: "Function Composition",
        description: "Write a higher-order function that takes two functions and returns their composition: compose(f, g)(x) = f(g(x)). Use Java's functional interfaces.",
        starterCode: "import java.util.function.*;\n\npublic class Main {\n    // Write compose function here\n    \n    public static void main(String[] args) {\n        Function<Integer, Integer> doubleIt = x -> x * 2;\n        Function<Integer, Integer> addOne = x -> x + 1;\n        Function<Integer, Integer> composed = compose(addOne, doubleIt);\n        System.out.println(composed.apply(5)); // 11 (5*2+1)\n    }\n}",
        solution: "import java.util.function.*;\n\npublic class Main {\n    static <A, B, C> Function<A, C> compose(Function<B, C> f, Function<A, B> g) {\n        return x -> f.apply(g.apply(x));\n    }\n    public static void main(String[] args) {\n        Function<Integer, Integer> doubleIt = x -> x * 2;\n        Function<Integer, Integer> addOne = x -> x + 1;\n        Function<Integer, Integer> composed = compose(addOne, doubleIt);\n        System.out.println(composed.apply(5));\n    }\n}",
        testCases: [
          { input: "5", expectedOutput: "11" },
          { input: "0", expectedOutput: "1" }
        ],
        difficulty: "intermediate"
      }
    ],
    subtopics: [
      { id: "fn-1", title: "Call Stack Mechanics", content: "Each function call pushes a stack frame with local variables, parameters, and return address. Deep recursion can overflow the stack." },
      { id: "fn-2", title: "Pass by Value", content: "Java passes primitives by value (copies) and object references by value (copies the reference, not the object)." }
    ]
  },

  {
    id: "recursion",
    title: "Recursion",
    description: "Functions that call themselves to solve smaller versions of the same problem. Recursion turns complex iterative logic into elegant, readable code — but requires careful base case design.",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    prerequisiteIds: ["functions", "arrays-lists"],
    explanation: `# Recursion

A **recursive** function is one that calls itself. It solves a problem by breaking it into smaller instances of the same problem, until it reaches a **base case** — a simple version that can be answered directly.

## The Two Rules

1. **Base case** — the stopping condition (prevents infinite recursion)
2. **Recursive case** — the function calls itself with a smaller input

## Fibonacci: The Classic Example

\`\`\`java
public class Main {
    static int fibonacci(int n) {
        // Base case
        if (n <= 1) return n;
        // Recursive case
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        // Output: 0 1 1 2 3 5 8 13 21 34
    }
}
\`\`\`

## The Call Stack

Every recursive call pushes a new frame onto the call stack:

\`\`\`
fibonacci(4)\n├── fibonacci(3)\n│   ├── fibonacci(2)\n│   │   ├── fibonacci(1) → 1\n│   │   └── fibonacci(0) → 0\n│   └── = 1 + 0 = 1\n│   └── fibonacci(1) → 1\n│   └── = 1 + 1 = 2\n└── fibonacci(2)\n    ├── fibonacci(1) → 1\n    └── fibonacci(0) → 0\n    └── = 1 + 0 = 1\n= 2 + 1 = 3
\`\`\`

Notice how \`fibonacci(2)\` is computed twice! This is why plain recursive Fibonacci is exponential. We'll fix that with memoization later.

## When to Use Recursion

- Tree and graph traversals (natural fit)
- Divide and conquer algorithms
- Problems where the recursive structure is clearer than loops`,
    visualizationType: "stack",
    exercises: [
      {
        id: "rec-ex-1",
        title: "Recursive Factorial",
        description: "Implement factorial recursively. The base case is factorial(0) = 1, and the recursive case is factorial(n) = n * factorial(n-1).",
        starterCode: "public class Main {\n    static int factorial(int n) {\n        // Base case and recursive case\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(factorial(5)); // 120\n    }\n}",
        solution: "public class Main {\n    static int factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(factorial(5));\n    }\n}",
        testCases: [
          { input: "5", expectedOutput: "120" },
          { input: "0", expectedOutput: "1" },
          { input: "10", expectedOutput: "3628800" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "rec-ex-2",
        title: "Recursive Sum of Array",
        description: "Write a recursive function that sums all elements in an array. Base case: empty array sums to 0. Recursive case: first element + sum of rest.",
        starterCode: "public class Main {\n    static int sumArray(int[] arr, int index) {\n        // Recursive sum starting from index\n        \n    }\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n        System.out.println(sumArray(nums, 0)); // 15\n    }\n}",
        solution: "public class Main {\n    static int sumArray(int[] arr, int index) {\n        if (index >= arr.length) return 0;\n        return arr[index] + sumArray(arr, index + 1);\n    }\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n        System.out.println(sumArray(nums, 0));\n    }\n}",
        testCases: [
          { input: "[1,2,3,4,5]", expectedOutput: "15" },
          { input: "[]", expectedOutput: "0" },
          { input: "[42]", expectedOutput: "42" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "rec-ex-3",
        title: "Recursive Binary Search",
        description: "Implement binary search recursively on a sorted array. Compare the middle element, then recurse on the left or right half.",
        starterCode: "public class Main {\n    static int binarySearch(int[] arr, int target, int left, int right) {\n        // Recursive binary search\n        \n    }\n    public static void main(String[] args) {\n        int[] nums = {1, 3, 5, 7, 9, 11};\n        System.out.println(binarySearch(nums, 7, 0, nums.length - 1)); // 3\n    }\n}",
        solution: "public class Main {\n    static int binarySearch(int[] arr, int target, int left, int right) {\n        if (left > right) return -1;\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);\n        return binarySearch(arr, target, left, mid - 1);\n    }\n    public static void main(String[] args) {\n        int[] nums = {1, 3, 5, 7, 9, 11};\n        System.out.println(binarySearch(nums, 7, 0, nums.length - 1));\n    }\n}",
        testCases: [
          { input: "[1,3,5,7,9], 7", expectedOutput: "3" },
          { input: "[1,3,5,7,9], 4", expectedOutput: "-1" },
          { input: "[5], 5", expectedOutput: "0" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "rec-ch-1",
        title: "Tower of Hanoi",
        description: "Solve the Tower of Hanoi puzzle for n disks. Print each move. The puzzle: move all disks from peg A to peg C using peg B as auxiliary, moving one disk at a time, never placing a larger disk on a smaller one.",
        starterCode: "public class Main {\n    static void hanoi(int n, char source, char target, char auxiliary) {\n        // Print each move\n        \n    }\n    public static void main(String[] args) {\n        hanoi(3, 'A', 'C', 'B');\n    }\n}",
        solution: "public class Main {\n    static void hanoi(int n, char source, char target, char auxiliary) {\n        if (n == 1) {\n            System.out.println(\"Move disk 1 from \" + source + \" to \" + target);\n            return;\n        }\n        hanoi(n - 1, source, auxiliary, target);\n        System.out.println(\"Move disk \" + n + \" from \" + source + \" to \" + target);\n        hanoi(n - 1, auxiliary, target, source);\n    }\n    public static void main(String[] args) {\n        hanoi(3, 'A', 'C', 'B');\n    }\n}",
        testCases: [
          { input: "1", expectedOutput: "Move disk 1 from A to C" },
          { input: "3", expectedOutput: "7 moves" }
        ],
        difficulty: "advanced"
      },
      {
        id: "rec-ch-2",
        title: "Generate Permutations",
        description: "Generate all permutations of a string recursively. For \"abc\", output all 6 orderings. Hint: fix one character at a time and permute the rest.",
        starterCode: "public class Main {\n    static void permute(String prefix, String remaining) {\n        // Generate all permutations\n        \n    }\n    public static void main(String[] args) {\n        permute(\"\", \"abc\");\n    }\n}",
        solution: "public class Main {\n    static void permute(String prefix, String remaining) {\n        if (remaining.isEmpty()) {\n            System.out.println(prefix);\n            return;\n        }\n        for (int i = 0; i < remaining.length(); i++) {\n            permute(prefix + remaining.charAt(i),\n                    remaining.substring(0, i) + remaining.substring(i + 1));\n        }\n    }\n    public static void main(String[] args) {\n        permute(\"\", \"abc\");\n    }\n}",
        testCases: [
          { input: "\"ab\"", expectedOutput: "ab\nba" },
          { input: "\"abc\"", expectedOutput: "6 permutations" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "rec-1", title: "Stack Overflow", content: "Each recursive call consumes stack space. Java defaults to ~1000 frames — use iteration or increase stack size for deep recursion." },
      { id: "rec-2", title: "Tail Recursion", content: "When the recursive call is the last operation, some languages optimize it into a loop. Java doesn't, but it's still a useful concept." }
    ]
  },

  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Node-based data structures where each element points to the next. Linked lists excel at insertions and deletions but sacrifice random access — a fundamental trade-off vs arrays.",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    prerequisiteIds: ["recursion"],
    explanation: `# Linked Lists

A **linked list** is a chain of **nodes**, where each node stores data and a pointer (reference) to the next node. Unlike arrays, nodes are scattered in memory — connected by references, not by position.

## Structure

\`\`\`
Head → [5|→] → [3|→] → [8|→] → [1|→] → null
\`\`\`

Each node has two fields: \`data\` and \`next\`. The last node points to \`null\`.

## Node Definition in Java

\`\`\`java
class Node {\n    int data;\n    Node next;\n    Node(int data) { this.data = data; }\n}
\`\`\`

## Trade-offs vs Arrays

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1)* | O(n) / O(1) with tail |
| Delete by value | O(n) | O(n) (but no shift needed) |
| Memory overhead | Low | High (extra pointer per node) |

## Reversing a Linked List

\`\`\`java
public class Main {\n    static class Node {\n        int data; Node next;\n        Node(int d) { data = d; }\n    }\n\n    static Node reverse(Node head) {\n        Node prev = null;\n        Node curr = head;\n        while (curr != null) {\n            Node next = curr.next;  // save next\n            curr.next = prev;       // reverse link\n            prev = curr;            // advance\n            curr = next;\n        }\n        return prev;\n    }\n\n    public static void main(String[] args) {\n        // 1 → 2 → 3 → 4 → 5\n        Node head = new Node(1);\n        head.next = new Node(2);\n        head.next.next = new Node(3);\n        head.next.next.next = new Node(4);\n        head.next.next.next.next = new Node(5);\n\n        head = reverse(head);\n        // 5 → 4 → 3 → 2 → 1\n        for (Node n = head; n != null; n = n.next) {\n            System.out.print(n.data + \" \");\n        }\n    }\n}
\`\`\``,
    visualizationType: "flow",
    exercises: [
      {
        id: "ll-ex-1",
        title: "Reverse Linked List",
        description: "Reverse a singly linked list iteratively. Track previous, current, and next pointers carefully.",
        starterCode: "class Node {\n    int data;\n    Node next;\n    Node(int d) { data = d; }\n}\n\npublic class Main {\n    static Node reverse(Node head) {\n        // Reverse the list\n        \n    }\n}",
        solution: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static Node reverse(Node head) {\n        Node prev = null;\n        Node curr = head;\n        while (curr != null) {\n            Node next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}",
        testCases: [
          { input: "1→2→3→4→5", expectedOutput: "5→4→3→2→1" },
          { input: "1→2", expectedOutput: "2→1" },
          { input: "1", expectedOutput: "1" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "ll-ex-2",
        title: "Find Middle Element",
        description: "Find the middle node of a linked list using the slow/fast pointer technique (tortoise and hare). When fast reaches the end, slow is at the middle.",
        starterCode: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static Node findMiddle(Node head) {\n        // Use slow/fast pointers\n        \n    }\n}",
        solution: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static Node findMiddle(Node head) {\n        Node slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n        return slow;\n    }\n}",
        testCases: [
          { input: "1→2→3→4→5", expectedOutput: "3" },
          { input: "1→2→3→4", expectedOutput: "3" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "ll-ex-3",
        title: "Delete Node by Value",
        description: "Delete the first node containing a given value. Handle edge cases: deleting head, deleting tail, value not found.",
        starterCode: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static Node delete(Node head, int value) {\n        // Delete first node with value\n        \n    }\n}",
        solution: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static Node delete(Node head, int value) {\n        if (head == null) return null;\n        if (head.data == value) return head.next;\n        Node curr = head;\n        while (curr.next != null && curr.next.data != value) {\n            curr = curr.next;\n        }\n        if (curr.next != null) curr.next = curr.next.next;\n        return head;\n    }\n}",
        testCases: [
          { input: "1→2→3→4, delete 3", expectedOutput: "1→2→4" },
          { input: "1→2→3, delete 1", expectedOutput: "2→3" },
          { input: "1→2→3, delete 5", expectedOutput: "1→2→3" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "ll-ch-1",
        title: "Detect Cycle",
        description: "Detect if a linked list has a cycle using Floyd's tortoise and hare algorithm. Two pointers moving at different speeds will eventually meet if there's a cycle.",
        starterCode: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static boolean hasCycle(Node head) {\n        // Return true if cycle exists\n        \n    }\n}",
        solution: "class Node {\n    int data; Node next; Node(int d) { data = d; }\n}\n\npublic class Main {\n    static boolean hasCycle(Node head) {\n        Node slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}",
        testCases: [
          { input: "1→2→3→4→(back to 2)", expectedOutput: "true" },
          { input: "1→2→3→null", expectedOutput: "false" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "ll-1", title: "Pointer Manipulation", content: "Linked list operations are all about carefully rewiring next/prev pointers. Drawing diagrams before coding prevents bugs." },
      { id: "ll-2", title: "Dummy Nodes", content: "Adding a dummy head node simplifies edge cases (deleting head, inserting at start) — a common interview trick." }
    ]
  },

  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "LIFO and FIFO data structures that control the order of processing. Stacks power function calls and undo; queues power BFS and task scheduling.",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    prerequisiteIds: ["arrays-lists"],
    explanation: `# Stacks & Queues

These are **restricted** data structures — you can only add and remove from specific ends. This restriction gives them predictable behavior that's essential for algorithms.

## Stack (LIFO — Last In, First Out)

Like a stack of plates — you add and remove from the top.

- **Push** — add to top
- **Pop** — remove from top
- **Peek** — view top without removing

\`\`\`java
import java.util.Stack;\n\npublic class Main {\n    public static void main(String[] args) {\n        Stack<Integer> stack = new Stack<>();\n        stack.push(10);\n        stack.push(20);\n        stack.push(30);\n        System.out.println(stack.pop());  // 30\n        System.out.println(stack.peek()); // 20\n    }\n}
\`\`\`

## Queue (FIFO — First In, First Out)

Like a line at a store — first person served first.

- **Enqueue** (offer) — add to back
- **Dequeue** (poll) — remove from front

\`\`\`java
import java.util.LinkedList;\nimport java.util.Queue;\n\npublic class Main {\n    public static void main(String[] args) {\n        Queue<Integer> queue = new LinkedList<>();\n        queue.offer(10);\n        queue.offer(20);\n        queue.offer(30);\n        System.out.println(queue.poll()); // 10\n        System.out.println(queue.peek()); // 20\n    }\n}
\`\`\`

## Real-World Applications

- **Stack**: function call management, undo/redo, expression parsing, browser back button
- **Queue**: BFS traversal, print spooling, task scheduling, message buffers`,
    visualizationType: "stack",
    exercises: [
      {
        id: "sq-ex-1",
        title: "Valid Parentheses",
        description: "Check if a string of parentheses (), {}, [] is valid. Every opening bracket must be closed by the same type in the correct order.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static boolean isValid(String s) {\n        // Use a stack to match brackets\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(isValid(\"(){}[]\")); // true\n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if ((c == ')' && top != '(') ||\n                    (c == '}' && top != '{') ||\n                    (c == ']' && top != '[')) return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n    public static void main(String[] args) {\n        System.out.println(isValid(\"(){}[]\"));\n    }\n}",
        testCases: [
          { input: "\"(){}[]\"", expectedOutput: "true" },
          { input: "\"([)]\"", expectedOutput: "false" },
          { input: "\"{[]}\"", expectedOutput: "true" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "sq-ex-2",
        title: "Min Stack",
        description: "Design a stack that supports push, pop, top, and retrieving the minimum element — all in O(1) time.",
        starterCode: "import java.util.*;\n\nclass MinStack {\n    // Design your data structure\n    \n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}",
        solution: "import java.util.*;\n\nclass MinStack {\n    Stack<Integer> stack = new Stack<>();\n    Stack<Integer> minStack = new Stack<>();\n\n    public void push(int val) {\n        stack.push(val);\n        if (minStack.isEmpty() || val <= minStack.peek()) {\n            minStack.push(val);\n        }\n    }\n    public void pop() {\n        if (stack.pop().equals(minStack.peek())) minStack.pop();\n    }\n    public int top() { return stack.peek(); }\n    public int getMin() { return minStack.peek(); }\n}",
        testCases: [
          { input: "push(-2), push(0), push(-3), getMin, pop, getMin", expectedOutput: "-3, -2" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "sq-ex-3",
        title: "Queue Using Two Stacks",
        description: "Implement a FIFO queue using only two stacks. The key insight: reverse one stack into the other to flip the order.",
        starterCode: "import java.util.*;\n\nclass MyQueue {\n    Stack<Integer> inStack = new Stack<>();\n    Stack<Integer> outStack = new Stack<>();\n\n    public void push(int x) {}\n    public int pop() { return 0; }\n    public int peek() { return 0; }\n    public boolean empty() { return true; }\n}",
        solution: "import java.util.*;\n\nclass MyQueue {\n    Stack<Integer> inStack = new Stack<>();\n    Stack<Integer> outStack = new Stack<>();\n\n    public void push(int x) { inStack.push(x); }\n    public int pop() {\n        if (outStack.isEmpty()) {\n            while (!inStack.isEmpty()) outStack.push(inStack.pop());\n        }\n        return outStack.pop();\n    }\n    public int peek() {\n        if (outStack.isEmpty()) {\n            while (!inStack.isEmpty()) outStack.push(inStack.pop());\n        }\n        return outStack.peek();\n    }\n    public boolean empty() { return inStack.isEmpty() && outStack.isEmpty(); }\n}",
        testCases: [
          { input: "push 1, push 2, peek", expectedOutput: "1" },
          { input: "push 1, push 2, pop, push 3, pop", expectedOutput: "1, 2" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "sq-ch-1",
        title: "Evaluate Reverse Polish Notation",
        description: "Evaluate an arithmetic expression in Reverse Polish Notation (postfix). Tokens are numbers or operators (+, -, *, /). Use a stack to evaluate.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static int evalRPN(String[] tokens) {\n        // Use a stack to evaluate\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(evalRPN(new String[]{\"2\",\"1\",\"+\",\"3\",\"*\"})); // 9\n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static int evalRPN(String[] tokens) {\n        Stack<Integer> stack = new Stack<>();\n        for (String token : tokens) {\n            if (token.equals(\"+\") || token.equals(\"-\") || token.equals(\"*\") || token.equals(\"/\")) {\n                int b = stack.pop(), a = stack.pop();\n                switch (token) {\n                    case \"+\": stack.push(a + b); break;\n                    case \"-\": stack.push(a - b); break;\n                    case \"*\": stack.push(a * b); break;\n                    case \"/\": stack.push(a / b); break;\n                }\n            } else {\n                stack.push(Integer.parseInt(token));\n            }\n        }\n        return stack.pop();\n    }\n    public static void main(String[] args) {\n        System.out.println(evalRPN(new String[]{\"2\",\"1\",\"+\",\"3\",\"*\"}));\n    }\n}",
        testCases: [
          { input: "[\"2\",\"1\",\"+\",\"3\",\"*\"]", expectedOutput: "9" },
          { input: "[\"4\",\"13\",\"5\",\"/\",\"+\"]", expectedOutput: "6" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "sq-1", title: "Call Stack as Stack", content: "The program's call stack IS a stack — recursive calls push frames, returns pop them. Stack overflow = too many nested calls." },
      { id: "sq-2", title: "Circular Queue", content: "A queue implemented with a fixed-size array that wraps around — avoids shifting elements on dequeue." }
    ]
  },

  {
    id: "trees",
    title: "Trees",
    description: "Hierarchical data structures with parent-child relationships. Trees are everywhere: file systems, DOM, organization charts, and the foundation of search/sort algorithms.",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    prerequisiteIds: ["recursion", "linked-lists"],
    explanation: `# Trees

A **tree** is a hierarchical structure where each **node** has zero or more **children**. The top node is the **root**. Nodes with no children are **leaves**.

## Binary Tree

Each node has at most 2 children: left and right.

\`\`\`
        1\n       / \\\n      2   3\n     / \\   \\\n    4   5   6
\`\`\`

## Node Definition

\`\`\`java
class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}
\`\`\`

## Traversals

| Order | Pattern | Result (example tree) |
|-------|---------|----------------------|
| Pre-order | Node, Left, Right | 1, 2, 4, 5, 3, 6 |
| In-order | Left, Node, Right | 4, 2, 5, 1, 3, 6 |
| Post-order | Left, Right, Node | 4, 5, 2, 6, 3, 1 |
| Level-order | Level by level | 1, 2, 3, 4, 5, 6 |

## In-Order Traversal (Recursive)

\`\`\`java
public class Main {\n    static void inorder(TreeNode root) {\n        if (root == null) return;\n        inorder(root.left);      // visit left\n        System.out.print(root.val + " "); // visit node\n        inorder(root.right);     // visit right\n    }\n\n    public static void main(String[] args) {\n        TreeNode root = new TreeNode(1);\n        root.left = new TreeNode(2);\n        root.right = new TreeNode(3);\n        root.left.left = new TreeNode(4);\n        root.left.right = new TreeNode(5);\n        root.right.right = new TreeNode(6);\n        inorder(root);\n        // Output: 4 2 5 1 3 6\n    }\n}
\`\`\`

In-order traversal of a **Binary Search Tree** produces elements in sorted order — that's its superpower.`,
    visualizationType: "tree",
    exercises: [
      {
        id: "tree-ex-1",
        title: "Maximum Depth of Binary Tree",
        description: "Find the maximum depth (number of nodes along the longest path from root to leaf) of a binary tree using recursion.",
        starterCode: "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static int maxDepth(TreeNode root) {\n        // Recursive solution\n        \n    }\n}",
        solution: "class TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}",
        testCases: [
          { input: "[1,2,3,null,null,null,6]", expectedOutput: "3" },
          { input: "[1]", expectedOutput: "1" },
          { input: "[]", expectedOutput: "0" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "tree-ex-2",
        title: "In-Order Traversal",
        description: "Return the in-order traversal of a binary tree as a list. In-order visits left subtree, then node, then right subtree.",
        starterCode: "import java.util.*;\n\nclass TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static List<Integer> inorder(TreeNode root) {\n        // Return in-order list\n        \n    }\n}",
        solution: "import java.util.*;\n\nclass TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static List<Integer> inorder(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        helper(root, result);\n        return result;\n    }\n    static void helper(TreeNode node, List<Integer> result) {\n        if (node == null) return;\n        helper(node.left, result);\n        result.add(node.val);\n        helper(node.right, result);\n    }\n}",
        testCases: [
          { input: "[1,null,2,3]", expectedOutput: "[1,3,2]" },
          { input: "[1,2,3,4,5]", expectedOutput: "[4,2,5,1,3]" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "tree-ex-3",
        title: "Same Tree",
        description: "Check if two binary trees are structurally identical and have the same node values at each position.",
        starterCode: "class TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static boolean isSameTree(TreeNode p, TreeNode q) {\n        // Compare two trees\n        \n    }\n}",
        solution: "class TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null) return false;\n        return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}",
        testCases: [
          { input: "[1,2,3], [1,2,3]", expectedOutput: "true" },
          { input: "[1,2], [1,null,2]", expectedOutput: "false" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "tree-ch-1",
        title: "Serialize & Deserialize Binary Tree",
        description: "Convert a binary tree to a string and reconstruct it back. Use pre-order traversal with null markers for missing children.",
        starterCode: "class TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static String serialize(TreeNode root) {\n        // Tree → string\n        \n    }\n    static TreeNode deserialize(String data) {\n        // string → tree\n        \n    }\n}",
        solution: "import java.util.*;\n\nclass TreeNode {\n    int val; TreeNode left, right; TreeNode(int v) { val = v; }\n}\n\npublic class Main {\n    static String serialize(TreeNode root) {\n        if (root == null) return \"#\";\n        return root.val + \",\" + serialize(root.left) + \",\" + serialize(root.right);\n    }\n    static TreeNode deserialize(String data) {\n        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(\",\")));\n        return build(nodes);\n    }\n    static TreeNode build(Queue<String> q) {\n        String val = q.poll();\n        if (val.equals(\"#\")) return null;\n        TreeNode node = new TreeNode(Integer.parseInt(val));\n        node.left = build(q);\n        node.right = build(q);\n        return node;\n    }\n}",
        testCases: [
          { input: "[1,2,3,null,null,4,5]", expectedOutput: "[1,2,3,null,null,4,5]" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "tree-1", title: "Balanced Trees", content: "AVL and Red-Black trees maintain height balance to guarantee O(log n) operations — critical for databases and language runtimes." },
      { id: "tree-2", title: "Binary Search Trees", content: "In a BST, left < node < right for every node. This ordering makes search, insert, and delete all O(log n) on a balanced tree." }
    ]
  },

  {
    id: "hash-maps",
    title: "Hash Maps",
    description: "O(1) average-time lookups using hash functions. Hash maps are the most-used data structure in real-world code — from caching to counting to deduplication.",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    prerequisiteIds: ["arrays-lists"],
    explanation: `# Hash Maps

A **hash map** (or hash table) maps keys to values using a **hash function** that computes an array index. This gives O(1) average-time lookups — dramatically faster than searching through a list.

## How It Works

\`\`\`
key → hash(key) → index → value
\`\`\`

The hash function converts any key (string, number, object) into an array index. When you \`put("Alice", 25)\`, Java computes \`hash("Alice") % arraySize\` to find the bucket.

## Collision Resolution

When two keys hash to the same index, we have a **collision**. Java handles this with **chaining** — each bucket is a linked list (or tree for many collisions).

## Java HashMap

\`\`\`java
import java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> ages = new HashMap<>();\n        ages.put("Alice", 25);\n        ages.put("Bob", 30);\n        ages.put("Charlie", 35);\n\n        System.out.println(ages.get("Alice"));    // 25\n        System.out.println(ages.containsKey("Bob")); // true\n\n        // Count character frequencies\n        String text = "hello";\n        HashMap<Character, Integer> counts = new HashMap<>();\n        for (char c : text.toCharArray()) {\n            counts.put(c, counts.getOrDefault(c, 0) + 1);\n        }\n        System.out.println(counts); // {h=1, e=1, l=2, o=1}\n    }\n}
\`\`\`

## Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

The worst case happens when all keys hash to the same bucket (a bad hash function). Java 8+ switches to a balanced tree in that case, giving O(log n) worst case.`,
    visualizationType: "heap",
    exercises: [
      {
        id: "hm-ex-1",
        title: "Character Frequency Counter",
        description: "Count the frequency of each character in a string using a HashMap. Return the most frequent character.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static char mostFrequent(String s) {\n        // Count frequencies and find max\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(mostFrequent(\"hello\")); // l\n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static char mostFrequent(String s) {\n        HashMap<Character, Integer> counts = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            counts.put(c, counts.getOrDefault(c, 0) + 1);\n        }\n        char maxChar = s.charAt(0);\n        int maxCount = 0;\n        for (Map.Entry<Character, Integer> e : counts.entrySet()) {\n            if (e.getValue() > maxCount) {\n                maxCount = e.getValue();\n                maxChar = e.getKey();\n            }\n        }\n        return maxChar;\n    }\n    public static void main(String[] args) {\n        System.out.println(mostFrequent(\"hello\"));\n    }\n}",
        testCases: [
          { input: "\"hello\"", expectedOutput: "l" },
          { input: "\"aabbcc\"", expectedOutput: "a" },
          { input: "\"x\"", expectedOutput: "x" }
        ],
        difficulty: "beginner",
        aiGenerated: false
      },
      {
        id: "hm-ex-2",
        title: "Two Sum with HashMap",
        description: "Solve Two Sum in O(n) using a HashMap. For each element, check if (target - element) exists in the map.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static int[] twoSum(int[] nums, int target) {\n        // O(n) solution using HashMap\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[]{map.get(complement), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
        testCases: [
          { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
          { input: "[3,2,4], 6", expectedOutput: "[1,2]" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "hm-ex-3",
        title: "First Non-Repeating Character",
        description: "Find the first character in a string that appears exactly once. Use two passes: first count, then find.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static char firstUnique(String s) {\n        // Find first non-repeating char\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(firstUnique(\"aabccdeff\")); // b\n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static char firstUnique(String s) {\n        HashMap<Character, Integer> counts = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            counts.put(c, counts.getOrDefault(c, 0) + 1);\n        }\n        for (char c : s.toCharArray()) {\n            if (counts.get(c) == 1) return c;\n        }\n        return ' ';\n    }\n    public static void main(String[] args) {\n        System.out.println(firstUnique(\"aabccdeff\"));\n    }\n}",
        testCases: [
          { input: "\"aabccdeff\"", expectedOutput: "b" },
          { input: "\"aabbcc\"", expectedOutput: " " },
          { input: "\"leetcode\"", expectedOutput: "l" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "hm-ch-1",
        title: "Group Anagrams",
        description: "Given an array of strings, group the anagrams together. Two words are anagrams if they contain the same characters in the same frequency. Use sorted characters as the hash key.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static List<List<String>> groupAnagrams(String[] strs) {\n        // Group by sorted character key\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> groups = new HashMap<>();\n        for (String s : strs) {\n            char[] chars = s.toCharArray();\n            Arrays.sort(chars);\n            String key = new String(chars);\n            groups.putIfAbsent(key, new ArrayList<>());\n            groups.get(key).add(s);\n        }\n        return new ArrayList<>(groups.values());\n    }\n}",
        testCases: [
          { input: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expectedOutput: "[[eat,tea,ate],[tan,nat],[bat]]" },
          { input: "[\"\"]", expectedOutput: "[[\"\"]]" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "hm-1", title: "Hash Functions", content: "A good hash function distributes keys uniformly across buckets. Java's hashCode() for String uses: s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]." },
      { id: "hm-2", title: "Load Factor", content: "Java HashMap resizes when load factor (entries/capacity) exceeds 0.75. Higher load = more collisions; lower = more wasted space." }
    ]
  },

  {
    id: "graphs",
    title: "Graphs",
    description: "Nodes connected by edges — the most general data structure. Graphs model social networks, road maps, dependencies, and anything with relationships between entities.",
    difficulty: "advanced",
    estimatedMinutes: 35,
    prerequisiteIds: ["trees"],
    explanation: `# Graphs

A **graph** consists of **vertices** (nodes) connected by **edges**. Trees are actually a special type of graph — graphs are the most general relationship data structure.

## Representations

**Adjacency List** — each node maps to a list of neighbors (space-efficient for sparse graphs):

\`\`\`java
Map<Integer, List<Integer>> graph = new HashMap<>();
graph.put(0, Arrays.asList(1, 2));
graph.put(1, Arrays.asList(0, 3));
graph.put(2, Arrays.asList(0));
graph.put(3, Arrays.asList(1));
\`\`\`

**Adjacency Matrix** — 2D array where \`matrix[i][j] = 1\` if edge exists (fast lookup, uses more memory):

\`\`\`
   0  1  2  3\n0 [0, 1, 1, 0]\n1 [1, 0, 0, 1]\n2 [1, 0, 0, 0]\n3 [0, 1, 0, 0]
\`\`\`

## Types

- **Directed** — edges have direction (A→B, like a one-way street)
- **Undirected** — edges are bidirectional (A—B, like a friendship)
- **Weighted** — edges have associated costs (distances, prices)
- **Cyclic/Acyclic** — contains cycles or not

## BFS on a Graph

\`\`\`java
import java.util.*;\n\npublic class Main {\n    static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {\n        Set<Integer> visited = new HashSet<>();\n        Queue<Integer> queue = new LinkedList<>();\n        List<Integer> result = new ArrayList<>();\n\n        visited.add(start);\n        queue.offer(start);\n\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            result.add(node);\n            for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {\n                if (!visited.contains(neighbor)) {\n                    visited.add(neighbor);\n                    queue.offer(neighbor);\n                }\n            }\n        }\n        return result;\n    }\n}
\`\`\`

## Applications

Social networks (people = nodes, friendships = edges), road maps (intersections = nodes, roads = edges), web pages (pages = nodes, links = edges), dependency resolution (packages = nodes, depends-on = edges).`,
    visualizationType: "graph",
    exercises: [
      {
        id: "graph-ex-1",
        title: "BFS Traversal",
        description: "Implement BFS on a graph represented as an adjacency list. Return nodes in the order they're visited.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {\n        // BFS traversal\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {\n        Set<Integer> visited = new HashSet<>();\n        Queue<Integer> queue = new LinkedList<>();\n        List<Integer> result = new ArrayList<>();\n        visited.add(start);\n        queue.offer(start);\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            result.add(node);\n            for (int nb : graph.getOrDefault(node, Collections.emptyList())) {\n                if (!visited.contains(nb)) {\n                    visited.add(nb);\n                    queue.offer(nb);\n                }\n            }\n        }\n        return result;\n    }\n}",
        testCases: [
          { input: "{0:[1,2], 1:[3], 2:[], 3:[]}, 0", expectedOutput: "[0,1,2,3]" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "graph-ex-2",
        title: "Number of Connected Components",
        description: "Given an undirected graph, count how many connected components exist. Use DFS to explore each component.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static int countComponents(int n, int[][] edges) {\n        // Count connected components\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static int countComponents(int n, int[][] edges) {\n        Map<Integer, List<Integer>> graph = new HashMap<>();\n        for (int i = 0; i < n; i++) graph.put(i, new ArrayList<>());\n        for (int[] e : edges) { graph.get(e[0]).add(e[1]); graph.get(e[1]).add(e[0]); }\n        Set<Integer> visited = new HashSet<>();\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            if (!visited.contains(i)) {\n                count++;\n                dfs(i, graph, visited);\n            }\n        }\n        return count;\n    }\n    static void dfs(int node, Map<Integer, List<Integer>> graph, Set<Integer> visited) {\n        visited.add(node);\n        for (int nb : graph.get(node)) if (!visited.contains(nb)) dfs(nb, graph, visited);\n    }\n}",
        testCases: [
          { input: "5, [[0,1],[1,2],[3,4]]", expectedOutput: "2" },
          { input: "5, [[0,1],[1,2],[2,3],[3,4]]", expectedOutput: "1" }
        ],
        difficulty: "intermediate",
        aiGenerated: false
      },
      {
        id: "graph-ex-3",
        title: "Is Graph Bipartite?",
        description: "A graph is bipartite if you can color all nodes with 2 colors such that no two adjacent nodes share the same color. Use BFS/DFS with coloring.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static boolean isBipartite(int[][] graph) {\n        // Check if bipartite using 2-coloring\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static boolean isBipartite(int[][] graph) {\n        int[] color = new int[graph.length]; // 0=uncolored, 1=A, -1=B\n        for (int i = 0; i < graph.length; i++) {\n            if (color[i] != 0) continue;\n            Queue<Integer> q = new LinkedList<>();\n            q.offer(i); color[i] = 1;\n            while (!q.isEmpty()) {\n                int node = q.poll();\n                for (int nb : graph[node]) {\n                    if (color[nb] == 0) { color[nb] = -color[node]; q.offer(nb); }\n                    else if (color[nb] == color[node]) return false;\n                }\n            }\n        }\n        return true;\n    }\n}",
        testCases: [
          { input: "[[1,3],[0,2],[1,3],[0,2]]", expectedOutput: "true" },
          { input: "[[1,2,3],[0,2],[0,1,3],[0,2]]", expectedOutput: "false" }
        ],
        difficulty: "advanced",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "graph-ch-1",
        title: "Course Schedule (Cycle Detection)",
        description: "Given n courses and prerequisite pairs, determine if you can finish all courses. This is cycle detection in a directed graph — if there's a cycle, it's impossible.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Detect cycle in directed graph\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static boolean canFinish(int n, int[][] prereqs) {\n        List<List<Integer>> graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n        for (int[] p : graph) ; // placeholder\n        for (int[] p : prereqs) graph.get(p[1]).add(p[0]);\n        int[] state = new int[n]; // 0=unvisited, 1=visiting, 2=visited\n        for (int i = 0; i < n; i++) if (state[i] == 0 && hasCycle(i, graph, state)) return false;\n        return true;\n    }\n    static boolean hasCycle(int node, List<List<Integer>> graph, int[] state) {\n        state[node] = 1;\n        for (int nb : graph.get(node)) {\n            if (state[nb] == 1) return true;\n            if (state[nb] == 0 && hasCycle(nb, graph, state)) return true;\n        }\n        state[node] = 2;\n        return false;\n    }\n}",
        testCases: [
          { input: "2, [[1,0]]", expectedOutput: "true" },
          { input: "2, [[1,0],[0,1]]", expectedOutput: "false" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "graph-1", title: "Graph Representations", content: "Adjacency lists are space-efficient for sparse graphs; matrices are better for dense graphs (many edges)." },
      { id: "graph-2", title: "Graph Properties", content: "Connected, strongly connected, Eulerian, Hamiltonian — each property has algorithms to check and applications to solve." }
    ]
  },

  {
    id: "dijkstra",
    title: "Dijkstra's Algorithm",
    description: "Finding shortest paths in weighted graphs using a greedy approach with a priority queue. Dijkstra is the algorithm behind GPS navigation, network routing, and game pathfinding.",
    difficulty: "advanced",
    estimatedMinutes: 35,
    prerequisiteIds: ["graphs", "stacks-queues"],
    explanation: `# Dijkstra's Algorithm

Dijkstra finds the **shortest path** from a source node to all other nodes in a **weighted** graph (with non-negative edge weights). It's a greedy algorithm: always visit the closest unvisited node next.

## The Algorithm

1. Set distance to source = 0, all others = ∞
2. Use a **priority queue** (min-heap) to always process the closest unvisited node
3. For each neighbor, **relax**: if \`dist[u] + weight < dist[v]\`, update \`dist[v]\`
4. Repeat until all nodes are visited

## Java Implementation

\`\`\`java
import java.util.*;\n\npublic class Main {\n    static class Edge implements Comparable<Edge> {\n        int to, weight;\n        Edge(int to, int weight) { this.to = to; this.weight = weight; }\n        public int compareTo(Edge other) { return this.weight - other.weight; }\n    }\n\n    static int[] dijkstra(int n, List<List<Edge>> graph, int start) {\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[start] = 0;\n        PriorityQueue<Edge> pq = new PriorityQueue<>();\n        pq.offer(new Edge(start, 0));\n\n        while (!pq.isEmpty()) {\n            Edge current = pq.poll();\n            int u = current.to;\n            if (current.weight > dist[u]) continue; // outdated entry\n\n            for (Edge e : graph.get(u)) {\n                if (dist[u] + e.weight < dist[e.to]) {\n                    dist[e.to] = dist[u] + e.weight;\n                    pq.offer(new Edge(e.to, dist[e.to]));\n                }\n            }\n        }\n        return dist;\n    }\n\n    public static void main(String[] args) {\n        int n = 5;\n        List<List<Edge>> graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        // Graph: 0→1 (4), 0→2 (2), 1→2 (1), 1→3 (5), 2→3 (8), 2→4 (10), 3→4 (2)\n        graph.get(0).add(new Edge(1, 4));\n        graph.get(0).add(new Edge(2, 2));\n        graph.get(1).add(new Edge(2, 1));\n        graph.get(1).add(new Edge(3, 5));\n        graph.get(2).add(new Edge(3, 8));\n        graph.get(2).add(new Edge(4, 10));\n        graph.get(3).add(new Edge(4, 2));\n\n        int[] dist = dijkstra(n, graph, 0);\n        System.out.println(Arrays.toString(dist));\n        // Output: [0, 4, 2, 9, 11]\n    }\n}
\`\`\`

## Step-by-Step Example

Starting from node A:\n\`\`\`
Step 1: dist[A]=0, all others=∞\nStep 2: Visit A (dist 0) → update B=4, C=2\nStep 3: Visit C (dist 2) → update D=10, E=12\nStep 4: Visit B (dist 4) → update D=9\nStep 5: Visit D (dist 9) → update E=11\nStep 6: Visit E (dist 11) → done!\nFinal: A=0, B=4, C=2, D=9, E=11
\`\`\`

## Why It Works

Dijkstra works because of the **greedy choice property**: when we pick the closest unvisited node, we know we've found the shortest path to it (no negative edges can surprise us). This is why it fails with negative weights — Bellman-Ford handles those instead.`,
    visualizationType: "graph",
    exercises: [
      {
        id: "dij-ex-1",
        title: "Dijkstra's Shortest Path",
        description: "Implement Dijkstra's algorithm to find shortest distances from a source node in a weighted graph represented as an adjacency list.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static class Edge {\n        int to, weight;\n        Edge(int t, int w) { to = t; weight = w; }\n    }\n\n    static int[] dijkstra(int n, List<List<Edge>> graph, int start) {\n        // Implement Dijkstra\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static class Edge implements Comparable<Edge> {\n        int to, weight;\n        Edge(int t, int w) { to = t; weight = w; }\n        public int compareTo(Edge o) { return this.weight - o.weight; }\n    }\n    static int[] dijkstra(int n, List<List<Edge>> graph, int start) {\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[start] = 0;\n        PriorityQueue<Edge> pq = new PriorityQueue<>();\n        pq.offer(new Edge(start, 0));\n        while (!pq.isEmpty()) {\n            Edge cur = pq.poll();\n            if (cur.weight > dist[cur.to]) continue;\n            for (Edge e : graph.get(cur.to)) {\n                if (dist[cur.to] + e.weight < dist[e.to]) {\n                    dist[e.to] = dist[cur.to] + e.weight;\n                    pq.offer(new Edge(e.to, dist[e.to]));\n                }\n            }\n        }\n        return dist;\n    }\n}",
        testCases: [
          { input: "5 nodes, from 0, edges: 0→1(4), 0→2(2), 1→3(5), 2→3(8), 3→4(2)", expectedOutput: "[0,4,2,9,11]" }
        ],
        difficulty: "advanced",
        aiGenerated: false
      },
      {
        id: "dij-ex-2",
        title: "Network Delay Time",
        description: "Given a network of n nodes with weighted directed edges, find the time for a signal sent from node k to reach ALL nodes. Return -1 if some nodes are unreachable.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static int networkDelayTime(int[][] times, int n, int k) {\n        // Find max shortest distance from k\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static int networkDelayTime(int[][] times, int n, int k) {\n        List<List<int[]>> graph = new ArrayList<>();\n        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());\n        for (int[] t : times) graph.get(t[0]).add(new int[]{t[1], t[2]});\n        int[] dist = new int[n + 1];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[k] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);\n        pq.offer(new int[]{k, 0});\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            if (cur[1] > dist[cur[0]]) continue;\n            for (int[] e : graph.get(cur[0])) {\n                if (dist[cur[0]] + e[1] < dist[e[0]]) {\n                    dist[e[0]] = dist[cur[0]] + e[1];\n                    pq.offer(new int[]{e[0], dist[e[0]]});\n                }\n            }\n        }\n        int max = 0;\n        for (int i = 1; i <= n; i++) { if (dist[i] == Integer.MAX_VALUE) return -1; max = Math.max(max, dist[i]); }\n        return max;\n    }\n}",
        testCases: [
          { input: "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2", expectedOutput: "2" },
          { input: "times=[[1,2,1]], n=3, k=2", expectedOutput: "-1" }
        ],
        difficulty: "advanced",
        aiGenerated: false
      },
      {
        id: "dij-ex-3",
        title: "Cheapest Flights Within K Stops",
        description: "Find the cheapest price from source to destination with at most K stops. This is a modified Dijkstra where we track both cost and stops.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {\n        // Modified Dijkstra with stop limit\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {\n        List<List<int[]>> graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n        for (int[] f : flights) graph.get(f[0]).add(new int[]{f[1], f[2]});\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]);\n        pq.offer(new int[]{0, src, 0}); // cost, city, stops\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int cost = cur[0], city = cur[1], stops = cur[2];\n            if (city == dst) return cost;\n            if (stops > k) continue;\n            for (int[] e : graph.get(city)) {\n                pq.offer(new int[]{cost + e[1], e[0], stops + 1});\n            }\n        }\n        return -1;\n    }\n}",
        testCases: [
          { input: "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1", expectedOutput: "700" }
        ],
        difficulty: "advanced",
        aiGenerated: false
      }
    ],
    challenges: [
      {
        id: "dij-ch-1",
        title: "Path with Maximum Minimum Value",
        description: "Find a path from top-left to bottom-right of a grid that maximizes the minimum value encountered along the path. Use a modified Dijkstra with a max-heap.",
        starterCode: "import java.util.*;\n\npublic class Main {\n    static int maximumMinimumPath(int[][] grid) {\n        // Modified Dijkstra with max-heap\n        \n    }\n}",
        solution: "import java.util.*;\n\npublic class Main {\n    static int maximumMinimumPath(int[][] grid) {\n        int rows = grid.length, cols = grid[0].length;\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> b[0]-a[0]);\n        boolean[][] visited = new boolean[rows][cols];\n        pq.offer(new int[]{grid[0][0], 0, 0});\n        visited[0][0] = true;\n        int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            if (cur[1] == rows-1 && cur[2] == cols-1) return cur[0];\n            for (int[] d : dirs) {\n                int r = cur[1]+d[0], c = cur[2]+d[1];\n                if (r >= 0 && r < rows && c >= 0 && c < cols && !visited[r][c]) {\n                    visited[r][c] = true;\n                    pq.offer(new int[]{Math.min(cur[0], grid[r][c]), r, c});\n                }\n            }\n        }\n        return -1;\n    }\n}",
        testCases: [
          { input: "[[5,4,5],[1,2,6],[7,4,6]]", expectedOutput: "4" }
        ],
        difficulty: "advanced"
      }
    ],
    subtopics: [
      { id: "dij-1", title: "Greedy Choice Property", content: "Dijkstra works because the greedy choice (closest unvisited node) is always optimal — but only with non-negative edge weights." },
      { id: "dij-2", title: "Priority Queue Implementation", content: "Java's PriorityQueue is a binary min-heap. The decrease-key operation isn't supported directly — we just add duplicate entries and skip stale ones." }
    ]
  }
],

// ─── 2. Dependency Graph (React Flow ready) ────────────────────────────────

dependency_graph: {
  nodes: [
    { id: "variables-data-types", label: "Variables & Data Types", status: "completed", difficulty: "beginner", position: { x: 50, y: 50 } },
    { id: "conditionals", label: "Conditionals", status: "completed", difficulty: "beginner", position: { x: 50, y: 140 } },
    { id: "loops", label: "Loops", status: "completed", difficulty: "beginner", position: { x: 50, y: 230 } },
    { id: "arrays-lists", label: "Arrays & Lists", status: "completed", difficulty: "beginner", position: { x: 50, y: 320 } },
    { id: "functions", label: "Functions", status: "completed", difficulty: "beginner", position: { x: 250, y: 230 } },
    { id: "recursion", label: "Recursion", status: "unlocked", difficulty: "intermediate", position: { x: 450, y: 275 } },
    { id: "linked-lists", label: "Linked Lists", status: "unlocked", difficulty: "intermediate", position: { x: 450, y: 50 } },
    { id: "stacks-queues", label: "Stacks & Queues", status: "unlocked", difficulty: "intermediate", position: { x: 450, y: 140 } },
    { id: "hash-maps", label: "Hash Maps", status: "locked", difficulty: "intermediate", position: { x: 450, y: 320 } },
    { id: "trees", label: "Trees", status: "locked", difficulty: "intermediate", position: { x: 650, y: 50 } },
    { id: "graphs", label: "Graphs", status: "locked", difficulty: "advanced", position: { x: 650, y: 180 } },
    { id: "dijkstra", label: "Dijkstra's Algorithm", status: "locked", difficulty: "advanced", position: { x: 850, y: 200 } }
  ],
  edges: [
    { id: "e1", source: "variables-data-types", target: "conditionals", animated: true },
    { id: "e2", source: "conditionals", target: "loops", animated: true },
    { id: "e3", source: "loops", target: "arrays-lists", animated: true },
    { id: "e4", source: "loops", target: "functions", animated: true },
    { id: "e5", source: "functions", target: "recursion", animated: true },
    { id: "e6", source: "arrays-lists", target: "recursion", animated: true },
    { id: "e7", source: "recursion", target: "linked-lists", animated: true },
    { id: "e8", source: "arrays-lists", target: "stacks-queues", animated: true },
    { id: "e9", source: "recursion", target: "trees", animated: true },
    { id: "e10", source: "linked-lists", target: "trees", animated: true },
    { id: "e11", source: "arrays-lists", target: "hash-maps", animated: true },
    { id: "e12", source: "trees", target: "graphs", animated: true },
    { id: "e13", source: "graphs", target: "dijkstra", animated: true },
    { id: "e14", source: "stacks-queues", target: "dijkstra", animated: true }
  ]
},

// ─── 3. AI-Generated Practice Problem Samples ──────────────────────────────

ai_generated_samples: {
  "recursion": [
    {
      id: "ai-rec-001",
      title: "Sum of Digits Recursively",
      description: "Write a recursive function that computes the sum of all digits in a positive integer. For example, sumDigits(1234) = 1 + 2 + 3 + 4 = 10. The base case is when n < 10 (single digit), return n. Otherwise, return the last digit plus the recursive call on the remaining digits.",
      starterCode: "public class Main {\n    static int sumDigits(int n) {\n        // Base case: single digit\n        // Recursive case: last digit + sumDigits(remaining)\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(sumDigits(1234)); // 10\n    }\n}",
      solution: "public class Main {\n    static int sumDigits(int n) {\n        if (n < 10) return n;\n        return (n % 10) + sumDigits(n / 10);\n    }\n    public static void main(String[] args) {\n        System.out.println(sumDigits(1234));\n    }\n}",
      testCases: [
        { "input": "1234", "expectedOutput": "10" },
        { "input": "999", "expectedOutput": "27" },
        { "input": "7", "expectedOutput": "7" },
        { "input": "10000", "expectedOutput": "1" }
      ],
      difficulty: "beginner",
      aiGenerated: true
    },
    {
      id: "ai-rec-002",
      title: "Recursive Power Function",
      description: "Implement a recursive function to compute x^n (x raised to the power n) where n >= 0. Use the divide-and-conquer optimization: if n is even, x^n = (x^(n/2))^2; if n is odd, x^n = x * x^(n-1). This gives O(log n) instead of O(n).",
      starterCode: "public class Main {\n    static double power(double x, int n) {\n        // Recursive power with O(log n)\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(power(2.0, 10)); // 1024.0\n    }\n}",
      solution: "public class Main {\n    static double power(double x, int n) {\n        if (n == 0) return 1.0;\n        if (n < 0) return 1.0 / power(x, -n);\n        double half = power(x, n / 2);\n        if (n % 2 == 0) return half * half;\n        return x * half * half;\n    }\n    public static void main(String[] args) {\n        System.out.println(power(2.0, 10));\n    }\n}",
      testCases: [
        { "input": "2.0, 10", "expectedOutput": "1024.0" },
        { "input": "3.0, 5", "expectedOutput": "243.0" },
        { "input": "5.0, 0", "expectedOutput": "1.0" },
        { "input": "2.0, -3", "expectedOutput": "0.125" }
      ],
      difficulty: "intermediate",
      aiGenerated: true
    }
  ],
  "hash-maps": [
    {
      id: "ai-hm-001",
      title: "Longest Consecutive Sequence",
      description: "Given an unsorted array of integers, find the length of the longest consecutive sequence of numbers. For example, [100, 4, 200, 1, 3, 2] has the longest consecutive sequence [1, 2, 3, 4] with length 4. Use a HashSet for O(1) lookups — only start counting from numbers that don't have a predecessor in the set.",
      starterCode: "import java.util.*;\n\npublic class Main {\n    static int longestConsecutive(int[] nums) {\n        // Use HashSet for O(1) lookups\n        // Only start counting from sequence starters\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(longestConsecutive(new int[]{100, 4, 200, 1, 3, 2})); // 4\n    }\n}",
      solution: "import java.util.*;\n\npublic class Main {\n    static int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int n : nums) set.add(n);\n        int longest = 0;\n        for (int n : set) {\n            if (!set.contains(n - 1)) {\n                int current = n, streak = 1;\n                while (set.contains(current + 1)) {\n                    current++;\n                    streak++;\n                }\n                longest = Math.max(longest, streak);\n            }\n        }\n        return longest;\n    }\n    public static void main(String[] args) {\n        System.out.println(longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}));\n    }\n}",
      testCases: [
        { "input": "[100,4,200,1,3,2]", "expectedOutput": "4" },
        { "input": "[0,3,7,2,5,8,4,6,9,1]", "expectedOutput": "10" },
        { "input": "[]", "expectedOutput": "0" }
      ],
      difficulty: "intermediate",
      aiGenerated: true
    },
    {
      id: "ai-hm-002",
      title: "Subarray Sum Equals K",
      description: "Given an array of integers and a target k, find the total number of continuous subarrays whose sum equals k. Use a prefix sum approach with a HashMap: track the frequency of each prefix sum seen so far. If (currentPrefixSum - k) exists in the map, we've found subarrays summing to k.",
      starterCode: "import java.util.*;\n\npublic class Main {\n    static int subarraySum(int[] nums, int k) {\n        // Prefix sum + HashMap approach\n        \n    }\n    public static void main(String[] args) {\n        System.out.println(subarraySum(new int[]{1, 1, 1}, 2)); // 2\n    }\n}",
      solution: "import java.util.*;\n\npublic class Main {\n    static int subarraySum(int[] nums, int k) {\n        Map<Integer, Integer> prefixCount = new HashMap<>();\n        prefixCount.put(0, 1);\n        int sum = 0, count = 0;\n        for (int n : nums) {\n            sum += n;\n            count += prefixCount.getOrDefault(sum - k, 0);\n            prefixCount.put(sum, prefixCount.getOrDefault(sum, 0) + 1);\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        System.out.println(subarraySum(new int[]{1, 1, 1}, 2));\n    }\n}",
      testCases: [
        { "input": "[1,1,1], 2", "expectedOutput": "2" },
        { "input": "[1,2,3], 3", "expectedOutput": "2" },
        { "input": "[1,-1,0], 0", "expectedOutput": "3" }
      ],
      difficulty: "advanced",
      aiGenerated: true
    }
  ]
},

// ─── 4. Interactive Projects ───────────────────────────────────────────────

projects: [
  {
    id: "todo-cli",
    title: "Build a To-Do List CLI",
    description: "A command-line task manager that supports adding, listing, completing, and deleting tasks with priorities and due dates. Tasks persist to a JSON file between sessions. This project reinforces array manipulation, function design, and control flow in a practical application.",
    prerequisiteTopicIds: ["loops", "arrays-lists", "functions"],
    difficulty: "beginner",
    estimatedHours: 6,
    milestones: [
      { id: "todo-m1", title: "Task Data Model", description: "Define a Task class with fields: id (auto-increment), title (String), completed (boolean), priority (enum: HIGH/MEDIUM/LOW), and dueDate (String). Include a constructor and toString method." },
      { id: "todo-m2", title: "CRUD Operations", description: "Implement four core functions: addTask(title, priority), listTasks(filter by completion status), completeTask(id), and deleteTask(id). Each function should validate input and print clear feedback." },
      { id: "todo-m3", title: "CLI Menu Loop", description: "Build an interactive menu that runs in a loop: display options, read user input, dispatch to the correct function. Handle invalid input gracefully and provide a help command." },
      { id: "todo-m4", title: "File Persistence", description: "Save tasks to tasks.json on every change and load them on startup. Use a simple JSON format. Handle the case where the file doesn't exist (first run)." },
      { id: "todo-m5", title: "Priority Sorting & Polish", description: "Add a sort-by-priority option, color-coded output (if terminal supports it), input validation, and error messages for edge cases like deleting non-existent tasks." }
    ],
    starterScaffold: {
      description: "A single Java file project with a clear structure:",
      structure: [
        "todo-cli/",
        "├── src/",
        "│   ├── Main.java          # CLI entry point, menu loop",
        "│   ├── Task.java          # Task data model class",
        "│   ├── TaskManager.java   # CRUD operations on ArrayList<Task>",
        "│   └── FileStorage.java   # JSON read/write using basic string ops",
        "├── data/",
        "│   └── tasks.json         # Persisted task data (created on first run)",
        "└── README.md              # Usage instructions"
      ]
    }
  },

  {
    id: "maze-solver",
    title: "Build a Maze Solver",
    description: "An interactive maze solver that reads a maze from a text file, finds the shortest path from start to exit using BFS, and optionally visualizes the solution. Covers graph traversal, queue-based algorithms, and recursive backtracking as an alternative approach.",
    prerequisiteTopicIds: ["graphs", "recursion"],
    difficulty: "intermediate",
    estimatedHours: 10,
    milestones: [
      { id: "maze-m1", title: "Maze Parser", description: "Read a maze from a text file where '#' is wall, '.' is path, 'S' is start, 'E' is exit. Parse it into a 2D char array. Validate the maze has exactly one start and one exit." },
      { id: "maze-m2", title: "BFS Pathfinding", description: "Implement BFS to find the shortest path from S to E. Track visited cells and parent pointers to reconstruct the path. Print the path as a sequence of coordinates." },
      { id: "maze-m3", title: "DFS Alternative", description: "Implement DFS as an alternative solver. Compare the path found by BFS vs DFS — BFS guarantees shortest, DFS does not but uses less memory." },
      { id: "maze-m4", title: "Solution Visualization", description: "Print the maze with the solution path marked using '*' characters. Show visited cells differently from the final path. Display the path length and number of cells explored." },
      { id: "maze-m5", title: "Maze Generator", description: "Bonus: generate random solvable mazes using recursive backtracking (depth-first maze generation). Allow the user to choose maze dimensions." }
    ],
    starterScaffold: {
      description: "A modular Java project separating parsing, solving, and display:",
      structure: [
        "maze-solver/",
        "├── src/",
        "│   ├── Main.java             # Entry point, CLI args parsing",
        "│   ├── Maze.java             # 2D char array, parser, validator",
        "│   ├── BFSSolver.java        # BFS-based shortest path finder",
        "│   ├── DFSSolver.java        # DFS-based path finder (alternative)",
        "│   ├── Path.java             # Path representation with coordinates",
        "│   └── MazeVisualizer.java   # Print maze with solution overlay",
        "├── mazes/",
        "│   ├── small.txt             # 5x5 sample maze",
        "│   ├── medium.txt            # 15x15 sample maze",
        "│   └── large.txt             # 30x30 challenge maze",
        "└── README.md                 # Usage, maze format spec"
      ]
    }
  },

  {
    id: "library-system",
    title: "Build a Library Management System",
    description: "A full-featured library system managing books, members, and borrow records. Uses HashMaps for O(1) lookups, Trees for sorted searches, and Linked Lists for history tracking. Includes search, sorting, and reporting features.",
    prerequisiteTopicIds: ["hash-maps", "trees", "linked-lists"],
    difficulty: "advanced",
    estimatedHours: 14,
    milestones: [
      { id: "lib-m1", title: "Book & Member Models", description: "Create Book class (ISBN, title, author, year, genre, available) and Member class (id, name, email, borrowedBooks list). Use a LinkedList for each member's borrowing history." },
      { id: "lib-m2", title: "HashMap Catalog", description: "Store books in a HashMap<ISBN, Book> for O(1) lookup by ISBN. Implement addBook, removeBook, searchByTitle (linear scan), and searchByAuthor methods. Add a genre index using HashMap<String, List<Book>>." },
      { id: "lib-m3", title: "BST for Sorted Search", description: "Implement a Binary Search Tree of books ordered by title. This enables O(log n) title searches and in-order traversal for alphabetical listing. Sync the BST with the HashMap catalog." },
      { id: "lib-m4", title: "Borrowing System", description: "Implement borrowBook(memberId, ISBN) and returnBook(memberId, ISBN). Track borrow dates, due dates, and overdue status. Use a LinkedList per member for chronological history. Enforce a max 5 books per member limit." },
      { id: "lib-m5", title: "Reports & Persistence", description: "Generate reports: most borrowed books, overdue books, popular genres. Save/load all data to JSON. Add a statistics dashboard showing total books, active members, and average borrow duration." }
    ],
    starterScaffold: {
      description: "A well-structured Java project with separation of concerns:",
      structure: [
        "library-system/",
        "├── src/",
        "│   ├── Main.java                # Entry point, menu system",
        "│   ├── models/",
        "│   │   ├── Book.java            # Book data model",
        "│   │   ├── Member.java          # Member data model with LinkedList history",
        "│   │   └── BorrowRecord.java    # Record: book, date, due date, returned",
        "│   ├── datastructures/",
        "│   │   ├── BookCatalog.java     # HashMap-based catalog with genre index",
        "│   │   ├── TitleBST.java        # Binary Search Tree for title-sorted books",
        "│   │   └── TreeNode.java        # BST node (book, left, right)",
        "│   ├── service/",
        "│   │   ├── LibraryService.java  # Borrow/return logic, business rules",
        "│   │   └── ReportService.java   # Statistics and report generation",
        "│   └── storage/",
        "│       └── JsonStorage.java     # Read/write all data to JSON files",
        "├── data/",
        "│   ├── books.json               # Initial book catalog (seed 20+ books)",
        "│   └── members.json             # Initial members (seed 5+ members)",
        "└── README.md                    # Setup, API docs, sample queries"
      ]
    }
  }
]

};

// ─── Usage ─────────────────────────────────────────────────────────────────
//
// To seed into the existing curriculum system, merge the topics into
// CURRICULUM.topics and add the projects to CURRICULUM.projects:
//
//   import { CURRICULUM } from './curriculumData';
//   import { DSA_SEED_DATA } from './dsaSeedData';
//
//   Object.assign(CURRICULUM.topics, DSA_SEED_DATA.topics);
//   CURRICULUM.projects.push(...DSA_SEED_DATA.projects);
//
// The dependency_graph nodes/edges can be fed directly into React Flow:
//
//   <ReactFlow nodes={DSA_SEED_DATA.dependency_graph.nodes} edges={DSA_SEED_DATA.dependency_graph.edges} />
//
// AI-generated samples populate the practice problem UI:
//
//   const problems = DSA_SEED_DATA.ai_generated_samples[topicId];
