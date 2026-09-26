import { Question, InterviewCategory, InterviewRole, InterviewDifficulty } from './types';

export const QUESTION_BANK: Question[] = [
  // --- DSA ---
  {
    id: 'dsa-1',
    category: 'DSA',
    role: 'Software Engineer',
    difficulty: 'Easy',
    question: 'Explain the difference between an Array and a Linked List in terms of memory layout, insertion/deletion, and random access time complexity.',
    expectedKeywords: ['contiguous memory', 'cache locality', 'pointer', 'O(1) random access', 'O(n) search', 'dynamic sizing', 'overhead'],
    rubricCriteria: [
      'Clarifies that arrays use contiguous memory allocation whereas linked lists use nodes with pointers.',
      'Specifies O(1) index-based access for arrays vs O(n) traversal for linked lists.',
      'Compares insertion/deletion at head/tail/arbitrary positions.',
      'Mentions cache locality benefits of arrays vs pointer overhead of linked lists.'
    ],
    sampleIdealAnswer: 'Arrays store elements in contiguous memory blocks, enabling O(1) direct random access by computing memory offsets. However, inserting or deleting in the middle requires O(n) element shifts, and fixed-size arrays need dynamic reallocation. Linked lists store elements as disjoint nodes connected by memory pointers; insertions and deletions at known positions take O(1) time without shifting, but random access is O(n) due to linear traversal. Arrays have superior CPU cache locality, while linked lists incur extra pointer memory overhead.',
    hints: ['Think about CPU cache lines and memory addresses.', 'Consider what happens when inserting at the beginning vs the end.']
  },
  {
    id: 'dsa-2',
    category: 'DSA',
    role: 'Backend Developer',
    difficulty: 'Medium',
    question: 'How does a Hash Map handle collisions under the hood? Contrast Separate Chaining with Open Addressing (Linear Probing), and explain worst-case time complexity.',
    expectedKeywords: ['hash function', 'collision', 'separate chaining', 'open addressing', 'linear probing', 'load factor', 'amortized O(1)', 'worst case O(n)'],
    rubricCriteria: [
      'Explains hash function indexing and how collision occurs when two distinct keys yield identical bucket indices.',
      'Details Separate Chaining (linked lists or red-black trees per bucket).',
      'Details Open Addressing with Linear Probing (finding the next available slot) and mentions clustering.',
      'Explains load factor triggering resizing/rehashing, and amortized O(1) vs worst-case O(n) operations.'
    ],
    sampleIdealAnswer: 'A Hash Map computes a bucket index using a hash function on the key. When two distinct keys hash to the same bucket index, collision resolution is required. In Separate Chaining, each bucket stores a linked list (or balanced tree like Java 8 HashMap) of key-value pairs; lookups traverse this chain. In Open Addressing (Linear Probing), colliding items are placed in the next available sequential slot, which can cause primary clustering. Both strategies maintain an amortized average time complexity of O(1) lookup/insert, but degrade to O(n) in worst cases (e.g. poor hash distribution). A load factor threshold triggers resizing and rehashing to prevent degradation.',
    hints: ['What happens when the array gets full?', 'How does Java 8 optimize linked lists in buckets when chains become long?']
  },
  {
    id: 'dsa-3',
    category: 'DSA',
    role: 'Software Engineer',
    difficulty: 'Hard',
    question: 'Describe how you would detect and serialize a cycle in a directed graph. Compare Kahn’s Algorithm (BFS topological sort) with DFS-based cycle detection using 3-color marking.',
    expectedKeywords: ['directed acyclic graph', 'indegree', 'Kahn algorithm', 'topological sort', 'DFS', 'three color', 'white gray black', 'back edge', 'recursion stack'],
    rubricCriteria: [
      'Describes directed cycles and why simple visited sets are insufficient for directed graphs.',
      'Explains Kahn’s algorithm using in-degree array, queue of zero in-degree nodes, and cycle detection when processed count < total vertices.',
      'Explains DFS 3-color states (White = unvisited, Gray = visiting/in call stack, Black = fully explored).',
      'Identifies that encountering a Gray node indicates a back edge and cycle.'
    ],
    sampleIdealAnswer: 'To detect cycles in a directed graph: 1) DFS with 3-color marking: Vertices are colored White (unvisited), Gray (currently exploring in the recursion stack), or Black (fully explored). When exploring an edge to an already Gray node, a back-edge is detected, confirming a cycle. 2) Kahn\'s Algorithm (BFS): Calculates the in-degree of all nodes, enqueues all nodes with in-degree 0, and repeatedly dequeues while decrementing neighbor in-degrees. If the count of dequeued nodes is less than the total number of vertices, a cycle exists because cycle nodes never reach in-degree 0. Both algorithms run in O(V + E) time and O(V) space.',
    hints: ['Recall what a back edge means in a depth-first traversal tree.']
  },

  // --- JAVASCRIPT ---
  {
    id: 'js-1',
    category: 'JavaScript',
    role: 'Frontend Developer',
    difficulty: 'Easy',
    question: 'Explain what Closures are in JavaScript, how lexical scoping makes them possible, and provide a real-world use case.',
    expectedKeywords: ['closure', 'lexical scope', 'outer function', 'inner function', 'private variables', 'data encapsulation', 'heap memory'],
    rubricCriteria: [
      'Defines closure: a function bundled together with references to its surrounding lexical environment.',
      'Explains how inner functions retain access to outer function scope even after the outer function has returned.',
      'Mentions practical use cases such as data privacy/encapsulation, factory functions, or memoization.',
      'Notes potential memory implications if closures retain unnecessary large references.'
    ],
    sampleIdealAnswer: 'A closure in JavaScript is a function that retains access to variables from its outer (enclosing) lexical scope, even after that outer function has finished executing. JavaScript uses lexical scoping, meaning variable resolution depends on the location where functions are authored in source code. When an outer function executes, variables captured by the inner function are preserved on the heap rather than garbage-collected. Real-world use cases include data encapsulation/private state (e.g. counters or module patterns), function currying, debounce/throttle implementations, and event listener handlers.',
    hints: ['Think of returning an inner function from an outer function.']
  },
  {
    id: 'js-2',
    category: 'JavaScript',
    role: 'Frontend Developer',
    difficulty: 'Medium',
    question: 'How does the JavaScript Event Loop work? Distinguish between the Call Stack, Macrotask Queue, and Microtask Queue with regard to execution order.',
    expectedKeywords: ['call stack', 'event loop', 'single-threaded', 'microtask queue', 'macrotask queue', 'Promise', 'setTimeout', 'queueMicrotask', 'starvation'],
    rubricCriteria: [
      'Establishes JavaScript\'s single-threaded synchronous call stack nature.',
      'Differentiates Microtasks (Promises, queueMicrotask, MutationObserver) from Macrotasks (setTimeout, setInterval, I/O, UI rendering).',
      'Explains execution sequence: synchronous stack executes, then entire microtask queue empties completely before the next macrotask is dequeued.',
      'Mentions potential UI render blocking if microtasks continuously schedule more microtasks.'
    ],
    sampleIdealAnswer: 'JavaScript executes on a single-threaded runtime using a synchronous Call Stack. Asynchronous callbacks are delegated to browser/Node APIs and placed into queues. The Event Loop continuously checks if the Call Stack is empty. When empty: 1) It drains the entire Microtask Queue (Promise .then callbacks, async/await continuations, queueMicrotask, MutationObserver). If microtasks queue more microtasks, they run immediately before anything else. 2) The browser may perform DOM rendering / painting. 3) The Event Loop takes the oldest task from the Macrotask Queue (setTimeout, setInterval, setImmediate, I/O events) and pushes it onto the Call Stack. Thus microtasks always have priority over macrotasks.',
    hints: ['Which queue do Promise.then callbacks go to vs setTimeout?']
  },
  {
    id: 'js-3',
    category: 'JavaScript',
    role: 'Full Stack Developer',
    difficulty: 'Hard',
    question: 'Explain JavaScript’s Prototypal Inheritance vs ES6 Classes, and how V8 optimizes property access under the hood using Hidden Classes (Shapes) and Inline Caching.',
    expectedKeywords: ['prototype chain', '__proto__', 'Object.create', 'syntactic sugar', 'V8 engine', 'hidden classes', 'shapes', 'inline caching', 'deoptimization', 'transitions'],
    rubricCriteria: [
      'Explains prototypal inheritance where objects inherit directly from other objects via prototype chains.',
      'Clarifies that ES6 classes are syntactic sugar over prototypes.',
      'Explains V8 Hidden Classes (Shapes): deterministic transitions created based on property addition order.',
      'Explains Inline Caching (IC): caching object shapes and property offsets to bypass slow hash table lookups.'
    ],
    sampleIdealAnswer: 'In JavaScript, inheritance is prototypal: every object has an internal `[[Prototype]]` link. When accessing a property, the engine traverses this chain until the property is found or `null` is reached. ES6 `class` syntax is syntactic sugar over prototypes, adding cleaner syntax and constructor checks. Because JS is dynamic, hash table lookups would be slow. V8 optimizes this using "Hidden Classes" (or Shapes): as properties are added in the constructor, V8 transitions the object through a tree of shapes. When shapes match across calls, V8 uses "Inline Caching" (IC) to store the direct memory offset of the property, achieving near C++ struct member access speeds. Changing property addition order creates polymorphic shapes and deoptimizes code.',
    hints: ['Why should you initialize all object properties in the constructor in the same order?']
  },

  // --- REACT ---
  {
    id: 'react-1',
    category: 'React',
    role: 'Frontend Developer',
    difficulty: 'Easy',
    question: 'What is the Virtual DOM in React, how does the reconciliation algorithm work, and why are "keys" required in list rendering?',
    expectedKeywords: ['virtual DOM', 'in-memory representation', 'reconciliation', 'diffing algorithm', 'heuristic O(n)', 'keys', 'DOM updates', 're-rendering'],
    rubricCriteria: [
      'Defines the Virtual DOM as a lightweight in-memory JavaScript representation of the actual DOM.',
      'Explains reconciliation: diffing the new VDOM tree with the previous VDOM tree to batch minimal real DOM mutations.',
      'Mentions React\'s O(n) heuristics: different element types produce different trees, and keys identify stable identities across renders.',
      'Explains that keys allow React to track which items were added, removed, or reordered, avoiding unnecessary DOM re-creation and state bugs.'
    ],
    sampleIdealAnswer: 'The Virtual DOM is a lightweight JavaScript object tree mirroring the actual browser DOM. When component state changes, React renders a new Virtual DOM tree and diffs it against the previous one using its reconciliation algorithm (heuristic O(n) diffing). Instead of expensive full DOM re-paints, React batches only the minimum required real DOM mutations. Keys provide stable identity to array elements across renders: with unique keys, React knows whether an item moved, was inserted, or deleted. Without keys (or using array indices during re-ordering), React re-renders mismatched DOM nodes and causes subtle state bugs in form inputs and animations.',
    hints: ['Why is manipulating the real DOM slow compared to JS objects?', 'What happens if you use math.random() as a key?']
  },
  {
    id: 'react-2',
    category: 'React',
    role: 'Frontend Developer',
    difficulty: 'Medium',
    question: 'Compare useEffect, useMemo, and useCallback. When is memoization an anti-pattern, and how do dependency arrays cause stale closures or infinite loops?',
    expectedKeywords: ['side effects', 'useMemo', 'useCallback', 'referential equality', 'anti-pattern', 'stale closure', 'dependency array', 're-render'],
    rubricCriteria: [
      'Contrasts useEffect (handling side effects after paint), useMemo (caching computed values), and useCallback (caching function references).',
      'Explains referential equality and when memoization is useful (e.g. passing callbacks to React.memo child components).',
      'Identifies memoization anti-patterns: overhead of shallow comparisons on trivial operations, bloated code.',
      'Explains stale closures (missing deps in array) and infinite loops (declaring new object/function deps inside the component body).'
    ],
    sampleIdealAnswer: '`useEffect` runs asynchronous side effects (fetching, subscriptions, manual DOM mutations) after browser painting. `useMemo` caches the return value of an expensive calculation, recomputing only when dependencies change. `useCallback` caches a function reference to preserve referential equality, primarily preventing unnecessary re-renders of memoized child components (`React.memo`). Memoization becomes an anti-pattern when applied prematurely to cheap operations where the overhead of maintaining arrays and comparing dependencies exceeds the computation cost. Dependency arrays cause stale closures when values used inside the hook are omitted from the array, capturing outdated scope values; omitting object/array dependencies or creating new references inside render causes infinite render loops.',
    hints: ['Think of referential equality in JavaScript objects and functions.']
  },
  {
    id: 'react-3',
    category: 'React',
    role: 'Full Stack Developer',
    difficulty: 'Hard',
    question: 'Explain the React Fiber architecture. How does Fiber enable concurrent features (like Suspense, useTransition), time-slicing, and interruptible rendering?',
    expectedKeywords: ['fiber architecture', 'stack reconciler', 'work loop', 'linked list tree', 'concurrent react', 'time-slicing', 'useTransition', 'requestIdleCallback', 'priority lanes'],
    rubricCriteria: [
      'Contrasts the old synchronous stack reconciler (which could block the main thread) with Fiber.',
      'Explains Fiber node structure as a linked list (child, sibling, return) representing units of work.',
      'Explains time-slicing: breaking render work into chunks that yield back to browser between animation frames.',
      'Explains how priority lanes and concurrent features (Suspense, useTransition) allow high-priority user input to interrupt background renders.'
    ],
    sampleIdealAnswer: 'Prior to React 16, the Stack Reconciler operated synchronously and recursively: once reconciliation started, it could not be paused, causing dropped frames during heavy DOM operations. React Fiber completely rewrote the engine by modeling the component tree as a linked list of "Fiber" units of work, each holding pointers to child, sibling, and parent (return). This allows React to run an interruptible Work Loop with time-slicing. In Concurrent React, tasks are prioritized into 31 Priority Lanes. When high-priority events (keystrokes, clicks) occur, React can pause in-progress lower-priority rendering (`useTransition`), yield control to the browser to maintain 60fps interactivity, and either resume or discard stale render work later.',
    hints: ['Think about what a linked list allows you to do that a recursive call stack does not.']
  },

  // --- PYTHON ---
  {
    id: 'py-1',
    category: 'Python',
    role: 'Backend Developer',
    difficulty: 'Easy',
    question: 'Explain the difference between mutable and immutable types in Python. What is the danger of using a mutable default argument in a function definition?',
    expectedKeywords: ['mutable', 'immutable', 'list', 'dict', 'tuple', 'id()', 'default argument', 'evaluated at definition', 'shared reference'],
    rubricCriteria: [
      'Identifies common mutable types (list, dict, set) and immutable types (int, float, str, tuple, frozenset).',
      'Explains that modifying a mutable object changes in-place memory without creating a new id.',
      'Explains why mutable default arguments (e.g., `def fn(items=[])`) are dangerous: default values are evaluated once at function definition time, not call time.',
      'Shows the standard idiom: using `None` as default and initializing inside the function.'
    ],
    sampleIdealAnswer: 'In Python, immutable objects (strings, integers, tuples) cannot be altered after creation; modifications return a new object with a different memory address. Mutable objects (lists, dictionaries, sets) can be modified in-place while keeping the same memory ID. Default function arguments are evaluated only once when the function is defined, not on each invocation. If you define `def add_item(val, container=[]):`, that list is shared across every single invocation where the default is used, causing accumulated state bugs. The canonical fix is `def add_item(val, container=None): if container is None: container = []`.',
    hints: ['When is a function header evaluated in Python?']
  },
  {
    id: 'py-2',
    category: 'Python',
    role: 'Backend Developer',
    difficulty: 'Medium',
    question: 'What is Python’s Global Interpreter Lock (GIL)? How does it affect multithreading vs multiprocessing for CPU-bound and I/O-bound tasks?',
    expectedKeywords: ['GIL', 'global interpreter lock', 'CPython', 'reference counting', 'CPU-bound', 'I/O-bound', 'multithreading', 'multiprocessing', 'concurrent.futures'],
    rubricCriteria: [
      'Defines the GIL as a mutex in CPython that prevents multiple native threads from executing Python bytecodes simultaneously.',
      'Explains why it exists: to protect CPython’s reference counting memory management from race conditions.',
      'Explains impact on CPU-bound tasks: multithreading does not achieve true parallelism on multi-core CPUs; multiprocessing is required.',
      'Explains impact on I/O-bound tasks: multithreading or asyncio works well because GIL is released during socket/file I/O waits.'
    ],
    sampleIdealAnswer: 'The Global Interpreter Lock (GIL) is a mutual exclusion lock used by CPython to ensure only one thread executes Python bytecode at a time, protecting CPython\'s internal reference-counting memory management from race conditions. For CPU-bound tasks (e.g. data processing, matrix multiplication, image parsing), Python multithreading cannot achieve true multi-core parallelism because threads compete for the single GIL, adding context-switching overhead. CPU-bound concurrency requires `multiprocessing` or native C-extensions which release the GIL. Conversely, for I/O-bound tasks (network requests, database calls, disk I/O), multithreading or `asyncio` is highly effective because threads automatically release the GIL while awaiting I/O responses.',
    hints: ['Does waiting on a network request hold the GIL?']
  },
  {
    id: 'py-3',
    category: 'Python',
    role: 'AI/ML Engineer',
    difficulty: 'Hard',
    question: 'How do Python Generators and the `yield` statement work under the hood? Explain generator frames, coroutines, and how `asyncio` event loops build upon this mechanic.',
    expectedKeywords: ['generator', 'yield', 'lazy evaluation', 'frame object', 'yield from', 'coroutine', 'asyncio', 'event loop', 'StopIteration', 'generator state'],
    rubricCriteria: [
      'Explains that generator functions return generator iterator objects rather than executing immediately.',
      'Explains how `yield` suspends execution, preserving the local frame state (variables, instruction pointer) on the heap.',
      'Details how `.send()`, `throw()`, and `close()` allow bidirectional communication.',
      'Connects generator suspension to `async`/`await` syntax and cooperative multitasking in `asyncio`.'
    ],
    sampleIdealAnswer: 'When a Python function contains `yield`, calling it produces a generator object without running code immediately. Unlike standard functions whose stack frames are destroyed upon `return`, a generator keeps its frame object (`PyFrameObject`) alive on the heap. Calling `next()` or `.send()` resumes execution at the saved instruction pointer until another `yield` is reached or `StopIteration` is raised. In Python, coroutines evolved directly from generators: `yield from` allowed delegating sub-generators, which led to native `async`/`await`. In `asyncio`, the event loop schedules tasks; when a coroutine awaits a Future/I/O, it yields control back to the event loop, enabling cooperative single-threaded asynchronous multitasking without thread contention.',
    hints: ['What object stores the local variables when a generator pauses?']
  },

  // --- JAVA ---
  {
    id: 'java-1',
    category: 'Java',
    role: 'Backend Developer',
    difficulty: 'Easy',
    question: 'Differentiate between the Java Heap and Stack memory. Where are primitive types and object references stored, and when does OutOfMemoryError vs StackOverflowError occur?',
    expectedKeywords: ['heap', 'stack', 'primitives', 'object reference', 'garbage collection', 'StackOverflowError', 'OutOfMemoryError', 'thread memory'],
    rubricCriteria: [
      'Specifies that Stack memory is per-thread, storing local variables, primitive values, and references to objects.',
      'Specifies that Heap memory is shared across threads, storing all instantiated objects and class instances.',
      'Explains StackOverflowError: caused by excessive recursive calls exceeding stack frame capacity.',
      'Explains OutOfMemoryError (OOM: Java heap space): caused by memory leaks or allocation of objects exceeding JVM heap quota.'
    ],
    sampleIdealAnswer: 'In the JVM, Stack memory is allocated per thread and stores method execution frames, local primitive variables, and references to objects in memory. Stack allocation is LIFO, highly fast, and automatically deallocated when a method exits. Heap memory is shared globally across all threads, housing all instantiated objects and instance variables, managed automatically by the Garbage Collector. `StackOverflowError` occurs when the call stack depth exceeds memory limits (e.g., infinite recursion). `OutOfMemoryError` occurs when the Heap cannot allocate more memory for new objects even after full garbage collection cycles.',
    hints: ['What happens when a recursive function lacks a base case?']
  },
  {
    id: 'java-2',
    category: 'Java',
    role: 'Backend Developer',
    difficulty: 'Medium',
    question: 'Explain Java’s Garbage Collection generational hypothesis. Describe Young Generation (Eden, Survivor), Tenured Generation, and the difference between Minor and Major GC.',
    expectedKeywords: ['generational hypothesis', 'young generation', 'eden', 'survivor spaces', 'tenured generation', 'old generation', 'minor gc', 'major gc', 'stop the world', 'G1 GC'],
    rubricCriteria: [
      'Explains the weak generational hypothesis: most objects die young.',
      'Breaks down Young Generation into Eden and two Survivor spaces (S0/S1).',
      'Describes how surviving objects are promoted to Old/Tenured generation after passing an age threshold.',
      'Contrasts Minor GC (fast, collects Young space) with Major/Full GC (slower, stops-the-world, reclaims Old space).'
    ],
    sampleIdealAnswer: 'The JVM Garbage Collector relies on the Weak Generational Hypothesis: the vast majority of objects have very short lifespans. Heap memory is divided into: 1) Young Generation: consisting of Eden space and two Survivor spaces (S0/S1). New objects are allocated in Eden. When Eden fills, a fast Minor GC runs: surviving objects are copied to a Survivor space, and objects that survive multiple threshold cycles (aging/tenuring threshold) are promoted to 2) Old (Tenured) Generation, which holds long-lived objects. Minor GC is frequent and fast. When Old Generation fills, a Major or Full GC executes, scanning the entire heap. Modern collectors like G1GC and ZGC divide the heap into dynamic regions to minimize Stop-The-World pause times.',
    hints: ['Why does the JVM have two survivor spaces instead of just one?']
  },
  {
    id: 'java-3',
    category: 'Java',
    role: 'Software Engineer',
    difficulty: 'Hard',
    question: 'How does the Java Memory Model (JMM) guarantee visibility and ordering? Explain the `volatile` keyword, happens-before relationships, and how `ConcurrentHashMap` avoids global locks.',
    expectedKeywords: ['JMM', 'volatile', 'happens-before', 'CPU cache coherence', 'memory barriers', 'instruction reordering', 'ConcurrentHashMap', 'CAS', 'synchronized', 'lock striping'],
    rubricCriteria: [
      'Explains how CPU local caches and compiler reordering can cause visibility bugs across threads.',
      'Explains `volatile`: forces reads/writes directly to main memory and prevents compiler instruction reordering via memory barriers.',
      'Defines the happens-before relationship guaranteed by JMM.',
      'Explains `ConcurrentHashMap`: uses CAS (Compare-And-Swap) for insertions and bucket-level synchronized nodes instead of global map locking.'
    ],
    sampleIdealAnswer: 'The Java Memory Model (JMM) defines how threads interact through memory, resolving issues caused by CPU multi-level hardware caches and compiler instruction reordering. The `volatile` keyword guarantees visibility: updates made by one thread are immediately flushed to main memory and subsequent reads fetch the freshest value, while inserting memory barriers to prevent instruction reordering. A "happens-before" relationship ensures memory writes prior to a volatile write or unlock are guaranteed visible to another thread acquiring that lock or reading that volatile variable. In Java 8, `ConcurrentHashMap` avoids global locking by using Lock-Free Compare-And-Swap (CAS) for empty bucket insertions and fine-grained node-level synchronization only on the specific bucket head during collisions, allowing concurrent reads without blocking.',
    hints: ['Does volatile guarantee atomicity for count++? Why or why not?']
  },

  // --- SQL ---
  {
    id: 'sql-1',
    category: 'SQL',
    role: 'Backend Developer',
    difficulty: 'Easy',
    question: 'What is Database Normalization? Compare 1NF, 2NF, and 3NF, and explain when a database architect might intentionally denormalize.',
    expectedKeywords: ['normalization', '1NF', '2NF', '3NF', 'atomic values', 'partial dependency', 'transitive dependency', 'redundancy', 'denormalization', 'read performance'],
    rubricCriteria: [
      'Defines normalization: structuring tables to eliminate data redundancy and insertion/update/deletion anomalies.',
      'Defines 1NF (atomic values, unique primary key, no repeating groups).',
      'Defines 2NF (in 1NF + no partial dependencies on composite keys).',
      'Defines 3NF (in 2NF + no transitive dependencies).',
      'Explains intentional denormalization: trading write overhead and storage to optimize heavy read queries and avoid expensive multi-table joins.'
    ],
    sampleIdealAnswer: 'Normalization organizes relational database tables to reduce data redundancy and prevent insert, update, and delete anomalies. 1NF requires atomic column values (no multi-value arrays) and a unique primary key. 2NF requires 1NF plus eliminating partial dependencies: all non-key columns must depend on the entire primary key (relevant for composite keys). 3NF requires 2NF plus removing transitive dependencies: non-key columns must depend solely on the primary key, not on another non-key column. Architects intentionally denormalize in high-throughput read systems (like data warehouses or reporting engines) by duplicating data or pre-aggregating metrics to avoid complex, expensive multi-table JOINs and disk I/O.',
    hints: ['Remember the phrase: "The key, the whole key, and nothing but the key, so help me Codd".']
  },
  {
    id: 'sql-2',
    category: 'SQL',
    role: 'Backend Developer',
    difficulty: 'Medium',
    question: 'How do B-Tree and Hash indexes work in relational databases? Explain index selectivity, composite index column ordering, and why `LIKE \'%term\'` prevents index usage.',
    expectedKeywords: ['B-Tree index', 'Hash index', 'selectivity', 'composite index', 'leftmost prefix rule', 'table scan', 'wildcard', 'range queries', 'O(log n)'],
    rubricCriteria: [
      'Explains B-Tree structure: self-balancing tree facilitating O(log n) search, range scans, and sorting.',
      'Explains Hash index: O(1) exact match lookup but incapable of range scans or order by operations.',
      'Explains composite indexes and the Leftmost Prefix Rule (queries must filter starting from the leading indexed column).',
      'Explains why leading wildcards (`LIKE \'%term\'`) prevent index traversal and force full table scans.'
    ],
    sampleIdealAnswer: 'A B-Tree index maintains a balanced multi-way search tree where data pointers are kept sorted, supporting O(log n) lookups, range queries (`BETWEEN`, `<`, `>`), and sorting (`ORDER BY`). A Hash index maps keys to bucket addresses via hashing, offering O(1) equality matches (`=`), but cannot perform range scans or ordering. For composite indexes `(colA, colB)`, queries must satisfy the Leftmost Prefix Rule: filtering on `colB` alone cannot traverse the index because sorting is hierarchically ordered by `colA` first. A wildcard query like `LIKE \'%term\'` cannot use the index because B-Trees are traversed using leading character prefixes; searching for an arbitrary ending requires a full table/index scan.',
    hints: ['Think of how you search in a printed phonebook sorted by Last Name, First Name.']
  },
  {
    id: 'sql-3',
    category: 'SQL',
    role: 'Data Scientist',
    difficulty: 'Hard',
    question: 'Explain SQL Window Functions vs GROUP BY. Write and explain how `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, and rolling 7-day average using `ROWS BETWEEN` work.',
    expectedKeywords: ['window function', 'OVER clause', 'PARTITION BY', 'ORDER BY', 'GROUP BY', 'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'sliding window', 'ROWS BETWEEN'],
    rubricCriteria: [
      'Contrasts GROUP BY (collapses multiple rows into a single aggregated row) with Window Functions (computes aggregates while preserving individual row identity).',
      'Distinguishes `ROW_NUMBER()` (strictly unique sequential integers 1,2,3), `RANK()` (skips ranks on ties: 1,2,2,4), and `DENSE_RANK()` (no gaps: 1,2,2,3).',
      'Explains rolling 7-day moving averages with frame specifications (`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`).'
    ],
    sampleIdealAnswer: '`GROUP BY` collapses input rows into a single aggregated row per group, discarding individual row details. In contrast, Window functions perform calculations across a defined set of table rows (the window frame) using the `OVER()` clause while preserving every individual row in the output. `ROW_NUMBER()` assigns sequential unique integers (1, 2, 3...) regardless of ties. `RANK()` gives duplicate values the same rank and skips subsequent ranks (e.g. 1, 2, 2, 4). `DENSE_RANK()` assigns duplicate values the same rank without skipping (e.g. 1, 2, 2, 3). For rolling 7-day averages, the syntax is `AVG(revenue) OVER (PARTITION BY store_id ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`, which establishes a sliding frame across seven ordered records.',
    hints: ['What happens to the number of rows returned by GROUP BY vs a Window function?']
  },

  // --- OPERATING SYSTEMS ---
  {
    id: 'os-1',
    category: 'Operating Systems',
    role: 'Software Engineer',
    difficulty: 'Easy',
    question: 'Explain the difference between processes and threads. What is context switching, and why is switching threads within the same process cheaper than switching processes?',
    expectedKeywords: ['process', 'thread', 'address space', 'virtual memory', 'context switch', 'TLB', 'PCB', 'TCB', 'CPU registers', 'cache flush'],
    rubricCriteria: [
      'Defines a process as an independent executing program with its own dedicated virtual address space and resources.',
      'Defines a thread as a lightweight unit of execution within a process that shares the address space, heap, and open descriptors.',
      'Defines context switching as saving the CPU register state and loading another execution context.',
      'Explains why thread switching is cheaper: no virtual memory address space switch, preserving CPU cache and Translation Lookaside Buffer (TLB) mappings.'
    ],
    sampleIdealAnswer: 'A process is an isolated executing instance of a program allocated its own private virtual memory space, file descriptors, and Process Control Block (PCB). A thread is the smallest unit of CPU scheduling inside a process; threads within the same process share that memory space, heap, and code, while retaining their own stack, program counter, and registers. Context switching involves halting one execution unit, saving its hardware registers into its PCB/TCB, and restoring another. Switching threads within the same process is significantly faster because the virtual memory address space remains unchanged; process context switching requires swapping page directory tables, which flushes the Translation Lookaside Buffer (TLB) and invalidates CPU cache hierarchies.',
    hints: ['What happens to the Translation Lookaside Buffer (TLB) during a process switch?']
  },
  {
    id: 'os-2',
    category: 'Operating Systems',
    role: 'Software Engineer',
    difficulty: 'Medium',
    question: 'What is a Deadlock? State Coffman’s four necessary conditions for deadlock, and contrast Deadlock Prevention, Avoidance (Banker’s Algorithm), and Detection.',
    expectedKeywords: ['deadlock', 'Coffman conditions', 'mutual exclusion', 'hold and wait', 'no preemption', 'circular wait', 'Bankers algorithm', 'resource allocation graph'],
    rubricCriteria: [
      'Defines deadlock: a situation where a set of processes are blocked because each process is holding a resource and waiting for another held by another process.',
      'Names and defines all four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
      'Explains Deadlock Prevention (eliminating at least one Coffman condition, e.g. strict resource ordering).',
      'Explains Deadlock Avoidance (Banker\'s algorithm dynamically evaluating safe vs unsafe states) and Detection (periodic resource allocation graph cycle analysis).'
    ],
    sampleIdealAnswer: 'A Deadlock is a state where two or more processes are permanently blocked, each holding resources while waiting for resources acquired by others. Coffman\'s four conditions must hold simultaneously: 1) Mutual Exclusion (non-shareable resources), 2) Hold and Wait (processes holding resources can request new ones), 3) No Preemption (resources cannot be forcibly confiscated), 4) Circular Wait (a closed chain of processes waiting on each other). Deadlock Prevention invalidates at least one condition beforehand (e.g. enforcing strict global resource acquisition ordering to eliminate circular wait). Deadlock Avoidance dynamically checks resource allocation states (e.g. Dijkstra\'s Banker\'s Algorithm) to ensure the system never enters an "unsafe" state. Deadlock Detection allows deadlocks to occur, detecting them via Resource Allocation Graphs cycle scans and resolving via process termination.',
    hints: ['Which condition is most commonly broken by enforcing strict lock acquisition ordering?']
  },
  {
    id: 'os-3',
    category: 'Operating Systems',
    role: 'Backend Developer',
    difficulty: 'Hard',
    question: 'Describe Virtual Memory, Paging, and Page Fault handling. What happens step-by-step in the OS and MMU when a page fault trap occurs?',
    expectedKeywords: ['virtual memory', 'paging', 'page table', 'MMU', 'page fault', 'trap', 'interrupt', 'TLB', 'swap space', 'disk I/O', 'dirty bit', 'working set'],
    rubricCriteria: [
      'Defines Virtual Memory and explains how it decouples logical address space from physical RAM.',
      'Explains the role of the Memory Management Unit (MMU) and Page Tables (present/valid bit).',
      'Outlines page fault handling step-by-step: CPU traps to OS kernel, validates address, allocates physical frame, loads page from disk/swap, updates page table, restarts instruction.',
      'Mentions page replacement algorithms (LRU, Clock) and the concept of thrashing.'
    ],
    sampleIdealAnswer: 'Virtual memory isolates processes and gives them an illusion of contiguous memory exceeding physical RAM. Memory is divided into fixed-size Pages mapped to physical Frames via Page Tables. When a CPU instruction references a virtual address, the MMU checks the TLB, then the Page Table. If the "Present Bit" is 0, the MMU triggers a Page Fault Trap to the OS kernel. 1) The OS saves the faulting process state and validates the address against the process VMA. 2) If valid, the OS finds a free physical frame (or executes a page replacement algorithm like Clock/LRU to evict a page, writing it to disk if its dirty bit is set). 3) The OS issues a disk I/O request to load the missing page into the frame. 4) The thread sleeps until I/O completes. 5) The OS updates the Page Table entry with the frame number and sets the Present bit. 6) The CPU context is restored and the faulting instruction restarts transparently.',
    hints: ['Does the instruction restart from scratch or continue after a page fault?']
  },

  // --- DBMS ---
  {
    id: 'dbms-1',
    category: 'DBMS',
    role: 'Backend Developer',
    difficulty: 'Easy',
    question: 'Explain the ACID properties of database transactions. Provide a real-world scenario demonstrating what goes wrong if Atomicity or Isolation is violated.',
    expectedKeywords: ['ACID', 'atomicity', 'consistency', 'isolation', 'durability', 'transaction', 'rollback', 'commit', 'write ahead logging', 'concurrency'],
    rubricCriteria: [
      'Defines all four acronyms: Atomicity (all-or-nothing), Consistency (preserves schema constraints/invariants), Isolation (transactions execute independently without interference), Durability (committed writes persist across crashes).',
      'Demonstrates violation of Atomicity (e.g. bank transfer debits Account A but crashes before crediting Account B).',
      'Demonstrates violation of Isolation (e.g. dirty read where Transaction B reads uncommitted data from Transaction A, which then rolls back).'
    ],
    sampleIdealAnswer: 'ACID guarantees database transaction reliability: Atomicity ("all-or-nothing") ensures all statements complete or the entire transaction rolls back; if transferring $100 from Alice to Bob debits Alice but the server crashes before crediting Bob, atomicity rolls back the debit so funds aren\'t lost. Consistency ensures transactions transition the database between valid states upholding all schema constraints, foreign keys, and invariants. Isolation prevents concurrent transactions from interfering with one another; without isolation, a "dirty read" could allow a lender to approve a loan based on balance updates that are subsequently aborted. Durability ensures that once committed, changes survive power outages or crashes, typically guaranteed using Write-Ahead Logging (WAL) flushed to non-volatile disk.',
    hints: ['Think of a bank fund transfer between two accounts.']
  },
  {
    id: 'dbms-2',
    category: 'DBMS',
    role: 'Backend Developer',
    difficulty: 'Medium',
    question: 'Compare SQL Transaction Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Detail the concurrency phenomena each level prevents.',
    expectedKeywords: ['isolation levels', 'dirty read', 'non-repeatable read', 'phantom read', 'read committed', 'repeatable read', 'serializable', 'MVCC', 'two phase locking'],
    rubricCriteria: [
      'Defines the three standard anomalies: Dirty Read (reading uncommitted changes), Non-Repeatable Read (re-reading same row returns different values), Phantom Read (re-running range query returns newly inserted/deleted rows).',
      'Maps each isolation level to the anomalies it eliminates.',
      'Explains how modern databases achieve isolation: MVCC (Multi-Version Concurrency Control) vs strict Two-Phase Locking (2PL).'
    ],
    sampleIdealAnswer: 'SQL isolation levels trade throughput for data consistency against three anomalies: 1) Read Uncommitted allows Dirty Reads (reading uncommitted changes). 2) Read Committed (default in Postgres/Oracle) prevents Dirty Reads: transactions only read committed data, but permits Non-Repeatable Reads (row modified by another transaction midway) and Phantom Reads. 3) Repeatable Read (default in MySQL InnoDB) prevents Dirty Reads and Non-Repeatable Reads by snapshotting rows, but ANSI standard permits Phantom Reads (range query counts change due to other transactions inserting new matching rows; though InnoDB uses Next-Key locks to prevent phantoms). 4) Serializable eliminates all three anomalies by executing transactions such that the outcome is equivalent to serial execution, implemented via Strict 2-Phase Locking or Serializable Snapshot Isolation (SSI).',
    hints: ['What is the difference between a Non-Repeatable Read and a Phantom Read?']
  },
  {
    id: 'dbms-3',
    category: 'DBMS',
    role: 'Full Stack Developer',
    difficulty: 'Hard',
    question: 'Explain Write-Ahead Logging (WAL) and how database engines ensure Durability and crash recovery using the ARIES recovery algorithm (Analysis, Redo, Undo).',
    expectedKeywords: ['write ahead log', 'WAL', 'durability', 'ARIES', 'analysis phase', 'redo phase', 'undo phase', 'checkpointing', 'LSN', 'dirty page table'],
    rubricCriteria: [
      'Explains Write-Ahead Logging rule: log records describing modifications must be flushed to persistent storage before the corresponding dirty data pages are written to disk.',
      'Explains Log Sequence Numbers (LSN) linking pages to log entries.',
      'Details the 3 phases of ARIES: Analysis (scans forward from checkpoint to identify active transactions and dirty pages), Redo (repeats history to bring state up to crash moment), Undo (rolls back transactions that were active at crash time).'
    ],
    sampleIdealAnswer: 'Writing random database pages to disk on every commit is too slow. Write-Ahead Logging (WAL) optimizes this: log records describing state mutations are written sequentially and flushed to disk before any dirty in-memory data page is flushed. Each log record has a Log Sequence Number (LSN). During a system crash, the database executes the ARIES recovery algorithm: 1) Analysis Phase: Scans the log forward from the most recent checkpoint to reconstruct the Transaction Table (transactions active at crash time) and Dirty Page Table. 2) Redo Phase: Scans forward from the oldest unwritten page LSN, "repeating history" to re-apply all logged changes (even for uncommitted transactions) to restore the exact memory state at crash time. 3) Undo Phase: Scans backwards, reversing (undoing) the changes of all transactions that were left uncommitted/active when the crash happened, writing compensation log records (CLRs).',
    hints: ['Why is appending to a sequential log faster than writing random disk blocks?']
  },

  // --- COMPUTER NETWORKS ---
  {
    id: 'cn-1',
    category: 'Computer Networks',
    role: 'Software Engineer',
    difficulty: 'Easy',
    question: 'Explain the TCP 3-Way Handshake and 4-Way Teardown. Why does the client enter the TIME_WAIT state during teardown instead of closing immediately?',
    expectedKeywords: ['TCP handshake', 'SYN', 'SYN-ACK', 'ACK', 'FIN', 'sequence number', '4-way teardown', 'TIME_WAIT', '2MSL', 'delayed packets'],
    rubricCriteria: [
      'Details 3-Way Handshake: Client sends SYN, Server replies SYN-ACK, Client sends ACK with initial sequence numbers (ISN).',
      'Details 4-Way Teardown: Client sends FIN, Server sends ACK (half-closed), Server sends FIN, Client sends ACK.',
      'Explains TIME_WAIT (typically 2 * Maximum Segment Lifetime / 2MSL): ensures the final ACK reaches the server, and prevents old duplicate packets from interfering with a future connection on the same socket pair.'
    ],
    sampleIdealAnswer: 'To establish a reliable connection, TCP performs a 3-way handshake: 1) Client sends SYN with random Initial Sequence Number (ISN_c). 2) Server responds with SYN-ACK, acknowledging ISN_c + 1 and providing its own ISN_s. 3) Client sends ACK (ISN_s + 1), transitioning connection to ESTABLISHED. To terminate, a 4-way teardown occurs: Client sends FIN, Server sends ACK (connection half-closed; server can finish sending pending data). Once server finishes, Server sends FIN, and Client replies with final ACK. The client enters `TIME_WAIT` for 2MSL (Maximum Segment Lifetime, ~1-2 min) for two vital reasons: 1) If the final ACK is dropped, the server will retransmit FIN; the client must remain available to re-acknowledge. 2) It allows any lingering duplicate packets wandering the network to expire so they cannot corrupt new connections reusing the same IP/Port socket tuple.',
    hints: ['What would happen if the final ACK got lost and the client had already closed?']
  },
  {
    id: 'cn-2',
    category: 'Computer Networks',
    role: 'Full Stack Developer',
    difficulty: 'Medium',
    question: 'Compare HTTP/1.1, HTTP/2, and HTTP/3. How do multiplexing, binary framing, and QUIC over UDP solve Head-of-Line (HoL) blocking?',
    expectedKeywords: ['HTTP/1.1', 'HTTP/2', 'HTTP/3', 'QUIC', 'UDP', 'head-of-line blocking', 'multiplexing', 'binary framing', 'TCP', '0-RTT handshake'],
    rubricCriteria: [
      'Explains HTTP/1.1 limitations: pipelining head-of-line blocking, connection limits, textual headers.',
      'Explains HTTP/2: single TCP connection with binary framing and multiplexed streams, solving HTTP-level HoL blocking.',
      'Identifies HTTP/2 limitation: TCP-level HoL blocking (one dropped TCP packet stalls all streams).',
      'Explains HTTP/3: uses QUIC over UDP, providing independent stream packet loss recovery and fast 0-RTT handshakes.'
    ],
    sampleIdealAnswer: 'In HTTP/1.1, browsers opened multiple parallel TCP connections (typically 6 per domain), but suffered from application-level Head-of-Line (HoL) blocking: requests on a single connection had to be returned in sequential order. HTTP/2 introduced binary framing, header compression (HPACK), and multiplexing: multiple independent request/response streams interleave concurrently over a single TCP connection. However, HTTP/2 still suffers from transport-level TCP HoL blocking: because TCP enforces in-order byte streams, a single lost packet forces the OS buffer to hold back all streams until retransmission succeeds. HTTP/3 replaces TCP with QUIC over UDP. QUIC handles loss recovery per stream independently: a dropped packet on stream A never halts data delivery for stream B. QUIC also combines transport and TLS 1.3 handshakes into a single round-trip (or 0-RTT for resumed connections).',
    hints: ['At what layer does HoL blocking happen in HTTP/1.1 vs HTTP/2?']
  },
  {
    id: 'cn-3',
    category: 'Computer Networks',
    role: 'Backend Developer',
    difficulty: 'Hard',
    question: 'Explain what happens under the hood when a user types "https://api.example.com/v1/data" into a browser and hits enter, from DNS to TLS 1.3 handshake to HTTP response.',
    expectedKeywords: ['DNS resolution', 'recursive resolver', 'authoritative', 'TCP 3-way handshake', 'TLS 1.3', 'Diffie-Hellman', 'cipher suite', 'certificate authority', 'reverse proxy', 'HTTP GET'],
    rubricCriteria: [
      'Covers DNS lookup flow: browser cache -> OS cache -> recursive resolver -> Root DNS -> TLD DNS -> Authoritative nameserver.',
      'Covers TCP 3-way handshake with IP routing through default gateway/routers via ARP/BGP.',
      'Covers TLS 1.3 handshake: ClientHello (supported ciphers, DH key share), ServerHello (selected cipher, server DH share, certificate, signature), symmetric session key derivation.',
      'Covers HTTP request transmission, reverse proxy routing (NGINX/Cloudflare), server processing, and HTTP 200 response.'
    ],
    sampleIdealAnswer: '1) DNS Resolution: The browser checks local cache, then OS cache. If missing, it queries the recursive resolver, which hierarchically contacts Root DNS (`.`), TLD DNS (`.com`), and the domain\'s Authoritative DNS to resolve `api.example.com` to an IP. 2) TCP Connection: The client checks ARP tables for the next-hop router MAC address and sends a TCP SYN packet; router hops navigate via BGP/OSPF to complete the 3-Way Handshake (SYN, SYN-ACK, ACK). 3) TLS 1.3 Handshake: Client sends `ClientHello` with supported cipher suites and an ephemeral Diffie-Hellman (ECDH) key share. The server returns `ServerHello` with its own key share, digital certificate, and cryptographic signature. The client validates the certificate chain against trusted Root CAs. Both compute the shared symmetric session key (AES-GCM or ChaCha20) in 1-RTT. 4) HTTP Exchange: Client transmits encrypted HTTP GET request. The load balancer/reverse proxy terminates TLS, forwards the request to application services, and returns encrypted HTTP response frames.',
    hints: ['Mention how TLS 1.3 reduces handshake round-trips compared to TLS 1.2.']
  },

  // --- SYSTEM DESIGN ---
  {
    id: 'sd-1',
    category: 'System Design',
    role: 'Software Engineer',
    difficulty: 'Medium',
    question: 'Design a Distributed Rate Limiter. Compare Token Bucket vs Sliding Window Counter algorithms, and discuss how you maintain rate counts across a distributed server cluster using Redis.',
    expectedKeywords: ['rate limiter', 'token bucket', 'sliding window counter', 'leaky bucket', 'distributed rate limiter', 'Redis', 'Lua script', 'race condition', 'atomicity'],
    rubricCriteria: [
      'Explains Token Bucket: tokens added at constant rate up to bucket capacity, allows burst traffic.',
      'Explains Sliding Window Counter: blends previous window and current window weights to prevent boundary-burst attacks.',
      'Describes distributed implementation using Redis: storing keys with TTLs, using Redis sorted sets (ZSET) or Lua scripts for atomic increments to avoid race conditions.',
      'Addresses scale challenges: latency, edge rate limiting (Cloudflare/API Gateway), and fallback mechanisms if Redis is degraded.'
    ],
    sampleIdealAnswer: 'A distributed rate limiter protects APIs from abuse and denial-of-service. Two primary algorithms: 1) Token Bucket: A bucket has fixed capacity and refills with tokens at a steady rate. Requests consume a token; if empty, requests are rejected (HTTP 429). It naturally accommodates controlled traffic bursts. 2) Sliding Window Counter: Tracks requests across overlapping time frames, weighting previous and current window counts to smooth boundary spikes. In a distributed setup, multiple application nodes cannot rely on local memory. We centralize counts in Redis. Using separate `GET` and `SET` commands creates race conditions; we execute atomic Redis Lua scripts or use Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) within a transaction. At high scale, rate limiting is placed at the edge (API Gateway or CDN) with memory-caching fallbacks in case the central Redis tier becomes unavailable.',
    hints: ['Why can naive GET then SET in Redis cause concurrency race conditions?']
  },
  {
    id: 'sd-2',
    category: 'System Design',
    role: 'Backend Developer',
    difficulty: 'Hard',
    question: 'Design a scalable URL Shortener like Bitly handling 100M new URLs/month and a 10:1 read-to-write ratio. Detail Base62 encoding vs Key Generation Service (KGS), database schema, caching, and analytics tracking.',
    expectedKeywords: ['URL shortener', 'Base62 encoding', 'Key Generation Service', 'KGS', 'hash collision', 'read heavy', 'Redis cache', 'LRU', 'sharding', 'Kafka', 'HTTP 301 vs 302'],
    rubricCriteria: [
      'Calculates scale: 100M writes/month (~40 writes/sec, 400 reads/sec), 5-year storage estimates.',
      'Compares Base62 encoding of auto-increment IDs vs Key Generation Service (pre-generating unique short keys to eliminate collision and synchronization overhead).',
      'Explains Database choice: NoSQL key-value (DynamoDB/Cassandra) or Sharded RDBMS mapping `short_url` to `original_url`.',
      'Explains Caching (Redis LRU cache for top 20% URLs) and HTTP 301 (Permanent, cached by browser) vs HTTP 302 (Temporary, enables server-side analytics tracking).',
      'Outlines asynchronous click analytics using message brokers like Kafka.'
    ],
    sampleIdealAnswer: '1) Scale & Numbers: 100M writes/month ≈ 38 writes/sec; at 10:1, read traffic is ~380 reads/sec. A 7-character Base62 string (`[0-9a-zA-Z]`) provides 62^7 ≈ 3.5 trillion unique URLs, easily sufficient. 2) Key Generation: Direct hashing of long URLs requires collision resolution; auto-increment IDs in distributed SQL require centralized coordinator locks. The optimal approach is a Key Generation Service (KGS) that pre-generates 7-character strings in a separate table/service, loading batches into memory buffers so workers dispense keys in O(1) without race conditions. 3) Storage & Caching: A fast NoSQL key-value store (e.g., DynamoDB or Cassandra) stores `{short_key (PK), original_url, user_id, created_at, expires_at}`. Redis caches the top 20% hottest URLs (80/20 Pareto rule) with LRU eviction. 4) Redirection & Analytics: We return HTTP 302 Temporary Redirect so requests always hit our servers for click tracking. Click events are pushed to an asynchronous Apache Kafka topic for stream processing into ClickHouse, decoupling analytics from user redirect latency.',
    hints: ['Why might HTTP 301 prevent you from tracking click counts accurately?']
  },
  {
    id: 'sd-3',
    category: 'System Design',
    role: 'Software Engineer',
    difficulty: 'Hard',
    question: 'Explain the CAP Theorem and PACELC extension. If a distributed database chooses AP or CP during network partitions, what concrete trade-offs occur? Give examples of CP vs AP systems.',
    expectedKeywords: ['CAP theorem', 'consistency', 'availability', 'partition tolerance', 'PACELC', 'network partition', 'CP system', 'AP system', 'MongoDB', 'Cassandra', 'split brain', 'quorum'],
    rubricCriteria: [
      'Defines CAP: Consistency (all nodes see latest data simultaneously), Availability (every non-failing node returns a non-error response), Partition Tolerance (system continues functioning despite dropped/delayed network messages).',
      'Explains that network partitions are unavoidable in distributed systems; thus systems must choose between C and A during a partition.',
      'Explains PACELC: If Partition (P), choose between Availability (A) and Consistency (C); Else (E), choose between Latency (L) and Consistency (C).',
      'Categorizes real systems: CP (MongoDB single primary, etcd, Spanner) vs AP (Cassandra, DynamoDB with eventual consistency).'
    ],
    sampleIdealAnswer: 'The CAP theorem states that in a distributed data store, network partitions (P) are inevitable physical realities due to cable cuts, switch failures, or packet loss. Therefore, when a partition occurs, an architect must choose: 1) CP (Consistency over Availability): Nodes refuse writes or return errors if they cannot reach quorum, ensuring no stale data is read or split-brain occurs (e.g. etcd, ZooKeeper, MongoDB with majority write concern). 2) AP (Availability over Consistency): Nodes on either side of the partition accept reads and writes, but data may become temporarily inconsistent, relying on eventual consistency, conflict resolution (CRDTs), or vector clocks (e.g. Apache Cassandra, Couchbase). The PACELC theorem extends CAP by noting that even when there is NO partition (Else), there is an inherent trade-off between Latency (L) and Consistency (C): strong consistency requires inter-node synchronous replication rounds, increasing read/write latency.',
    hints: ['Can a distributed system running over a real network ever sacrifice Partition Tolerance?']
  },

  // --- AI / ML ---
  {
    id: 'aiml-1',
    category: 'AI/ML',
    role: 'AI/ML Engineer',
    difficulty: 'Easy',
    question: 'Explain Overfitting vs Underfitting in Machine Learning models. How do you diagnose them using train/validation loss curves, and what techniques mitigate each?',
    expectedKeywords: ['overfitting', 'underfitting', 'bias-variance tradeoff', 'high variance', 'high bias', 'loss curve', 'regularization', 'dropout', 'cross-validation', 'data augmentation'],
    rubricCriteria: [
      'Defines Underfitting: model fails to capture underlying patterns, showing high bias and high training + validation error.',
      'Defines Overfitting: model memorizes training noise rather than generalizing, showing low training error but high validation error (high variance).',
      'Describes loss curves: diverging validation loss while training loss keeps decreasing indicates overfitting.',
      'Prescribes solutions: For underfitting: increase model capacity/features, train longer, reduce regularization. For overfitting: L1/L2 regularization, Dropout, early stopping, data augmentation, gathering more data.'
    ],
    sampleIdealAnswer: 'Underfitting occurs when a model is too simplistic to capture the underlying structure of the data, exhibiting high bias. In training/validation loss curves, both errors remain unacceptably high and plateau early. Mitigate by increasing model capacity (more layers/parameters), engineering better features, reducing regularization, or training longer. Overfitting occurs when a model memorizes specific training data and noise rather than learning generalizable features, exhibiting high variance. In loss curves, training error continues declining while validation error bottoms out and begins climbing upwards (divergence). Mitigate by introducing regularization (L1 Lasso, L2 Ridge, Dropout), applying Early Stopping, using k-fold cross-validation, performing data augmentation, or collecting more training data.',
    hints: ['What does it mean when train loss is near zero but validation loss is soaring?']
  },
  {
    id: 'aiml-2',
    category: 'AI/ML',
    role: 'AI/ML Engineer',
    difficulty: 'Medium',
    question: 'Explain the Transformer self-attention mechanism. Define Query, Key, and Value matrices, and why dot-product attention scales by the square root of the key dimension (sqrt(d_k)).',
    expectedKeywords: ['transformer', 'self-attention', 'Query Key Value', 'scaled dot-product', 'softmax', 'd_k', 'vanishing gradient', 'multi-head attention', 'matrix multiplication'],
    rubricCriteria: [
      'Explains that self-attention computes relationships between all tokens in a sequence simultaneously.',
      'Defines Q (what the token is looking for), K (what the token contains/indexes), and V (the actual information content to aggregate).',
      'Provides formula: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.',
      'Explains scaling factor sqrt(d_k): for large dimensions, dot products grow large in magnitude, pushing softmax into regions with extremely small gradients (vanishing gradients); dividing by sqrt(d_k) stabilizes variance.'
    ],
    sampleIdealAnswer: 'The Transformer self-attention mechanism enables tokens to dynamically weigh information from all other tokens in a sequence in parallel. Input embeddings are projected through learned weight matrices into Query (Q), Key (K), and Value (V) tensors: Q represents the token\'s search criteria, K represents the token\'s identifier/features, and V represents the content payload. The attention weights are computed using Scaled Dot-Product Attention: `Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V`. The dot product `Q * K^T` measures pairwise token similarity. When the dimension `d_k` is large, the dot products grow proportionally large in magnitude; if fed directly into the `softmax` function, the outputs become extremely peaked (approaching 0 or 1), driving gradients to near zero (vanishing gradient problem). Dividing by `sqrt(d_k)` scales the variance back to 1, preserving healthy gradients during backpropagation.',
    hints: ['What happens to softmax gradients when inputs have very large magnitudes?']
  },
  {
    id: 'aiml-3',
    category: 'AI/ML',
    role: 'AI/ML Engineer',
    difficulty: 'Hard',
    question: 'Compare Retrieval-Augmented Generation (RAG) vs Model Fine-Tuning (LoRA / QLoRA). When should an organization choose RAG, when fine-tuning, and when a hybrid architecture?',
    expectedKeywords: ['RAG', 'retrieval augmented generation', 'fine-tuning', 'LoRA', 'QLoRA', 'vector database', 'embeddings', 'hallucination', 'domain adaptation', 'hybrid'],
    rubricCriteria: [
      'Defines RAG: retrieving external factual context from a vector database/document store and injecting into the LLM prompt at inference time.',
      'Defines LoRA/QLoRA: Parameter-Efficient Fine-Tuning updating low-rank decomposition matrices while freezing base weights.',
      'Compares use-cases: RAG is best for dynamic/frequently changing knowledge, citation auditability, and preventing hallucination on proprietary documents.',
      'Fine-Tuning is best for teaching new formats, specific tone/style, domain vocabularies, reasoning shortcuts, or reducing prompt token costs.',
      'Describes Hybrid: using LoRA for domain-adapted reasoning/syntax combined with RAG for dynamic real-time factual grounding.'
    ],
    sampleIdealAnswer: 'RAG and Fine-Tuning solve fundamentally different challenges: RAG is about providing external facts, while Fine-Tuning is about teaching behavior, style, or specific syntax. 1) RAG (Retrieval-Augmented Generation) embeds an organization\'s knowledge base into a vector database, retrieving relevant passages at inference time to inject into the LLM context window. Choose RAG when knowledge changes frequently (no retraining required), when verifiable source citations are mandatory, when strict access controls apply, or to prevent hallucinations on private company docs. 2) LoRA/QLoRA (Low-Rank Adaptation) freezes base model weights and trains small rank-decomposition matrices. Choose LoRA when teaching the model a specific output structure (e.g. rigid JSON or proprietary query language), adjusting tone/voice, fine-tuning classification capabilities, or pruning verbose instructions to lower latency and token costs. 3) A Hybrid approach is ideal for specialized enterprise agents: a fine-tuned model understands domain-specific jargon and reasoning steps, while RAG feeds it real-time customer data and latest catalog specs.',
    hints: ['Can fine-tuning provide source citations for its answers?']
  }
];

export function getFilteredQuestions(
  role: InterviewRole,
  difficulty: InterviewDifficulty,
  category: InterviewCategory,
  count: number = 3
): Question[] {
  // First attempt: exact match on category + difficulty
  const matched = QUESTION_BANK.filter(
    (q) => q.category === category && q.difficulty === difficulty
  );

  // If not enough, loosen difficulty constraint within same category
  if (matched.length < count) {
    const sameCategory = QUESTION_BANK.filter((q) => q.category === category);
    for (const q of sameCategory) {
      if (!matched.some((m) => m.id === q.id)) {
        matched.push(q);
      }
    }
  }

  // If still not enough, fallback to same role or general questions
  if (matched.length < count) {
    for (const q of QUESTION_BANK) {
      if (!matched.some((m) => m.id === q.id)) {
        matched.push(q);
      }
    }
  }

  // Shuffle and slice
  const shuffled = [...matched].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
