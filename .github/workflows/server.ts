/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize express app
const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "academy_db.json");

// Define basic interface states of the DB
interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  qualification: string;
  experience: string;
  courses: string[];
  bio: string;
}

interface LessonProgress {
  id: string;
  studentId: string;
  date: string;
  surah: string;
  startAyat: number;
  endAyat: number;
  rating: number;
  masteryNotes: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  notes?: string;
}

interface Student {
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
  daysOfWeek: string[];
  timeSlot: string;
  attendance: AttendanceRecord[];
  progress: LessonProgress[];
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'normal';
}

interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  amount: number;
  status: 'paid' | 'unpaid';
  dueDate: string;
}

interface BookResource {
  id: string;
  title: string;
  author: string;
  category: string; // "quran" | "qaida" | "mufti_books" | "other"
  description: string;
  url: string;
  uploadedAt: string;
  fileSize?: string;
}

interface DBStructure {
  teachers: Teacher[];
  students: Student[];
  announcements: Announcement[];
  invoices: FeeInvoice[];
  books?: BookResource[];
}

// Initial Mock / Seed Data
const initialDB: DBStructure = {
  teachers: [
    {
      id: "t_hashir",
      name: "Mufti Zahid Ali",
      email: "mhashir.quran@gmail.com",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150",
      qualification: "M.Phil & Ph.D (Islamic Studies), Takhassus (Ashraf-ul-Madaris), Alim Eight-Year Course (Darul Uloom Karachi under Mufti Taqi Usmani)",
      experience: "Chairman of Global Organization, 10+ Years of advanced Islamic teaching, certified in Tajweed & Noorani Qaida courses",
      courses: ["tajweed", "hifz", "studies"],
      bio: "Mufti Zahid Ali is an eminent scholar who completed his 8-year Alim course from Jamia Darul Uloom Karachi under Mufti Muhammad Taqi Usmani. He holds a Takhassus fil Ifta (Islamic Jurisprudence specialization) from Jamia Ashraf-ul-Madaris Karachi, an M.Phil in Islamic Studies from AWKUM, and is pursuing his Ph.D, alongside certified expertise in Tajweed, Noorani Qaida, Islamic Finance, and Tafseer."
    },
    {
      id: "t_rahman",
      name: "Sheikh Abdul Rahman",
      email: "rahman.alazhar@gmail.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      qualification: "Shahadah of Ten Qira'at, Certified Tajweed Teacher & Scholar",
      experience: "6 Years of Teaching Arabic & Quran Memorization to kids/adults",
      courses: ["noorani", "tajweed", "hifz"],
      bio: "Expert tutor specializing in Hifz (Memorization) programs, using cognitive maps and personalized revision cycles for rapid learning."
    },
    {
      id: "t_fatima",
      name: "Hafiza Fatima Sajid",
      email: "fatima.hifz@gmail.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      qualification: "Wafaq-ul-Madaris Hifz Certification, Islamic Studies Graduate",
      experience: "5 Years teaching female students & girls globally",
      courses: ["noorani", "tajweed", "studies"],
      bio: "Dedicated female tutor known for her motivating teaching method. Highly loved by young children starting their Noorani Qaida journey."
    }
  ],
  students: [
    {
      id: "s_tariq",
      name: "Tariq Mahmood",
      email: "tariq.student@example.com",
      parentEmail: "mhashironline@gmail.com", // Linked to user's test email for quick demo accessibility
      whatsapp: "+44 7911 123456",
      age: 10,
      courseId: "tajweed",
      timezone: "GMT+1 (London)",
      status: "active",
      daysOfWeek: ["Monday", "Wednesday", "Friday"],
      timeSlot: "16:00 - 16:45",
      attendance: [
        { id: "a1", studentId: "s_tariq", date: "2026-05-25", status: "present", notes: "Excited and on time" },
        { id: "a2", studentId: "s_tariq", date: "2026-05-27", status: "present" },
        { id: "a3", studentId: "s_tariq", date: "2026-05-29", status: "present", notes: "Excellent practice" },
        { id: "a4", studentId: "s_tariq", date: "2026-06-01", status: "present", notes: "Prepared lesson well" }
      ],
      progress: [
        {
          id: "p1",
          studentId: "s_tariq",
          date: "2026-06-01",
          surah: "Surah Al-Fatiha",
          startAyat: 1,
          endAyat: 7,
          rating: 5,
          masteryNotes: "Perfect recitation with exquisite attention to heavy and conversational throat letters. Beautiful Lahja/tone starting to build!"
        },
        {
          id: "p2",
          studentId: "s_tariq",
          date: "2026-05-29",
          surah: "Surah Al-Baqarah",
          startAyat: 1,
          endAyat: 5,
          rating: 4,
          masteryNotes: "Good memorization progress. Help Tariq practice the Madd Al-Munfasil duration (4 counts) more often at home."
        }
      ]
    },
    {
      id: "s_sarah",
      name: "Sarah Khan",
      email: "sarah.student@example.com",
      parentEmail: "khan.family@example.com",
      whatsapp: "+1 212 555 7890",
      age: 7,
      courseId: "noorani",
      timezone: "EST (New York)",
      status: "active",
      daysOfWeek: ["Tuesday", "Thursday"],
      timeSlot: "17:00 - 17:30",
      attendance: [
        { id: "a5", studentId: "s_sarah", date: "2026-05-26", status: "present" },
        { id: "a6", studentId: "s_sarah", date: "2026-05-28", status: "present", notes: "Quick learning today" }
      ],
      progress: [
        {
          id: "p3",
          studentId: "s_sarah",
          date: "2026-05-28",
          surah: "Noorani Qaida Lesson 4",
          startAyat: 1,
          endAyat: 15,
          rating: 5,
          masteryNotes: "Makhraj of letters Saad, Daad, Toa, and Zoa is excellent. Sarah is extremely focused and loves counting the colored star stickers!"
        }
      ]
    }
  ],
  announcements: [
    {
      id: "ann_1",
      title: "Eid-ul-Adha Holidays 1447H",
      content: "Assalamu Alaikum. The Academy will remain closed from Sunday, June 14, 2026, to Wednesday, June 17, 2026, on the sacred occasion of Eid-ul-Adha. Regular classes will resume on Thursday, June 18. Eid Mubarak to all students and family members!",
      date: "2026-06-02",
      priority: "high"
    },
    {
      id: "ann_2",
      title: "Summer 2026 Class Slots Open",
      content: "Parents who wish to shift their children's active slots to earlier parameters or adjust schedules for summer break can now communicate preferred schedules directly through their Parent Dashboard. Slots are assigned on a first-come, first-served basis.",
      date: "2026-05-30",
      priority: "normal"
    }
  ],
  invoices: [
    {
      id: "inv_1",
      studentId: "s_tariq",
      studentName: "Tariq Mahmood",
      month: "June 2026",
      amount: 65,
      status: "unpaid",
      dueDate: "2026-06-10"
    },
    {
      id: "inv_2",
      studentId: "s_sarah",
      studentName: "Sarah Khan",
      month: "June 2026",
      amount: 50,
      status: "paid",
      dueDate: "2026-06-10"
    }
  ],
  books: [
    {
      id: "b_qaida",
      title: "تجویدی نورانی قاعدہ (HD Colored Layout)",
      author: "Mufti Zahid Ali",
      category: "qaida",
      description: "نورانی قاعدہ کا مکمل رنگین اور تجویدی ایڈیشن، بچوں اور بڑوں کے ابتدائی سبق سیکھنے کے لیے بہترین رہنما کتاب۔",
      url: "#",
      uploadedAt: "2026-05-20",
      fileSize: "14.2 MB"
    },
    {
      id: "b_quran",
      title: "قرآن مجید تجویدی (Color Coded Tajweed Holy Quran)",
      author: "Classical Scholars",
      category: "quran",
      description: "تجوید کے کلر کوڈز یعنی مد، غنہ، اور قلقلہ کے خوبصورت قواعد کے ساتھ قرآن مجید کا مستند نسخہ۔",
      url: "#",
      uploadedAt: "2026-05-25",
      fileSize: "48.5 MB"
    },
    {
      id: "b_trans",
      title: "آسان فقہ معاملات (Easy Fiqh of Transactions)",
      author: "Mufti Zahid Ali",
      category: "mufti_books",
      description: "روزمرہ کے مالی معاملات، خرید و فروخت اور جدید اسلامی بینک کاری کے شرعی احکام پر مشتمل مفتی صاحب کی بہترین علمی کتاب۔",
      url: "#",
      uploadedAt: "2026-05-28",
      fileSize: "8.1 MB"
    },
    {
      id: "b_duas",
      title: "صبح و شام کی مستند مسنون دعائیں (Golden Duas Daily)",
      author: "Mufti Zahid Ali",
      category: "mufti_books",
      description: "صبح و شام کے اذکار، مسنون دعائیں اور مصیبتوں سے بچاؤ کے مستند نبوی طریقے اور دعاؤں کا مجموعہ۔",
      url: "#",
      uploadedAt: "2026-06-01",
      fileSize: "3.4 MB"
    }
  ]
};

