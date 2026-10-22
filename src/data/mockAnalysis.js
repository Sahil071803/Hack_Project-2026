// Demo data for CodeSage AI.
// Everything in this file is pre-written sample content. Nothing here is
// produced by an AI model or retrieved from real documents.

export const LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "typescript", label: "TypeScript" },
];

export const DEMO_NOTICE =
  "Demo mode: this is a pre-written sample analysis. It was not generated from your code and no documents were retrieved.";

const SAMPLES = {
  python: {
    fn: "calculate_average",
    code: String.raw`def calculate_average(numbers):
    total = 0
    for i in range(1, len(numbers)):
        total += numbers[i]
    return total / len(numbers)

scores = [82, 91, 77, 68]
print("Average score:", calculate_average(scores))
`,
    fixed: String.raw`def calculate_average(numbers):
    """Return the mean of numbers, or 0.0 for an empty list."""
    if not numbers:
        return 0.0
    total = 0
    for value in numbers:
        total += value
    return total / len(numbers)

scores = [82, 91, 77, 68]
print("Average score:", calculate_average(scores))
`,
    defLine: 1, loopLine: 3, emptyLine: 5,
    emptySeverity: "Critical",
    emptyTitle: "ZeroDivisionError on an empty list",
    emptyDesc: "len(numbers) is 0 for an empty list, so the division raises ZeroDivisionError and the program crashes.",
    emptyFix: "Return early (or raise a clear error) when the list is empty.",
    emptySnippet: "if not numbers:\n    return 0.0",
    loopSnippet: "for value in numbers:\n    total += value",
    first: "numbers[0]",
    params: "numbers",
    symbols: [
      { name: "calculate_average(numbers)", kind: "function", description: "Takes a list of numbers and returns their mean." },
      { name: "total", kind: "variable", description: "Running sum of the values seen so far." },
      { name: "i", kind: "loop variable", description: "Index produced by range(1, len(numbers))." },
      { name: "scores", kind: "variable", description: "Sample list of four exam scores used by the demo." },
    ],
    loopStep: "A for loop uses range(1, len(numbers)), which yields the indexes 1, 2, 3 and so on.",
  },
  javascript: {
    fn: "calculateAverage",
    code: String.raw`function calculateAverage(numbers) {
  let total = 0;
  for (let i = 1; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total / numbers.length;
}

const scores = [82, 91, 77, 68];
console.log("Average score:", calculateAverage(scores));
`,
    fixed: String.raw`/** Returns the mean of an array of numbers, or 0 for an empty array. */
function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const value of numbers) {
    total += value;
  }
  return total / numbers.length;
}

const scores = [82, 91, 77, 68];
console.log("Average score:", calculateAverage(scores));
`,
    defLine: 1, loopLine: 3, emptyLine: 6,
    emptySeverity: "High",
    emptyTitle: "Empty array produces NaN",
    emptyDesc: "For an empty array the code evaluates 0 / 0, which is NaN in JavaScript. It does not throw, so the bad value can spread silently through later calculations.",
    emptyFix: "Handle the empty case explicitly and return a defined value.",
    emptySnippet: "if (numbers.length === 0) return 0;",
    loopSnippet: "for (const value of numbers) {\n  total += value;\n}",
    first: "numbers[0]",
    params: "numbers",
    symbols: [
      { name: "calculateAverage(numbers)", kind: "function", description: "Takes an array of numbers and returns their mean." },
      { name: "total", kind: "variable", description: "Running sum, declared with let because it changes." },
      { name: "i", kind: "loop variable", description: "Index that starts at 1 in the original code." },
      { name: "scores", kind: "constant", description: "Sample array of four exam scores." },
    ],
    loopStep: "A for loop starts at i = 1 and runs while i < numbers.length.",
  },
  typescript: {
    fn: "calculateAverage",
    code: String.raw`function calculateAverage(numbers: number[]): number {
  let total = 0;
  for (let i = 1; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total / numbers.length;
}

const scores: number[] = [82, 91, 77, 68];
console.log("Average score:", calculateAverage(scores));
`,
    fixed: String.raw`/** Returns the mean of the values, or 0 for an empty array. */
function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const value of numbers) {
    total += value;
  }
  return total / numbers.length;
}

const scores: number[] = [82, 91, 77, 68];
console.log("Average score:", calculateAverage(scores));
`,
    defLine: 1, loopLine: 3, emptyLine: 6,
    emptySeverity: "High",
    emptyTitle: "Empty array produces NaN",
    emptyDesc: "The types say the result is a number, and NaN is technically a number, so the compiler cannot catch this. An empty array evaluates 0 / 0 and returns NaN.",
    emptyFix: "Handle the empty case explicitly so the declared number return type is meaningful.",
    emptySnippet: "if (numbers.length === 0) return 0;",
    loopSnippet: "for (const value of numbers) {\n  total += value;\n}",
    first: "numbers[0]",
    params: "numbers: number[]",
    symbols: [
      { name: "calculateAverage(numbers: number[]): number", kind: "function", description: "Typed function that returns the mean of a number array." },
      { name: "total", kind: "variable", description: "Running sum, inferred as number." },
      { name: "i", kind: "loop variable", description: "Index that starts at 1 in the original code." },
      { name: "scores: number[]", kind: "constant", description: "Sample array of four exam scores." },
    ],
    loopStep: "A for loop starts at i = 1 and runs while i < numbers.length.",
  },
  java: {
    fn: "calculateAverage",
    code: String.raw`public class Main {
    static double calculateAverage(int[] numbers) {
        int total = 0;
        for (int i = 1; i < numbers.length; i++) {
            total += numbers[i];
        }
        return total / numbers.length;
    }

    public static void main(String[] args) {
        int[] scores = {82, 91, 77, 68};
        System.out.println("Average score: " + calculateAverage(scores));
    }
}
`,
    fixed: String.raw`public class Main {
    /** Returns the mean of the values, or 0.0 for an empty array. */
    static double calculateAverage(int[] numbers) {
        if (numbers.length == 0) {
            return 0.0;
        }
        double total = 0;
        for (int value : numbers) {
            total += value;
        }
        return total / numbers.length;
    }

    public static void main(String[] args) {
        int[] scores = {82, 91, 77, 68};
        System.out.println("Average score: " + calculateAverage(scores));
    }
}
`,
    defLine: 2, loopLine: 4, emptyLine: 7,
    emptySeverity: "Critical",
    emptyTitle: "ArithmeticException on an empty array",
    emptyDesc: "Both operands are int, so dividing by numbers.length (0) throws ArithmeticException: / by zero.",
    emptyFix: "Check for an empty array before dividing.",
    emptySnippet: "if (numbers.length == 0) {\n    return 0.0;\n}",
    loopSnippet: "for (int value : numbers) {\n    total += value;\n}",
    first: "numbers[0]",
    params: "int[] numbers",
    intDiv: true,
    intSnippet: "double total = 0;\n// ...\nreturn total / numbers.length;",
    symbols: [
      { name: "calculateAverage(int[] numbers)", kind: "method", description: "Static method that returns the mean as a double." },
      { name: "total", kind: "variable", description: "int accumulator for the sum." },
      { name: "i", kind: "loop variable", description: "Index that starts at 1 in the original code." },
      { name: "scores", kind: "array", description: "Sample int array of four exam scores." },
    ],
    loopStep: "A for loop starts at i = 1 and runs while i < numbers.length.",
  },
  cpp: {
    fn: "calculateAverage",
    code: String.raw`#include <iostream>
#include <vector>
using namespace std;

double calculateAverage(const vector<int>& numbers) {
    int total = 0;
    for (size_t i = 1; i < numbers.size(); i++) {
        total += numbers[i];
    }
    return total / numbers.size();
}

int main() {
    vector<int> scores = {82, 91, 77, 68};
    cout << "Average score: " << calculateAverage(scores) << endl;
    return 0;
}
`,
    fixed: String.raw`#include <iostream>
#include <vector>
using namespace std;

// Returns the mean of the values, or 0.0 for an empty vector.
double calculateAverage(const vector<int>& numbers) {
    if (numbers.empty()) return 0.0;
    double total = 0.0;
    for (int value : numbers) {
        total += value;
    }
    return total / numbers.size();
}

int main() {
    vector<int> scores = {82, 91, 77, 68};
    cout << "Average score: " << calculateAverage(scores) << endl;
    return 0;
}
`,
    defLine: 5, loopLine: 7, emptyLine: 10,
    emptySeverity: "Critical",
    emptyTitle: "Division by zero for an empty vector",
    emptyDesc: "Integer division by numbers.size() (0) is undefined behavior in C++. The program may crash or produce garbage.",
    emptyFix: "Return early when the vector is empty.",
    emptySnippet: "if (numbers.empty()) return 0.0;",
    loopSnippet: "for (int value : numbers) {\n    total += value;\n}",
    first: "numbers[0]",
    params: "const vector<int>& numbers",
    intDiv: true,
    intSnippet: "double total = 0.0;\n// ...\nreturn total / numbers.size();",
    symbols: [
      { name: "calculateAverage(const vector<int>&)", kind: "function", description: "Reads the vector by const reference and returns the mean as a double." },
      { name: "total", kind: "variable", description: "int accumulator for the sum." },
      { name: "i", kind: "loop variable", description: "size_t index that starts at 1 in the original code." },
      { name: "scores", kind: "vector", description: "Sample vector of four exam scores." },
    ],
    loopStep: "A for loop starts at i = 1 and runs while i < numbers.size().",
  },
  c: {
    fn: "calculate_average",
    code: String.raw`#include <stdio.h>

double calculate_average(const int *numbers, int count) {
    int total = 0;
    for (int i = 1; i < count; i++) {
        total += numbers[i];
    }
    return total / count;
}

int main(void) {
    int scores[] = {82, 91, 77, 68};
    printf("Average score: %f\n", calculate_average(scores, 4));
    return 0;
}
`,
    fixed: String.raw`#include <stdio.h>

/* Returns the mean of count values, or 0.0 when count is not positive. */
double calculate_average(const int *numbers, int count) {
    if (count <= 0) return 0.0;
    double total = 0.0;
    for (int i = 0; i < count; i++) {
        total += numbers[i];
    }
    return total / count;
}

int main(void) {
    int scores[] = {82, 91, 77, 68};
    printf("Average score: %f\n", calculate_average(scores, 4));
    return 0;
}
`,
    defLine: 3, loopLine: 5, emptyLine: 8,
    emptySeverity: "Critical",
    emptyTitle: "Division by zero when count is 0",
    emptyDesc: "Dividing an int by 0 is undefined behavior in C and commonly crashes the program with a floating point exception.",
    emptyFix: "Validate count before dividing.",
    emptySnippet: "if (count <= 0) return 0.0;",
    loopSnippet: "for (int i = 0; i < count; i++) {\n    total += numbers[i];\n}",
    first: "numbers[0]",
    params: "const int *numbers, int count",
    intDiv: true,
    intSnippet: "double total = 0.0;\n// ...\nreturn total / count;",
    symbols: [
      { name: "calculate_average(const int *numbers, int count)", kind: "function", description: "Receives a pointer to the data and its length, returns the mean." },
      { name: "total", kind: "variable", description: "int accumulator for the sum." },
      { name: "i", kind: "loop variable", description: "Index that starts at 1 in the original code." },
      { name: "scores", kind: "array", description: "Sample int array of four exam scores." },
    ],
    loopStep: "A for loop starts at i = 1 and runs while i < count.",
  },
};

