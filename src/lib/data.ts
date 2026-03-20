// Mock database for LMS
export type Role = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  instructorId: string;
  price: number;
  rating: number;
  studentsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  outcomes: string[];
  prerequisites: string[];
  modules: Module[];
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  duration: number; // minutes
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  enrolledAt: string;
  completedAt?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  total: number;
  answers: number[];
  attemptedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Sample data
const sampleUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@lms.com', password: 'password123', role: 'admin', avatar: '', createdAt: '2024-01-01' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@lms.com', password: 'password123', role: 'instructor', avatar: '', createdAt: '2024-01-05' },
  { id: '3', name: 'Mike Chen', email: 'mike@lms.com', password: 'password123', role: 'instructor', avatar: '', createdAt: '2024-01-10' },
  { id: '4', name: 'Emily Davis', email: 'emily@lms.com', password: 'password123', role: 'student', avatar: '', createdAt: '2024-02-01' },
  { id: '5', name: 'James Wilson', email: 'james@lms.com', password: 'password123', role: 'student', avatar: '', createdAt: '2024-02-15' },
  { id: '6', name: 'Lisa Park', email: 'lisa@lms.com', password: 'password123', role: 'student', avatar: '', createdAt: '2024-03-01' },
];

const sampleCourses: Course[] = [
  {
    id: 'c1', title: 'React Masterclass', description: 'Master React.js from fundamentals to advanced patterns like Hooks, Context, and Performance.', category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop', instructorId: '2', price: 49.99, rating: 4.8, studentsCount: 234, difficulty: 'Intermediate',
    outcomes: ['Build scalable React apps', 'Master Hooks and Context API', 'Optimize performance with useMemo'],
    prerequisites: ['Basic JavaScript', 'HTML & CSS'],
    createdAt: '2024-01-15',
    modules: [
      {
        id: 'm1', title: 'Getting Started', order: 1, lessons: [
          { id: 'l1', title: 'Introduction to React', type: 'video', content: 'https://www.youtube.com/embed/SqcY0GlETPk', duration: 15, order: 1 },
          { id: 'l2', title: 'Setting Up Your Environment', type: 'text', content: 'Install Node.js and use Vite for a faster development experience. Run: npm create vite@latest my-react-app -- --template react-ts', duration: 10, order: 2 },
          { id: 'l3', title: 'React Basics Quiz', type: 'quiz', content: 'quiz_c1_1', duration: 5, order: 3 },
        ]
      },
      {
        id: 'm2', title: 'Hooks Deep Dive', order: 2, lessons: [
          { id: 'l4', title: 'useState & useEffect', type: 'video', content: 'https://www.youtube.com/embed/53H_fYlikHc', duration: 25, order: 1 },
          { id: 'l5', title: 'Custom Hooks', type: 'video', content: 'https://www.youtube.com/embed/I2Bgi0Qcdvc', duration: 20, order: 2 },
          { id: 'l6', title: 'Hooks Quiz', type: 'quiz', content: 'quiz_c1_2', duration: 5, order: 3 },
        ]
      },
    ],
  },
  {
    id: 'c2', title: 'Python for Data Science', description: 'Master Python fundamentals and data science libraries like Pandas, NumPy, and Matplotlib.', category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop', instructorId: '3', price: 59.99, rating: 4.6, studentsCount: 189, difficulty: 'Beginner',
    outcomes: ['Write efficient Python code', 'Perform data analysis with Pandas', 'Visualize data with Matplotlib'],
    prerequisites: ['None'],
    createdAt: '2024-02-01',
    modules: [
      {
        id: 'm4', title: 'Python Fundamentals', order: 1, lessons: [
          { id: 'l9', title: 'Variables & Data Types', type: 'video', content: 'https://www.youtube.com/embed/LKFrQXaoSMQ', duration: 20, order: 1 },
          { id: 'l10', title: 'Control Flow', type: 'video', content: 'https://www.youtube.com/embed/Zp5MuPOtsSY', duration: 18, order: 2 },
          { id: 'l11', title: 'Python Basics Quiz', type: 'quiz', content: 'quiz_c2_1', duration: 5, order: 3 },
        ]
      },
      {
        id: 'm5', title: 'Data Analysis with Pandas', order: 2, lessons: [
          { id: 'l12', title: 'Introduction to Pandas', type: 'video', content: 'https://www.youtube.com/embed/vmEHCJofslg', duration: 30, order: 1 },
          { id: 'l13', title: 'Data Cleaning', type: 'video', content: 'https://www.youtube.com/embed/MDaMmWBI-S8', duration: 20, order: 2 },
        ]
      },
    ],
  },
  {
    id: 'c3', title: 'UI/UX Design Fundamentals', description: 'Learn design principles, Figma, prototyping, and user research methods.', category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop', instructorId: '2', price: 39.99, rating: 4.9, studentsCount: 312, difficulty: 'Beginner',
    outcomes: ['Create beautiful UI in Figma', 'Understand UX research principles', 'Build interactive prototypes'],
    prerequisites: ['None'],
    createdAt: '2024-02-15',
    modules: [
      {
        id: 'm6', title: 'Design Principles', order: 1, lessons: [
          { id: 'l14', title: 'UI vs UX Design', type: 'video', content: 'https://www.youtube.com/embed/zHAa-m16NGk', duration: 15, order: 1 },
          { id: 'l15', title: 'Typography and Color', type: 'video', content: 'https://www.youtube.com/embed/-jVC6oc6VP8', duration: 20, order: 2 },
          { id: 'l16', title: 'Design Quiz', type: 'quiz', content: 'quiz_c3_1', duration: 5, order: 3 },
        ]
      },
    ],
  },
  {
    id: 'c5', title: 'Full-Stack Web Development', description: 'Master the MERN stack: MongoDB, Express, React, and Node.js for modern web apps.', category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop', instructorId: '2', price: 79.99, rating: 4.9, studentsCount: 450, difficulty: 'Advanced',
    outcomes: ['Build full-stack applications', 'Deploy apps to the cloud', 'Master asynchronous JavaScript'],
    prerequisites: ['HTML, CSS, JS', 'React Basics'],
    createdAt: '2024-03-10',
    modules: [
      {
        id: 'm8', title: 'Backend with Node', order: 1, lessons: [
          { id: 'l19', title: 'Node.js Architecture', type: 'video', content: 'https://www.youtube.com/embed/TlB_eWDSMt4', duration: 30, order: 1 },
          { id: 'l20', title: 'Building REST APIs', type: 'video', content: 'https://www.youtube.com/embed/Oe421EPjeBE', duration: 45, order: 2 },
        ]
      },
    ],
  },
  {
    id: 'c8', title: 'Cloud Computing with AWS', description: 'Master AWS services including EC2, S3, and Lambda for scalable architecture.', category: 'Cloud Computing',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', instructorId: '3', price: 89.99, rating: 4.7, studentsCount: 340, difficulty: 'Intermediate',
    outcomes: ['Configure AWS instances', 'Set up cloud storage with S3', 'Understand serverless with Lambda'],
    prerequisites: ['Basic Networking', 'Linux Fundamentals'],
    createdAt: '2024-03-15',
    modules: [
      {
        id: 'm11', title: 'AWS Core Services', order: 1, lessons: [
          { id: 'l25', title: 'Intro to AWS', type: 'video', content: 'https://www.youtube.com/embed/O61gbmYZJmE', duration: 40, order: 1 },
          { id: 'l26', title: 'S3 Storage Deep Dive', type: 'video', content: 'https://www.youtube.com/embed/e6w9LwZJFIA', duration: 30, order: 2 },
        ]
      },
    ],
  },
  {
    id: 'c4', title: 'TypeScript Essentials', description: 'Type-safe JavaScript development with TypeScript. Generics, interfaces, and more.', category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop', instructorId: '3', price: 44.99, rating: 4.7, studentsCount: 156, difficulty: 'Intermediate',
    outcomes: ['Write type-safe JS', 'Master Interfaces and Generics', 'Integrate TS with React'],
    prerequisites: ['JavaScript basics'],
    createdAt: '2024-03-01',
    modules: [
      {
        id: 'm7', title: 'TypeScript Basics', order: 1, lessons: [
          { id: 'l17', title: 'Types & Interfaces', type: 'video', content: 'https://www.youtube.com/embed/zQnBQ4tB3ZA', duration: 22, order: 1 },
          { id: 'l18', title: 'Generics', type: 'video', content: 'https://www.youtube.com/embed/hVulW66JboQ', duration: 25, order: 2 },
        ]
      },
    ],
  },
  {
    id: 'c6', title: 'Cybersecurity for Beginners', description: 'Learn the fundamentals of network security, ethical hacking, and digital forensics.', category: 'Cybersecurity',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', instructorId: '3', price: 69.99, rating: 4.5, studentsCount: 210, difficulty: 'Beginner',
    outcomes: ['Understand network security', 'Prevent common attacks', 'Basics of ethical hacking'],
    prerequisites: ['Basic computer knowledge'],
    createdAt: '2024-03-12',
    modules: [
      {
        id: 'm9', title: 'Security Basics', order: 1, lessons: [
          { id: 'l21', title: 'Intro to Cybersecurity', type: 'video', content: 'https://www.youtube.com/embed/X-O1-l0gP5Q', duration: 25, order: 1 },
          { id: 'l22', title: 'Digital Safety', type: 'video', content: 'https://www.youtube.com/embed/88-FENio9Yw', duration: 20, order: 2 },
        ]
      },
    ],
  },
  {
    id: 'c7', title: 'Artificial Intelligence & ML', description: 'Deep dive into Machine Learning, Neural Networks, and AI ethics with Python.', category: 'AI/ML',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop', instructorId: '2', price: 99.99, rating: 4.8, studentsCount: 520, difficulty: 'Advanced',
    outcomes: ['Build ML models with Python', 'Understand Neural Networks', 'Implement AI algorithms'],
    prerequisites: ['Python basics', 'Basic Math'],
    createdAt: '2024-03-14',
    modules: [
      {
        id: 'm10', title: 'Machine Learning', order: 1, lessons: [
          { id: 'l23', title: 'Intro to ML', type: 'video', content: 'https://www.youtube.com/embed/D1eL1EnxXXQ', duration: 35, order: 1 },
          { id: 'l24', title: 'Neural Networks', type: 'video', content: 'https://www.youtube.com/embed/aircAruvnKk', duration: 40, order: 2 },
        ]
      },
    ],
  },
];