// Database state accessor functions
function loadDatabase(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading JSON database, using initial model templates", error);
  }
  // Initialize with seed data and save
  saveDatabase(initialDB);
  return initialDB;
}

function saveDatabase(db: DBStructure) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving JSON database to storage", error);
  }
}

// REST API Database Endpoints
app.get("/api/db", (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db);
});

// Post action to modify database
app.post("/api/db/action", (req: Request, res: Response) => {
  const db = loadDatabase();
  const { type, payload } = req.body;

  if (!type) {
    res.status(400).json({ error: "Action type is required" });
    return;
  }

  try {
    switch (type) {
      // 1. Submit New Student Registration (Admission)
      case "REGISTER_STUDENT": {
        const { name, fatherName, email, parentEmail, whatsapp, age, courseId, timezone } = payload;
        const newStudent: Student = {
          id: "s_" + Date.now(),
          name,
          fatherName: fatherName || "",
          email: email || `${name.toLowerCase().replace(/\s+/g, '')}@student.com`,
          parentEmail,
          whatsapp,
          age: Number(age),
          courseId,
          timezone,
          status: "applied",
          daysOfWeek: ["Monday", "Wednesday"], // Assigned default tentative details
          timeSlot: "17:00 - 17:45",
          attendance: [],
          progress: []
        };
        db.students.push(newStudent);
        
        // Setup initial invoice for admission review template
        const newInvoice: FeeInvoice = {
          id: "inv_" + Date.now(),
          studentId: newStudent.id,
          studentName: newStudent.name,
          month: "Admission Fee (One-Time)",
          amount: 30,
          status: "unpaid",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        db.invoices.push(newInvoice);
        break;
      }

      // 2. Admin Approves Applied Student
      case "APPROVE_STUDENT": {
        const { studentId, daysOfWeek, timeSlot } = payload;
        const studentIndex = db.students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          db.students[studentIndex].status = "active";
          db.students[studentIndex].daysOfWeek = daysOfWeek || ["Monday", "Wednesday", "Friday"];
          db.students[studentIndex].timeSlot = timeSlot || "16:00 - 16:45";
          
          // Generate first regular monthly invoice
          const std = db.students[studentIndex];
          const newInvoice: FeeInvoice = {
            id: "inv_" + Date.now(),
            studentId: std.id,
            studentName: std.name,
            month: "June 2026",
            amount: std.courseId === "hifz" ? 80 : 60,
            status: "unpaid",
            dueDate: "2026-06-15"
          };
          db.invoices.push(newInvoice);
        }
        break;
      }

      // 3. Admin Deletes Student
      case "DELETE_STUDENT": {
        const { studentId } = payload;
        db.students = db.students.filter(s => s.id !== studentId);
        db.invoices = db.invoices.filter(i => i.studentId !== studentId);
        break;
      }

      // 4. Admin publishes Announcement
      case "ADD_ANNOUNCEMENT": {
        const { title, content, priority } = payload;
        const newAnn: Announcement = {
          id: "ann_" + Date.now(),
          title,
          content,
          date: new Date().toISOString().split('T')[0],
          priority: priority || "normal"
        };
        db.announcements.unshift(newAnn); // Add newest announcement first
        break;
      }

      // 5. Admin Deletes Announcement
      case "DELETE_ANNOUNCEMENT": {
        const { id } = payload;
        db.announcements = db.announcements.filter(a => a.id !== id);
        break;
      }

      // 6. Admin Marks Invoice Paid
      case "MARK_INVOICE_PAID": {
        const { invoiceId } = payload;
        const invoiceIndex = db.invoices.findIndex(i => i.id === invoiceId);
        if (invoiceIndex !== -1) {
          db.invoices[invoiceIndex].status = "paid";
        }
        break;
      }

      // 7. Teacher updates Student Attendance Log
      case "RECORD_ATTENDANCE": {
        const { studentId, status, date, notes } = payload;
        const studentIndex = db.students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          // Check if already has attendance on that date to rewrite or push
          const existIdx = db.students[studentIndex].attendance.findIndex(a => a.date === date);
          const att: AttendanceRecord = {
            id: "att_" + Date.now(),
            studentId,
            date,
            status,
            notes
          };
          if (existIdx !== -1) {
            db.students[studentIndex].attendance[existIdx] = att;
          } else {
            db.students[studentIndex].attendance.push(att);
          }
        }
        break;
      }

      // 8. Teacher updates Lesson Progress Log
      case "RECORD_PROGRESS": {
        const { studentId, surah, startAyat, endAyat, rating, masteryNotes, date } = payload;
        const studentIndex = db.students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          const prog: LessonProgress = {
            id: "prog_" + Date.now(),
            studentId,
            date: date || new Date().toISOString().split('T')[0],
            surah,
            startAyat: Number(startAyat),
            endAyat: Number(endAyat),
            rating: Number(rating),
            masteryNotes
          };
          db.students[studentIndex].progress.unshift(prog); // newest progress first
        }
        break;
      }

      // 9. Admin adds/edits custom teacher
      case "SAVE_TEACHER": {
        const { id, name, email, qualification, experience, courses, bio } = payload;
        if (id) {
          const idx = db.teachers.findIndex(t => t.id === id);
          if (idx !== -1) {
            db.teachers[idx] = { ...db.teachers[idx], name, email, qualification, experience, courses, bio };
          }
        } else {
          db.teachers.push({
            id: "t_" + Date.now(),
            name,
            email,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            qualification,
            experience,
            courses,
            bio
          });
        }
        break;
      }

      // 10. Add Book to Library
      case "ADD_BOOK": {
        const { title, author, category, description, url, fileSize } = payload;
        if (!db.books) {
          db.books = [];
        }
        const newBook: BookResource = {
          id: "b_" + Date.now(),
          title,
          author: author || "Mufti Zahid Ali",
          category,
          description: description || "",
          url: url || "#",
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: fileSize || "5.0 MB"
        };
        db.books.push(newBook);
        break;
      }

      // 11. Delete Book from Library
      case "DELETE_BOOK": {
        const { bookId } = payload;
        if (db.books) {
          db.books = db.books.filter(b => b.id !== bookId);
        }
        break;
      }

      default:
        res.status(400).json({ error: `Unsupported action type: ${type}` });
        return;
    }

    saveDatabase(db);
    res.json({ success: true, db });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Something went wrong editing DB storage" });
  }
});

