export const demoResources = {
  'Data Structures and Algorithms': {
    note: { title: 'Algorithm analysis · quick revision', content: 'Time complexity describes how an algorithm’s work grows as its input grows. Big O notation gives an upper bound: linear search is O(n), while binary search on sorted data is O(log n). A stack follows last in, first out (LIFO); a queue follows first in, first out (FIFO). A hash table offers average O(1) lookup when keys are distributed well, though collisions can make operations slower.\n\nWhen choosing a data structure, compare the operations your program needs most: lookup, insertion, deletion, and ordered traversal.' },
    book: { title: 'Foundations of data structures · sample chapter', content: 'A data structure is a way of organizing values so a program can use them efficiently. Arrays store elements in indexed positions and provide constant-time access by index. Linked lists connect nodes using references; inserting a node can be inexpensive when its position is known, but finding a position requires traversal.\n\nTrees represent hierarchical relationships. In a balanced binary search tree, values in the left subtree are smaller than the node and values in the right subtree are larger. A balanced tree supports search, insertion, and deletion in O(log n) time.\n\nGraphs model relationships between objects. Breadth-first search explores neighbors level by level and can find a shortest path in an unweighted graph. Depth-first search follows a path as far as possible before backtracking. Both visit vertices and edges in O(V + E) time with an adjacency-list representation.' },
  },
  'Database Systems': {
    note: { title: 'Relational databases · quick revision', content: 'A primary key uniquely identifies a row. A foreign key links a row to a key in another table and helps preserve referential integrity. First normal form stores atomic values; second normal form removes partial dependencies on part of a composite key; third normal form removes dependencies between non-key attributes.\n\nACID describes transaction properties: atomicity, consistency, isolation, and durability. A transaction either completes as a unit or is rolled back.' },
    book: { title: 'Database systems · sample chapter', content: 'The relational model represents data in tables. Each relation has attributes (columns) and tuples (rows). SQL is used to define schemas, query data, and update records. A SELECT query can combine tables with JOIN operations when their keys relate.\n\nNormalization reduces unnecessary duplication. A functional dependency X → Y means that a value of X determines a value of Y. Keys and dependencies help designers organize tables while preserving the information needed by applications.\n\nIndexes create an access structure that can make lookups faster, at the cost of storage and additional work when records change. Transactions group operations so concurrent users can work safely and failures do not leave data half-updated.' },
  },
  'Operating Systems': {
    note: { title: 'Processes and memory · quick revision', content: 'A process is a running program with its own address space and resources. A thread is an execution path within a process; threads share process memory. A context switch saves one execution state and restores another so the CPU can run a different process or thread.\n\nVirtual memory gives each process a protected address space. Paging divides virtual memory into fixed-size pages and physical memory into frames. A page fault occurs when a requested page is not currently in physical memory.' },
    book: { title: 'Operating systems · sample chapter', content: 'An operating system coordinates hardware resources and provides services to programs. The scheduler chooses which ready process or thread receives CPU time. First-come, first-served is simple but can make short tasks wait behind long tasks. Round robin gives each ready task a time slice, supporting responsiveness in interactive systems.\n\nA deadlock can occur when processes wait indefinitely for resources held by one another. The four necessary conditions are mutual exclusion, hold and wait, no preemption, and circular wait. Preventing at least one condition can prevent deadlock.\n\nMemory management maps process addresses to physical memory and enforces protection. Paging avoids external fragmentation by allocating fixed-size frames, although a page table is needed to translate addresses.' },
  },
  'Computer Networks': {
    note: { title: 'Network fundamentals · quick revision', content: 'The Internet Protocol (IP) provides addressing and routing between networks. TCP adds reliable, ordered delivery using acknowledgments and retransmission. UDP sends datagrams without the same delivery guarantees, which can be useful when low latency matters.\n\nDNS translates human-readable domain names into IP addresses. A router forwards packets between networks, while a switch connects devices within a local network.' },
    book: { title: 'Computer networks · sample chapter', content: 'Network protocols define how systems format and exchange messages. The layered approach separates responsibilities so each layer can use services provided below it. The Internet protocol suite includes application protocols such as HTTP and DNS, transport protocols such as TCP and UDP, and IP for network-layer delivery.\n\nTCP establishes a connection, numbers data, acknowledges received segments, and retransmits missing data. Congestion control adjusts sending behavior when the network is overloaded. UDP provides a smaller transport header and leaves reliability decisions to the application.\n\nIP routers use destination addresses and routing tables to forward packets. Because links have different maximum transmission units, packets may need to be sized or fragmented appropriately.' },
  },
  'Software Engineering': {
    note: { title: 'Requirements and testing · quick revision', content: 'Functional requirements describe what a system should do; non-functional requirements describe qualities such as performance, reliability, accessibility, or security. Clear requirements are specific, testable, and agreed with stakeholders.\n\nUnit tests check small components; integration tests check interactions between components; system tests evaluate the complete application. Automated tests provide fast feedback, but they do not replace thoughtful test design.' },
    book: { title: 'Software engineering · sample chapter', content: 'Software engineering applies disciplined methods to building and maintaining software. A development lifecycle may include requirements, design, implementation, testing, deployment, and maintenance. Iterative approaches deliver small increments and use feedback to refine the product.\n\nA useful architecture separates responsibilities into components with clear interfaces. This makes changes easier to reason about and allows teams to work on parts independently. Version control records changes and supports collaboration.\n\nVerification asks whether the product was built according to its specification; validation asks whether it meets the user’s needs. Reviews, static analysis, and tests contribute evidence, but each finds different kinds of issues.' },
  },
  Cybersecurity: {
    note: { title: 'Security basics · quick revision', content: 'The CIA triad describes confidentiality, integrity, and availability. Authentication establishes who a user is; authorization decides what that user may do. Least privilege gives each account only the access needed for its task.\n\nHash functions produce fixed-length digests and are useful for integrity checks and password storage when combined with a purpose-built password hashing algorithm and salt. Encryption uses keys to protect information from unauthorized reading.' },
    book: { title: 'Cybersecurity · sample chapter', content: 'Security controls reduce risk to systems and information. Threat modeling identifies valuable assets, possible attackers, attack paths, and mitigations. Defense in depth uses multiple controls so a single failure does not expose everything.\n\nSymmetric encryption uses the same secret key to encrypt and decrypt. Public-key cryptography uses a related public/private key pair. A digital signature can provide evidence of origin and integrity when verified with the signer’s public key.\n\nSecure systems validate inputs, protect secrets, update dependencies, log important events, and restrict access. Security is a lifecycle concern: design, implementation, deployment, and operations all matter.' },
  },
}

