import { db } from './data';

export interface UserPoints {
  userId: string;
  totalXp: number;
  streak: number;
  lastActiveDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpThreshold?: number;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'lesson_completed' | 'quiz_passed' | 'course_completed' | 'login';
  detail: string;
  xpEarned: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  courseId: string;
  dailyLessons: number;
  startDate: string;
  estimatedEnd: string;
  schedule: StudyDay[];
}

export interface StudyDay {
  date: string;
  lessonIds: string[];
  completed: boolean;
}

const XP_RULES = {
  lesson_completed: 10,
  quiz_passed: 25,
  course_completed: 100,
};

const defaultBadges: Badge[] = [
  { id: 'b1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', requirement: 'Complete 1 lesson' },
  { id: 'b2', name: 'Quick Learner', description: 'Complete 5 lessons', icon: '⚡', requirement: 'Complete 5 lessons' },
  { id: 'b3', name: 'Quiz Master', description: 'Pass 3 quizzes', icon: '🧠', requirement: 'Pass 3 quizzes' },
  { id: 'b4', name: 'Dedicated', description: 'Maintain a 3-day streak', icon: '🔥', requirement: '3-day streak' },
  { id: 'b5', name: 'Scholar', description: 'Earn 100 XP', icon: '📚', requirement: '100 XP', xpThreshold: 100 },
  { id: 'b6', name: 'Champion', description: 'Earn 500 XP', icon: '🏆', requirement: '500 XP', xpThreshold: 500 },
  { id: 'b7', name: 'Graduate', description: 'Complete a course', icon: '🎓', requirement: 'Complete 1 course' },
  { id: 'b8', name: 'Streak King', description: '7-day learning streak', icon: '👑', requirement: '7-day streak' },
];

function getStore<T>(key: string, defaults: T[]): T[] {
  const stored = localStorage.getItem(`lms_${key}`);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(`lms_${key}`, JSON.stringify(defaults));
  return defaults;
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(`lms_${key}`, JSON.stringify(data));
}

// Generate sample activity logs for heatmap data
function generateSampleActivityLogs(): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const userIds = ['4', '5', '6'];
  const today = new Date();
  let id = 1;

  for (const userId of userIds) {
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activityChance = Math.random();
      if (activityChance > 0.4) {
        const count = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < count; j++) {
          logs.push({
            id: `al${id++}`,
            userId,
            type: 'lesson_completed',
            detail: `Completed a lesson`,
            xpEarned: 10,
            date: dateStr,
          });
        }
      }
    }
  }
  return logs;
}

function generateSamplePoints(): UserPoints[] {
  return [
    { userId: '4', totalXp: 165, streak: 4, lastActiveDate: new Date().toISOString().split('T')[0] },
    { userId: '5', totalXp: 380, streak: 7, lastActiveDate: new Date().toISOString().split('T')[0] },
    { userId: '6', totalXp: 210, streak: 2, lastActiveDate: new Date().toISOString().split('T')[0] },
  ];
}

function generateSampleUserBadges(): UserBadge[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    { userId: '4', badgeId: 'b1', earnedAt: '2024-02-10' },
    { userId: '4', badgeId: 'b2', earnedAt: '2024-02-15' },
    { userId: '4', badgeId: 'b5', earnedAt: '2024-02-20' },
    { userId: '5', badgeId: 'b1', earnedAt: '2024-02-20' },
    { userId: '5', badgeId: 'b2', earnedAt: '2024-02-25' },
    { userId: '5', badgeId: 'b3', earnedAt: '2024-03-01' },
    { userId: '5', badgeId: 'b5', earnedAt: '2024-03-05' },
    { userId: '5', badgeId: 'b7', earnedAt: '2024-03-15' },
    { userId: '5', badgeId: 'b4', earnedAt: today },
    { userId: '5', badgeId: 'b8', earnedAt: today },
    { userId: '6', badgeId: 'b1', earnedAt: '2024-03-05' },
    { userId: '6', badgeId: 'b5', earnedAt: '2024-03-20' },
    { userId: '6', badgeId: 'b7', earnedAt: '2024-03-25' },
  ];
}

function generateSampleChat(): ChatMessage[] {
  return [
    { id: 'ch1', courseId: 'c1', userId: '4', userName: 'Emily Davis', content: 'Hey everyone! How are you finding the React hooks section?', timestamp: '2024-03-10T10:30:00' },
    { id: 'ch2', courseId: 'c1', userId: '5', userName: 'James Wilson', content: 'It\'s great! The custom hooks part really clicked for me.', timestamp: '2024-03-10T10:35:00' },
    { id: 'ch3', courseId: 'c1', userId: '4', userName: 'Emily Davis', content: 'I\'m still struggling with useEffect cleanup. Any tips?', timestamp: '2024-03-10T10:40:00' },
    { id: 'ch4', courseId: 'c2', userId: '5', userName: 'James Wilson', content: 'The Pandas section is really well structured!', timestamp: '2024-03-11T14:00:00' },
    { id: 'ch5', courseId: 'c2', userId: '6', userName: 'Lisa Park', content: 'Agreed! I love the practical examples.', timestamp: '2024-03-11T14:15:00' },
  ];
}

export const gamificationDb = {
  get badges() { return getStore('badges', defaultBadges); },
  set badges(v) { setStore('badges', v); },

  get userPoints() { return getStore('userPoints', generateSamplePoints()); },
  set userPoints(v) { setStore('userPoints', v); },

  get userBadges() { return getStore('userBadges', generateSampleUserBadges()); },
  set userBadges(v) { setStore('userBadges', v); },

  get activityLogs() { return getStore('activityLogs', generateSampleActivityLogs()); },
  set activityLogs(v) { setStore('activityLogs', v); },

  get chatMessages() { return getStore('chatMessages', generateSampleChat()); },
  set chatMessages(v) { setStore('chatMessages', v); },

  get studyPlans() { return getStore<StudyPlan>('studyPlans', []); },
  set studyPlans(v) { setStore('studyPlans', v); },
};