// Lazy-initialized Gemini API client wrapper for safety
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 24/7 AI Chatbot API handler
app.post("/api/chatbot", async (req: Request, res: Response) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ response: "Assalamu Alaikum! How can I assist you with our Quran Academy today?" });
    return;
  }

  try {
    const ai = getGeminiClient();
    
    // Construct simplified Chat history or context sequence for Gemini API
    const systemPrompt = `You are "Hashir Bot", the official friendly AI Desk Agent & Support Tutor of "M Hashir Online Quran Academy". 
Your characteristics and info:
- Tone: Extremely warm, welcoming, respectful, professional, and Islamic (using phrases like 'Assalamu Alaikum', 'JazakAllahu Khairan', 'Alhamdulillah' appropriately but globally understood by all).
- Academy Founder: Mufti Zahid Ali (Completed 8-year Alim course from Jamia Darul Uloom Karachi under Mufti Taqi Usmani, Specialization in Takhassus fil Ifta from Jamia Ashraf-ul-Madaris Karachi, M.Phil & ongoing PhD in Islamic Studies, Mardan University). Certified Tajweed and Noorani Qaida expert who serves as the Chairman of an international Islamic organization.
- Courses Offered: 
  1. Noorani Qaida (Starts with basic alphabets, recognition, phonetic pronunciation. Perfect for absolute beginners and young kids).
  2. Quran Reading with Tajweed (Focuses on beautiful reciting rules, heavy letters, elongation, stop signs).
  3. Quran Memorization (Hifz) (Customized tracks with teachers to memorize Juz 30 or full Quran with active retention cycles).
  4. Islamic Studies (Covers basic Fiqh, Duas, Hadith, prophetic moral stories, Seerah).
- Flexible Classes: 1-on-1 private video calls direct in-browser. No external software. Female certified tutors available. Times are set 24/7 matching student timezone (UK, USA, Australia, Gulf countries, etc.).
- Pricing / Fees (Estimation): Affordable monthly plans starting from $50 USD up to $100 USD depending on course. Free 3-day trial available.
- Direct Instructions: Answer cleanly, concisely. Keep paragraphs short. Invite them to click the "Register Now" or "Admission Form" to fill direct online admission. Remember to address user inquiries accurately. DO NOT hallucinate.`;

    const chatHistory = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Generate content using the recommended task model 'gemini-3.5-flash'
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ response: result.text || "Thank you for your question. M Hashir Online Quran Academy is here to serve you! Please sign up using the Registration option above." });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    // Graceful fallback for demo when no API key is linked
    res.json({
      response: "Assalamu Alaikum! I am the M Hashir Online Quran Academy AI Assistant. [Demo Mode] " +
        "It looks like the Gemini API is starting up or key configuration is pending, but here is some helpful information: " +
        "We offer Noorani Qaida, Tajweed Reading, Hifz, and Islamic Studies. Our classes are 1-on-1, flexible matching your timezone, and led by qualified tutors under the scholarly guidance of our Academy Muazzam, Mufti Zahid Ali (8-Year Graduate from Jamia Darul Uloom Karachi under Mufti Taqi Usmani). " +
        "Would you like to try our online admission form or check our courses section below? Let me know how I can help!"
    });
  }
});

// Configure Vite middleware for development or serve frontend static bundle
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Server running as custom backend on http://localhost:${PORT}`);
  });
}

startServer();
