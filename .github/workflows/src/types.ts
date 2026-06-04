/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  qualification: string;
  experience: string;
  courses: string[];
  bio: string;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  date: string;
  surah: string;
  startAyat: number;
  endAyat: number;
  rating: number; // 1-5 stars
  masteryNotes: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  fatherName?: string;
  email: string;
  parentEmail: string;
  whatsapp: string;
  age: number;
  courseId: string;
  timezone: string;
  status: 'active' | 'applied';
  daysOfWeek: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  timeSlot: string; // e.g., "16:00 - 16:45"
  attendance: AttendanceRecord[];
  progress: LessonProgress[];
}

export interface Course {
  id: string;
  title: string;
  level: string;
  description: string;
  duration: string;
  syllabus: string[];
  image: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  youtubeUrl?: string; // Embedded iframe source url helper
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'normal';
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  month: string; // e.g., "June 2026"
  amount: number;
  status: 'paid' | 'unpaid';
  dueDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BookResource {
  id: string;
  title: string;
  author: string;
  category: string; // "quran" | "qaida" | "mufti_books" | "other"
  description: string;
  url: string;
  uploadedAt: string;
  fileSize?: string;
}

export interface AcademyState {
  teachers: Teacher[];
  students: Student[];
  announcements: Announcement[];
  invoices: FeeInvoice[];
  books?: BookResource[];
}