// Sample knowledge-base documents shown on the Knowledge Base page.
export const knowledgeDocs = [
  { id: "kb-1", title: "Sample Notes: Loops and Indexing", type: "TXT", topic: "Fundamentals", pages: null, sections: 6, size: "18 KB", updated: "2 days ago", summary: "Zero-based indexing, range-style loops and common off-by-one mistakes.", tags: ["loops", "arrays", "off-by-one"] },
  { id: "kb-2", title: "Sample Notes: Handling Empty Collections", type: "TXT", topic: "Fundamentals", pages: null, sections: 5, size: "12 KB", updated: "2 days ago", summary: "Edge cases when a list, array or vector has no elements.", tags: ["edge cases", "validation"] },
  { id: "kb-3", title: "Sample Guide: Python Numeric Types", type: "PDF", topic: "Python", pages: 24, sections: null, size: "420 KB", updated: "1 week ago", summary: "True division, integer division and ZeroDivisionError.", tags: ["python", "numbers"] },
  { id: "kb-4", title: "Sample Guide: JavaScript Number Semantics", type: "PDF", topic: "JavaScript", pages: 31, sections: null, size: "510 KB", updated: "1 week ago", summary: "NaN, Infinity and why 0 / 0 does not throw.", tags: ["javascript", "typescript", "NaN"] },
  { id: "kb-5", title: "Sample Guide: Java Arithmetic and Exceptions", type: "PDF", topic: "Java", pages: 40, sections: null, size: "690 KB", updated: "3 weeks ago", summary: "Integer promotion, truncating division and ArithmeticException.", tags: ["java", "exceptions"] },
  { id: "kb-6", title: "Sample Guide: C and C++ Integer Pitfalls", type: "PDF", topic: "C / C++", pages: 36, sections: null, size: "610 KB", updated: "3 weeks ago", summary: "Undefined behavior, integer division and unsigned types.", tags: ["c", "cpp", "undefined behavior"] },
];