const sampleExamSets = {
  'Data Structures and Algorithms': [
    { year: '2015', questions: [
      { prompt: 'What is the time complexity of binary search on a sorted array?', choices: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1, explanation: 'Binary search halves the remaining search interval after each comparison. Repeated halving takes logarithmic time, so the complexity is O(log n).' },
      { prompt: 'Which structure follows last in, first out?', choices: ['Queue', 'Graph', 'Stack', 'Heap'], answer: 2, explanation: 'A stack removes the most recently added item first. This behavior is called last in, first out (LIFO).' },
      { prompt: 'Which traversal explores a graph level by level?', choices: ['Depth-first search', 'Breadth-first search', 'In-order traversal', 'Quick sort'], answer: 1, explanation: 'Breadth-first search visits all immediate neighbors before moving to the next level. It commonly uses a queue.' },
      { prompt: 'What is the average lookup complexity of a well-distributed hash table?', choices: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'], answer: 2, explanation: 'A hash function maps a key to a bucket, giving average constant-time lookup when collisions are controlled.' },
    ] },
    { year: '2014', questions: [
      { prompt: 'Which data structure is best suited to FIFO processing?', choices: ['Stack', 'Queue', 'Binary search tree', 'Hash set'], answer: 1, explanation: 'A queue removes items in the same order they arrive: first in, first out (FIFO).' },
      { prompt: 'What does O(n) describe?', choices: ['Constant work', 'Work growing linearly with input size', 'Work growing logarithmically', 'No upper bound'], answer: 1, explanation: 'Linear complexity means the amount of work grows proportionally to the input size n.' },
      { prompt: 'In a binary search tree, where are smaller values typically stored?', choices: ['Right subtree', 'Left subtree', 'At every leaf', 'In a queue'], answer: 1, explanation: 'The binary search tree property places values smaller than a node in its left subtree and larger values in its right subtree.' },
    ] },
  ],
  'Database Systems': [
    { year: '2015', questions: [
      { prompt: 'What does a primary key do?', choices: ['Encrypts the table', 'Uniquely identifies each row', 'Sorts every query', 'Connects to the Internet'], answer: 1, explanation: 'A primary key uniquely identifies a row in a table and cannot be duplicated.' },
      { prompt: 'Which ACID property means a transaction completes fully or is rolled back?', choices: ['Consistency', 'Isolation', 'Atomicity', 'Durability'], answer: 2, explanation: 'Atomicity treats all operations in a transaction as one unit: they all succeed, or none of them do.' },
      { prompt: 'What is the main purpose of a foreign key?', choices: ['Compress a column', 'Link related rows and preserve referential integrity', 'Guarantee query speed', 'Hide duplicate values'], answer: 1, explanation: 'A foreign key references a key in another table, helping ensure that relationships point to valid rows.' },
    ] },
  ],
  'Operating Systems': [
    { year: '2015', questions: [
      { prompt: 'What is a context switch?', choices: ['Changing a file name', 'Saving one execution state and restoring another', 'Allocating a disk partition', 'Compiling a process'], answer: 1, explanation: 'The operating system saves the current task state and restores another so the CPU can switch which task runs.' },
      { prompt: 'Which is one of the four necessary conditions for deadlock?', choices: ['Circular wait', 'Page replacement', 'Time slicing', 'Load balancing'], answer: 0, explanation: 'Deadlock requires mutual exclusion, hold and wait, no preemption, and circular wait.' },
      { prompt: 'What is a page fault?', choices: ['A syntax error', 'A requested page is not currently in physical memory', 'A network packet is lost', 'A process exits normally'], answer: 1, explanation: 'A page fault occurs when a process accesses a virtual memory page that must be brought into physical memory.' },
    ] },
  ],
  'Computer Networks': [
    { year: '2015', questions: [
      { prompt: 'Which transport protocol provides reliable, ordered delivery?', choices: ['UDP', 'IP', 'TCP', 'DNS'], answer: 2, explanation: 'TCP numbers data, acknowledges received segments, and retransmits missing data to provide reliable, ordered delivery.' },
      { prompt: 'What does DNS primarily do?', choices: ['Translate domain names to IP addresses', 'Encrypt web pages', 'Assign CPU time', 'Store database rows'], answer: 0, explanation: 'The Domain Name System resolves human-readable domain names to IP addresses used for network communication.' },
      { prompt: 'What does a router do?', choices: ['Forward packets between networks', 'Compile source code', 'Store browser cookies', 'Run SQL queries'], answer: 0, explanation: 'Routers use destination addresses and routing information to forward packets between networks.' },
    ] },
  ],
  'Software Engineering': [
    { year: '2015', questions: [
      { prompt: 'Which is a non-functional requirement?', choices: ['A user can reset a password', 'The system responds within two seconds', 'An admin can add a course', 'A student can sign out'], answer: 1, explanation: 'Performance is a quality attribute, so a response-time target is a non-functional requirement.' },
      { prompt: 'What does a unit test usually check?', choices: ['A small component in isolation', 'The entire production environment', 'The university calendar', 'A network router'], answer: 0, explanation: 'Unit tests focus on small functions or components, while integration and system tests cover broader interactions.' },
      { prompt: 'What is the purpose of version control?', choices: ['Track and coordinate changes to files', 'Replace all testing', 'Increase CPU speed', 'Encrypt every database field'], answer: 0, explanation: 'Version control records changes over time and supports collaboration, review, and recovery.' },
    ] },
  ],
  Cybersecurity: [
    { year: '2015', questions: [
      { prompt: 'Which set makes up the CIA security triad?', choices: ['Control, Internet, Access', 'Confidentiality, Integrity, Availability', 'Cipher, Identity, Authentication', 'Code, Inspection, Authorization'], answer: 1, explanation: 'The CIA triad groups three security goals: confidentiality, integrity, and availability.' },
      { prompt: 'What does least privilege mean?', choices: ['Give each account only the access it needs', 'Share one admin password', 'Disable all logging', 'Use the shortest password possible'], answer: 0, explanation: 'Least privilege limits access to the minimum required for a role or task, reducing the impact of misuse.' },
      { prompt: 'What is authentication?', choices: ['Determining what a user may access', 'Establishing who a user is', 'Deleting duplicate records', 'Backing up a server'], answer: 1, explanation: 'Authentication verifies identity; authorization determines which actions that identity is permitted to perform.' },
    ] },
  ],
}

export const demoExamYears = ['2015', '2014']

export const demoExams = Object.fromEntries(Object.entries(sampleExamSets).map(([course, examSets]) => {
  const recentExam = examSets.find((exam) => exam.year === '2015') || examSets[0]
  const earlierExam = examSets.find((exam) => exam.year === '2014') || recentExam
  return [course, [
    { ...recentExam, year: '2015' },
    { ...earlierExam, year: '2014' },
  ]]
}))