export function awardXp(userId: string, type: keyof typeof XP_RULES, detail: string) {
  const xp = XP_RULES[type];
  const points = gamificationDb.userPoints;
  const today = new Date().toISOString().split('T')[0];

  let userPt = points.find(p => p.userId === userId);
  if (!userPt) {
    userPt = { userId, totalXp: 0, streak: 0, lastActiveDate: '' };
    points.push(userPt);
  }

  userPt.totalXp += xp;

  // streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (userPt.lastActiveDate === yesterdayStr) {
    userPt.streak += 1;
  } else if (userPt.lastActiveDate !== today) {
    userPt.streak = 1;
  }
  userPt.lastActiveDate = today;

  gamificationDb.userPoints = points;

  // log activity
  const logs = gamificationDb.activityLogs;
  logs.push({ id: crypto.randomUUID(), userId, type, detail, xpEarned: xp, date: today });
  gamificationDb.activityLogs = logs;

  // check badges
  checkAndAwardBadges(userId);

  return xp;
}

function checkAndAwardBadges(userId: string) {
  const userPt = gamificationDb.userPoints.find(p => p.userId === userId);
  if (!userPt) return;

  const logs = gamificationDb.activityLogs.filter(l => l.userId === userId);
  const userBadges = gamificationDb.userBadges;
  const earned = new Set(userBadges.filter(b => b.userId === userId).map(b => b.badgeId));
  const today = new Date().toISOString().split('T')[0];
  const newBadges: UserBadge[] = [];

  const lessonCount = logs.filter(l => l.type === 'lesson_completed').length;
  const quizCount = logs.filter(l => l.type === 'quiz_passed').length;
  const courseCount = logs.filter(l => l.type === 'course_completed').length;

  if (lessonCount >= 1 && !earned.has('b1')) newBadges.push({ userId, badgeId: 'b1', earnedAt: today });
  if (lessonCount >= 5 && !earned.has('b2')) newBadges.push({ userId, badgeId: 'b2', earnedAt: today });
  if (quizCount >= 3 && !earned.has('b3')) newBadges.push({ userId, badgeId: 'b3', earnedAt: today });
  if (userPt.streak >= 3 && !earned.has('b4')) newBadges.push({ userId, badgeId: 'b4', earnedAt: today });
  if (userPt.totalXp >= 100 && !earned.has('b5')) newBadges.push({ userId, badgeId: 'b5', earnedAt: today });
  if (userPt.totalXp >= 500 && !earned.has('b6')) newBadges.push({ userId, badgeId: 'b6', earnedAt: today });
  if (courseCount >= 1 && !earned.has('b7')) newBadges.push({ userId, badgeId: 'b7', earnedAt: today });
  if (userPt.streak >= 7 && !earned.has('b8')) newBadges.push({ userId, badgeId: 'b8', earnedAt: today });

  if (newBadges.length > 0) {
    gamificationDb.userBadges = [...userBadges, ...newBadges];
  }
}

export function getRecommendations(userId: string) {
  const enrollments = db.enrollments.filter(e => e.userId === userId);
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
  const enrolledCourses = enrollments.map(e => db.courses.find(c => c.id === e.courseId)).filter(Boolean);

  // Get categories user is interested in
  const categoryScores: Record<string, number> = {};
  for (const course of enrolledCourses) {
    if (!course) continue;
    const enrollment = enrollments.find(e => e.courseId === course.id);
    const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
    const progress = enrollment ? enrollment.completedLessons.length / Math.max(totalLessons, 1) : 0;
    categoryScores[course.category] = (categoryScores[course.category] || 0) + progress + 1;
  }

  // Score and rank unenrolled courses
  const unenrolled = db.courses.filter(c => !enrolledCourseIds.has(c.id));
  const scored = unenrolled.map(course => {
    let score = 0;
    score += (categoryScores[course.category] || 0) * 3;
    score += course.rating * 2;
    score += Math.log(course.studentsCount + 1);
    return { course, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.course);
}

export function generateStudyPlan(userId: string, courseId: string, dailyLessons: number = 2): StudyPlan {
  const course = db.courses.find(c => c.id === courseId);
  if (!course) throw new Error('Course not found');

  const enrollment = db.enrollments.find(e => e.userId === userId && e.courseId === courseId);
  const completedSet = new Set(enrollment?.completedLessons || []);

  const remainingLessons = course.modules
    .flatMap(m => m.lessons)
    .filter(l => !completedSet.has(l.id));

  const schedule: StudyDay[] = [];
  const today = new Date();
  let dayOffset = 0;

  for (let i = 0; i < remainingLessons.length; i += dailyLessons) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    // Skip weekends optionally
    schedule.push({
      date: date.toISOString().split('T')[0],
      lessonIds: remainingLessons.slice(i, i + dailyLessons).map(l => l.id),
      completed: false,
    });
    dayOffset++;
  }

  const estimatedEnd = schedule.length > 0 ? schedule[schedule.length - 1].date : today.toISOString().split('T')[0];

  const plan: StudyPlan = {
    id: crypto.randomUUID(),
    userId,
    courseId,
    dailyLessons,
    startDate: today.toISOString().split('T')[0],
    estimatedEnd,
    schedule,
  };

  // Save
  const plans = gamificationDb.studyPlans.filter(p => !(p.userId === userId && p.courseId === courseId));
  plans.push(plan);
  gamificationDb.studyPlans = plans;

  return plan;
}
