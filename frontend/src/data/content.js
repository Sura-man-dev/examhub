import {
  BookOpenCheck,
  Database,
  LibraryBig,
  Network,
  ShieldCheck,
  Timer,
  Workflow,
} from 'lucide-react'

export const features = [
  {
    key: 'exams',
    title: 'Timed practice exams',
    description: 'Build confidence before the real exam with focused, timed practice.',
    linkLabel: 'Explore exam mode',
    href: '#workspace',
    tone: 'feature-blue',
    icon: Timer,
  },
  {
    key: 'questions',
    title: 'Exercises & question bank',
    description: 'Find relevant exercises without searching through scattered files.',
    linkLabel: 'Find a question',
    href: '#courses',
    tone: 'feature-purple',
    icon: BookOpenCheck,
  },
  {
    key: 'library',
    title: 'Notes & digital library',
    description: 'Keep lecture notes and study materials organized and easy to find.',
    linkLabel: 'Browse materials',
    href: '#workspace',
    tone: 'feature-orange',
    icon: LibraryBig,
  },
]

export const courses = [
  {
    title: 'Data Structures and Algorithms',
    category: 'COMPUTER SCIENCE',
    description: 'Explore algorithms, complexity, and core data structures.',
    icon: Workflow,
    tone: 'course-blue',
  },
  {
    title: 'Database Systems',
    category: 'COMPUTER SCIENCE',
    description: 'Learn relational models, SQL, and database design.',
    icon: Database,
    tone: 'course-orange',
  },
  {
    title: 'Operating Systems',
    category: 'COMPUTER SCIENCE',
    description: 'Understand processes, memory, and system fundamentals.',
    icon: Network,
    tone: 'course-purple',
  },
  {
    title: 'Computer Networks',
    category: 'COMPUTER SCIENCE',
    description: 'Study protocols, network layers, and communication.',
    icon: Network,
    tone: 'course-green',
  },
  {
    title: 'Software Engineering',
    category: 'COMPUTER SCIENCE',
    description: 'Practice the principles behind building reliable software.',
    icon: Workflow,
    tone: 'course-pink',
  },
  {
    title: 'Cybersecurity',
    category: 'COMPUTER SCIENCE',
    description: 'Get to grips with security, threat models, and defense.',
    icon: ShieldCheck,
    tone: 'course-blue',
  },
]