const SOURCE_LIBRARY = [
  { id: "s1", title: "Sample Notes: Loops and Indexing", type: "TXT", location: "Section 2 - Iteration", excerpt: "Collections are indexed from zero. A loop that begins at index 1 silently skips the first element, which is one of the most common off-by-one errors.", relevance: 0.92, langs: ["*"] },
  { id: "s2", title: "Sample Notes: Handling Empty Collections", type: "TXT", location: "Section 4 - Edge cases", excerpt: "Any calculation that divides by the size of a collection must first decide what to do when the collection is empty: return a default, or report an error.", relevance: 0.88, langs: ["*"] },
  { id: "s3", title: "Sample Guide: Python Numeric Types", type: "PDF", location: "Page 12", excerpt: "Dividing by zero raises ZeroDivisionError, even when the numerator is zero.", relevance: 0.81, langs: ["python"] },
  { id: "s4", title: "Sample Guide: JavaScript Number Semantics", type: "PDF", location: "Page 9", excerpt: "Division by zero does not throw. 0 / 0 evaluates to NaN, and NaN propagates through later arithmetic.", relevance: 0.81, langs: ["javascript", "typescript"] },
  { id: "s5", title: "Sample Guide: Java Arithmetic and Exceptions", type: "PDF", location: "Page 18", excerpt: "Dividing two int values performs integer division and discards the fraction. Integer division by zero throws ArithmeticException.", relevance: 0.83, langs: ["java"] },
  { id: "s6", title: "Sample Guide: C and C++ Integer Pitfalls", type: "PDF", location: "Page 7", excerpt: "Integer division by zero is undefined behavior. Dividing two integers also truncates, so convert one operand to a floating-point type first.", relevance: 0.83, langs: ["c", "cpp"] },
];