const sampleQuizzes: Quiz[] = [
  {
    id: 'quiz_c1_1', lessonId: 'l3', courseId: 'c1', title: 'React Basics Quiz', questions: [
      { id: 'q1', question: 'What is JSX?', options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'], correctAnswer: 1 },
      { id: 'q2', question: 'What hook manages state in functional components?', options: ['useEffect', 'useContext', 'useState', 'useReducer'], correctAnswer: 2 },
      { id: 'q3', question: 'What is the virtual DOM?', options: ['A real DOM copy', 'A lightweight JS representation of the DOM', 'A browser API', 'A React component'], correctAnswer: 1 },
    ]
  },
  {
    id: 'quiz_c1_2', lessonId: 'l6', courseId: 'c1', title: 'Hooks Quiz', questions: [
      { id: 'q4', question: 'When does useEffect run?', options: ['Before render', 'After render', 'During render', 'Never'], correctAnswer: 1 },
      { id: 'q5', question: 'What does useState return?', options: ['A value', 'A function', 'An array with value and setter', 'An object'], correctAnswer: 2 },
    ]
  },
  {
    id: 'quiz_c2_1', lessonId: 'l11', courseId: 'c2', title: 'Python Basics Quiz', questions: [
      { id: 'q6', question: 'Which is NOT a Python data type?', options: ['int', 'str', 'char', 'float'], correctAnswer: 2 },
      { id: 'q7', question: 'How do you create a list in Python?', options: ['{}', '[]', '()', '<>'], correctAnswer: 1 },
    ]
  },
  {
    id: 'quiz_c3_1', lessonId: 'l16', courseId: 'c3', title: 'Design Quiz', questions: [
      { id: 'q8', question: 'What is visual hierarchy?', options: ['A design tool', 'Arrangement that implies importance', 'A color scheme', 'A font style'], correctAnswer: 1 },
      { id: 'q9', question: 'Which color model is used on screens?', options: ['CMYK', 'RGB', 'Pantone', 'HSL only'], correctAnswer: 1 },
    ]
  },
];

export const sampleEnrollments: Enrollment[] = [
  { id: 'e1', userId: '4', courseId: 'c1', completedLessons: ['l1', 'l2'], enrolledAt: '2024-01-15' },
  { id: 'e2', userId: '4', courseId: 'c2', completedLessons: ['l9', 'l10', 'l11'], enrolledAt: '2024-02-10' },
  { id: 'e3', userId: '5', courseId: 'c3', completedLessons: ['l14', 'l15'], enrolledAt: '2024-03-05' },
  { id: 'e4', userId: '6', courseId: 'c4', completedLessons: ['l17', 'l18'], enrolledAt: '2024-03-20' },
];

const sampleComments: Comment[] = [];

const sampleQuizAttempts: QuizAttempt[] = [];

const sampleNotifications: Notification[] = [
  { id: 'n1', userId: '4', title: 'New Course Available', message: 'TypeScript Essentials is now live!', read: false, createdAt: '2024-03-01' },
  { id: 'n2', userId: '4', title: 'Quiz Result', message: 'You scored 3/3 on React Basics Quiz!', read: true, createdAt: '2024-02-12' },
  { id: 'n3', userId: '5', title: 'Course Completed!', message: 'Congratulations on completing React Masterclass!', read: false, createdAt: '2024-03-15' },
];

// Database class with localStorage persistence
const DB_VERSION = '1.9';

class Database {
  private getStore<T>(key: string, defaults: T[]): T[] {
    const version = localStorage.getItem('lms_version');
    if (version !== DB_VERSION) {
      localStorage.clear();
      localStorage.setItem('lms_version', DB_VERSION);
    }

    const stored = localStorage.getItem(`lms_${key}`);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(`lms_${key}`, JSON.stringify(defaults));
    return defaults;
  }

  private setStore<T>(key: string, data: T[]) {
    localStorage.setItem(`lms_${key}`, JSON.stringify(data));
  }

  get users() { return this.getStore('users', sampleUsers); }
  set users(v) { this.setStore('users', v); }

  get courses() { return this.getStore('courses', sampleCourses); }
  set courses(v) { this.setStore('courses', v); }

  get enrollments() { return this.getStore('enrollments', sampleEnrollments); }
  set enrollments(v) { this.setStore('enrollments', v); }

  get quizzes() { return this.getStore('quizzes', sampleQuizzes); }
  set quizzes(v) { this.setStore('quizzes', v); }

  get quizAttempts() { return this.getStore('quizAttempts', sampleQuizAttempts); }
  set quizAttempts(v) { this.setStore('quizAttempts', v); }

  get comments() { return this.getStore('comments', sampleComments); }
  set comments(v) { this.setStore('comments', v); }

  get notifications() { return this.getStore('notifications', sampleNotifications); }
  set notifications(v) { this.setStore('notifications', v); }
}

export const db = new Database();