function getSources(language) {
  return SOURCE_LIBRARY.filter((s) => s.langs.includes("*") || s.langs.includes(language));
}

export function getSampleCode(language) {
  return (SAMPLES[language] || SAMPLES.python).code;
}

export function isSampleCode(code) {
  const value = String(code || "").trim();
  return Object.values(SAMPLES).some((s) => s.code.trim() === value);
}

function buildIssues(s) {
  const list = [
    { id: "i1", severity: s.emptySeverity, line: s.emptyLine, title: s.emptyTitle, description: s.emptyDesc, fix: s.emptyFix, snippet: s.emptySnippet },
    { id: "i2", severity: "High", line: s.loopLine, title: "Loop skips the first element (off-by-one)", description: `The loop starts at index 1, so ${s.first} is never added to the total. The result is wrong for every non-empty input (the demo list gives 59 instead of 79.5).`, fix: "Iterate over every element, starting from index 0.", snippet: s.loopSnippet },
  ];
  if (s.intDiv) {
    list.push({ id: "i3", severity: "Medium", line: s.emptyLine, title: "Integer division truncates the average", description: "total is an integer, so the division discards the fractional part even though the function returns a double.", fix: "Accumulate into a double so the division keeps decimals.", snippet: s.intSnippet });
  }
  list.push({ id: "i4", severity: "Low", line: s.defLine, title: "Function contract is undocumented", description: "Nothing tells callers what happens for an empty input. A short comment makes the new behavior explicit.", fix: "Add a one-line doc comment describing the return value and the empty-input behavior.", snippet: null });
  return list;
}

function buildExplanation(s) {
  return {
    summary: `${s.fn} computes the average of a group of numbers and the program prints it for a sample list of four exam scores.`,
    steps: [
      `The function receives the input (${s.params}).`,
      "A variable called total starts at 0 and will hold the running sum.",
      s.loopStep,
      "Inside the loop, the current element is added to total.",
      "After the loop, total is divided by the number of elements to get the mean.",
      "The program calls the function with the sample scores and prints the result.",
    ],
    symbols: s.symbols,
    note: "The sample analysis also spotted problems in this code. Run Debug Code to see them.",
  };
}

// Returns a mock analysis shaped like the data a real backend would return.
export function getMockAnalysis({ language, mode, code }) {
  const s = SAMPLES[language] || SAMPLES.python;
  const edited = String(code || "").trim() !== s.code.trim();
  const notice = edited
    ? `${DEMO_NOTICE} Your code differs from the built-in sample, so these results describe the sample, not your edits.`
    : DEMO_NOTICE;

  const base = { mode, language, demo: true, notice, sources: getSources(language) };
  if (mode === "explain") return { ...base, explanation: buildExplanation(s) };

  const issues = buildIssues(s);
  return {
    ...base,
    debug: {
      summary: `The sample analysis lists ${issues.length} findings for this code, from a ${s.emptySeverity.toLowerCase()} severity crash risk down to a documentation suggestion.`,
      issues,
      fixedCode: s.fixed,
      fixNotes: issues.filter((i) => i.severity !== "Low").map((i) => i.fix),
    },
  };
}

export function getSeedHistory() {
  const now = Date.now();
  const hour = 3600 * 1000;
  const make = (id, language, mode, hoursAgo, title, issueCount) => ({
    id, language, mode, title, issueCount,
    createdAt: now - hoursAgo * hour,
    code: getSampleCode(language),
    seed: true,
  });
  return [
    make("seed-1", "python", "debug", 3, "Debugged calculate_average", 4),
    make("seed-2", "java", "explain", 26, "Explained calculateAverage", 0),
    make("seed-3", "typescript", "debug", 52, "Debugged calculateAverage", 3),
    make("seed-4", "cpp", "debug", 120, "Debugged calculateAverage", 4),
  ];
}
