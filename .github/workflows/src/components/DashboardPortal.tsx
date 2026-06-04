/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, BookOpen, Clock, AlertCircle, Plus, Trash2, Check, DollarSign, 
  MapPin, Send, MessageSquare, Award, Star, Activity, FileText, User, 
  Download, Calendar, Megaphone, Bell, Shield, Lock, CreditCard, PlayCircle, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AcademyState, Student, FeeInvoice, Announcement, Teacher } from '../types';

interface DashboardPortalProps {
  dbState: AcademyState;
  userRole: 'admin' | 'teacher' | 'student' | 'parent';
  onAction: (type: string, payload: any) => void;
  onEnterClass: (studentId: string, studentName: string, courseId: string) => void;
}

export default function DashboardPortal({ dbState, userRole, onAction, onEnterClass }: DashboardPortalProps) {
  // Admin local states
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'high' | 'normal'>('normal');

  // Teacher database states
  const [techName, setTechName] = useState('');
  const [techQual, setTechQual] = useState('');
  const [techExp, setTechExp] = useState('');
  const [techCourses, setTechCourses] = useState<string[]>([]);
  const [techBio, setTechBio] = useState('');
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  // Parent student selector state
  const [activeChildId, setActiveChildId] = useState('s_tariq');

  // Book upload local states
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('Mufti Zahid Ali');
  const [newBookCategory, setNewBookCategory] = useState('mufti_books');
  const [newBookDescription, setNewBookDescription] = useState('');
  const [newBookUrl, setNewBookUrl] = useState('#');
  const [newBookSize, setNewBookSize] = useState('3.5 MB');
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('all');
  
  // Custom print weekly progress assessment modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState<Student | null>(null);

  // Attendance feedback state
  const [selectedStudentId, setSelectedStudentId] = useState('s_tariq');
  const [attStatus, setAttStatus] = useState<'present' | 'absent'>('present');
  const [attNotes, setAttNotes] = useState('');

  // Course translation map
  const coursesMap = {
    noorani: "Noorani Qaida (Beginners)",
    tajweed: "Quran Recitation with Tajweed",
    hifz: "Quran Memorization (Hifz)",
    studies: "Islamic Studies Program"
  };

  const activeChild = dbState.students.find(s => s.id === activeChildId) || dbState.students[0];

  const filteredBooks = (dbState.books || []).filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
                          (book.description && book.description.toLowerCase().includes(bookSearchQuery.toLowerCase()));
    
    if (bookCategoryFilter === 'all') return matchesSearch;
    return book.category === bookCategoryFilter && matchesSearch;
  });

  const handleUploadBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle) return;
    onAction("ADD_BOOK", {
      title: newBookTitle,
      author: newBookAuthor,
      category: newBookCategory,
      description: newBookDescription,
      url: newBookUrl || "#",
      fileSize: newBookSize || "4.5 MB"
    });
    setNewBookTitle('');
    setNewBookAuthor('Mufti Zahid Ali');
    setNewBookCategory('mufti_books');
    setNewBookDescription('');
    setNewBookUrl('#');
    setNewBookSize('3.5 MB');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    onAction("ADD_ANNOUNCEMENT", {
      title: newAnnTitle,
      content: newAnnContent,
      priority: newAnnPriority
    });
    setNewAnnTitle('');
    setNewAnnContent('');
    setNewAnnPriority('normal');
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName || !techQual) return;
    onAction("SAVE_TEACHER", {
      name: techName,
      email: `${techName.toLowerCase().replace(/\s+/g, '')}@academy.com`,
      qualification: techQual,
      experience: techExp,
      courses: techCourses,
      bio: techBio
    });
    setTechName('');
    setTechQual('');
    setTechExp('');
    setTechCourses([]);
    setTechBio('');
    setShowAddTeacher(false);
  };

  const handleMarkPayment = (invoiceId: string) => {
    onAction("MARK_INVOICE_PAID", { invoiceId });
  };

  const handleApproveStudent = (studentId: string) => {
    onAction("APPROVE_STUDENT", {
      studentId,
      daysOfWeek: ["Monday", "Wednesday", "Friday"],
      timeSlot: "16:00 - 16:45"
    });
  };

  const handleRecordAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    onAction("RECORD_ATTENDANCE", {
      studentId: selectedStudentId,
      status: attStatus,
      date: new Date().toISOString().split('T')[0],
      notes: attNotes
    });
    setAttNotes('');
    alert('Attendance updated successfully for student!');
  };

  return (
    <div id="dashboard-portal-wrapper" className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Dynamic Announcement Board Row for all users except Admin (who publishes it) */}
      {userRole !== 'admin' && dbState.announcements.length > 0 && (
        <div id="common-announcements-ticker" className="mb-6 bg-red-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-amber-600 animate-bounce shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-[10px] bg-amber-500 text-emerald-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Notice Board Central
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0a4a2e] mt-1.5 leading-tight">
                {dbState.announcements[0].title}
              </h4>
              <p className="text-xs text-gray-700 mt-1">
                {dbState.announcements[0].content}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">Published Date: {dbState.announcements[0].date}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADMIN VIEWPORT ================= */}
      {userRole === 'admin' && (
        <div id="admin-viewport" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-950 p-6 rounded-2xl border border-amber-500/30 text-white">
            <div>
              <span className="text-[10px] bg-amber-500 text-emerald-950 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                System Administrator Console
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mt-2 font-display">
                M Hashir Academy Management Portal
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1">
                Manage registrations, teachers database, alert tickers, invoices, and classes metrics.
              </p>
            </div>
            <div className="bg-emerald-900 border border-amber-500/20 px-4 py-2.5 rounded-xl font-mono text-xs">
              🔒 SuperAdmin Session SECURE
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sleek-card p-4 border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald-50 text-[#0a4a2e] flex items-center justify-center shrink-0 border border-brand-emerald-500/10">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Active Pupils</p>
                <p className="text-xl font-extrabold text-[#0a4a2e] font-sans">
                  {dbState.students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>

            <div className="sleek-card p-4 border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-100 text-[#be8606] flex items-center justify-center shrink-0 border border-brand-gold-500/10">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">New Signups</p>
                <p className="text-xl font-extrabold text-[#0a4a2e] font-sans">
                  {dbState.students.filter(s => s.status === 'applied').length}
                </p>
              </div>
            </div>

            <div className="sleek-card p-4 border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-750 flex items-center justify-center shrink-0 border border-red-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Unpaid Invoices</p>
                <p className="text-xl font-extrabold text-[#0a4a2e] font-sans">
                  {dbState.invoices.filter(i => i.status === 'unpaid').length}
                </p>
              </div>
            </div>

            <div className="sleek-card p-4 border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Notice Tickers</p>
                <p className="text-xl font-extrabold text-[#0a4a2e] font-sans">
                  {dbState.announcements.length}
                </p>
              </div>
            </div>
          </div>

          {/* Double Aspect Grid: Student Applications & Global Announcement publishing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pupil Registrations and Admission Manager (Applied and Active list) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-emerald-800" /> Pending Student Applications
                </h3>
                
                {dbState.students.filter(s => s.status === 'applied').length === 0 ? (
                  <p className="text-xs text-gray-400 p-6 text-center">No new applications pending right now.</p>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2">
                    {dbState.students.filter(s => s.status === 'applied').map((st) => (
                      <div key={st.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                        <div>
                          <p className="font-extrabold text-[#0a4a2e] text-sm">{st.name} ({st.age} yrs)</p>
                          {st.fatherName && (
                            <p className="text-slate-700 font-semibold text-[11px] mt-0.5">والد کا نام (Father): <span className="text-emerald-900 font-extrabold">{st.fatherName}</span></p>
                          )}
                          <p className="text-slate-500 font-mono text-[11px] mt-0.5">{st.timezone} • {coursesMap[st.courseId as keyof typeof coursesMap]}</p>
                          <p className="text-slate-400 font-mono text-[10px]">Email: {st.parentEmail} • WhatsApp: {st.whatsapp}</p>
                        </div>
                        <div className="flex gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleApproveStudent(st.id)}
                            className="bg-brand-emerald-900 border border-brand-gold-500/20 px-3.5 py-2 rounded-xl text-brand-gold-100 font-extrabold text-[11px] uppercase tracking-wide cursor-pointer hover:bg-brand-emerald-800 transition-colors"
                          >
                            Approve Slot (Active)
                          </button>
                          <button
                            onClick={() => onAction("DELETE_STUDENT", { studentId: st.id })}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl cursor-pointer border border-red-200 transition-colors"
                            title="Decline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Students management block */}
              <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-emerald-800" /> Currently Enrolled Students ({dbState.students.filter(s => s.status === 'active').length})
                </h3>
                <div className="divide-y divide-slate-150/60 mt-2">
                  {dbState.students.filter(s => s.status === 'active').map((st) => (
                    <div key={st.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <p className="font-extrabold text-slate-800 text-[13px]">{st.name} ({st.age} yrs)</p>
                        </div>
                        {st.fatherName && (
                          <p className="text-slate-600 font-semibold text-[11px] mt-0.5 ml-4">والد کا نام (Father): <span className="text-emerald-900 font-extrabold">{st.fatherName}</span></p>
                        )}
                        <p className="text-slate-500 font-mono text-[11px] mt-0.5 ml-4">
                          Timing: {st.daysOfWeek.join('/')} @ {st.timeSlot} ({st.timezone})
                        </p>
                        <p className="text-[10px] text-brand-emerald-800 font-bold uppercase tracking-wider mt-0.5">Course Code: {st.courseId.toUpperCase()}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => onEnterClass(st.id, st.name, st.courseId)}
                          className="bg-brand-emerald-950 text-brand-gold-500 border border-brand-gold-500/20 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider cursor-pointer font-mono hover:bg-brand-emerald-900 transition-colors"
                        >
                          Join Class
                        </button>
                        <button
                          onClick={() => onAction("DELETE_STUDENT", { studentId: st.id })}
                          className="border border-red-200 hover:bg-red-50 p-1.5 rounded-lg text-red-600 cursor-pointer transition-colors"
                          title="Remove Scholar Slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin global Announcement notice generator */}
            <div className="space-y-6">
              <div className="sleek-card bg-brand-emerald-50/20 border-brand-emerald-500/10 p-5 hover:translate-y-0 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wide border-b border-brand-emerald-500/15 pb-2.5 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#be8606] animate-pulse" /> Post Global Notice
                </h3>
                
                <form onSubmit={handleCreateAnnouncement} className="space-y-3 mt-3 text-xs">
                  <div>
                    <label className="block text-slate-650 font-bold mb-1">Notice Header Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eid Mubarak / Class breaks"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      className="w-full bg-white/90 border border-slate-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-slate-800 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-650 font-bold mb-1">Alert Content</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write global announcements instantly display on student and parents panels..."
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      className="w-full bg-white/90 border border-slate-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-slate-800 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-650 font-bold mb-1">Level priority</label>
                    <select
                      value={newAnnPriority}
                      onChange={(e) => setNewAnnPriority(e.target.value as 'high' | 'normal')}
                      className="w-full bg-white/90 border border-slate-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2 text-slate-800 outline-none transition-all"
                    >
                      <option value="normal">Normal notice status</option>
                      <option value="high">Urgent holiday notice status / High</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sleek-btn-emerald py-2 cursor-pointer uppercase text-xs"
                  >
                    Broadcast Announcement
                  </button>
                </form>

                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Bulletins Logs</p>
                  {dbState.announcements.map((an) => (
                    <div key={an.id} className="bg-white/80 border border-slate-100 rounded-xl p-2.5 flex justify-between items-start gap-2 shadow-sm">
                      <div className="text-[11px]">
                        <p className="font-extrabold text-slate-800">{an.title}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">{an.date}</p>
                      </div>
                      <button
                        onClick={() => onAction("DELETE_ANNOUNCEMENT", { id: an.id })}
                        className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Billing fee list tracker */}
          <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wide border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-emerald-800" /> Pupils Fee Collection Ledger
            </h3>
            <div className="overflow-x-auto mt-2 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-emerald-500/5 text-[#0a4a2e] font-extrabold uppercase text-[10px] border-b border-slate-100">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Billing Cycle</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Payment status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {dbState.invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-extrabold text-slate-800">{inv.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{inv.month}</td>
                      <td className="py-2.5 px-3 font-extrabold text-slate-800 font-mono">${inv.amount} USD</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{inv.dueDate}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          inv.status === 'paid' 
                            ? 'bg-[#eefdf6] text-brand-emerald-800 border-brand-emerald-300/30' 
                            : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                        }`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {inv.status === 'unpaid' && (
                          <button
                            onClick={() => handleMarkPayment(inv.id)}
                            className="bg-brand-emerald-900 border border-brand-gold-500/20 text-brand-gold-100 font-extrabold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-brand-emerald-800 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEACHER VIEWPORT ================= */}
      {userRole === 'teacher' && (
        <div id="teacher-viewport" className="space-y-8">
          <div className="bg-emerald-950 p-6 rounded-2xl border border-amber-500/30 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] bg-amber-500 text-emerald-950 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Certified Scholar Dashboard
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mt-2 font-display">
                MashaAllah, Welcome Mufti Zahid Ali
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1">
                View your active schedules assigned, submit attendance ratings, log lessons progress inside our secure WebRTC classrooms.
              </p>
            </div>
            <div className="bg-amber-500 text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-400">
              Teacher Session Connected
            </div>
          </div>

          {/* Daily Schedule List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wide border-b pb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-800" /> Todays Classroom Schedule
                </h3>
                
                <div className="divide-y divide-gray-150 text-xs mt-2">
                  {dbState.students.filter(s => s.status === 'active').map((std) => (
                    <div key={std.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-ping" />
                          <h4 className="font-extrabold text-sm text-[#0a4a2e]">{std.name}</h4>
                        </div>
                        <p className="text-slate-500 mt-1 font-mono">{std.daysOfWeek.join(' / ')} @ {std.timeSlot} ({std.timezone})</p>
                        <p className="text-[10px] text-gray-400 uppercase mt-0.5">Course Enrolled: {coursesMap[std.courseId as keyof typeof coursesMap]}</p>
                      </div>

                      <button
                        onClick={() => onEnterClass(std.id, std.name, std.courseId)}
                        className="bg-emerald-950 hover:bg-emerald-900 border border-amber-500/20 text-amber-400 font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md text-xs"
                      >
                        <PlayCircle className="w-5 h-5" /> Launch Live Class
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Quick Logger */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wide border-b pb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-800" /> Active Student Attendance Form
                </h3>
                <form onSubmit={handleRecordAttendance} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Pick Student</label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full bg-white border rounded p-2 text-gray-800"
                    >
                      {dbState.students.filter(s => s.status === 'active').map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Timing Status</label>
                    <select
                      value={attStatus}
                      onChange={(e) => setAttStatus(e.target.value as 'present' | 'absent')}
                      className="w-full bg-white border rounded p-1.5 text-gray-800"
                    >
                      <option value="present">Present & Prompt</option>
                      <option value="absent">Unexcused Absent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Teacher Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g., Prepared Lesson 4 perfectly"
                      value={attNotes}
                      onChange={(e) => setAttNotes(e.target.value)}
                      className="w-full bg-white border rounded p-2 text-gray-800"
                    />
                  </div>
                  <div className="md:col-span-3 text-right">
                    <button
                      type="submit"
                      className="bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold px-4 py-2 rounded"
                    >
                      Log Daily Attendance
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Resources Material Section */}
            <div className="bg-stone-50 border p-4 rounded-xl shadow-inner divide-y">
              <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-widest pb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" /> Quran Learning Materials
              </h3>
              
              <div className="space-y-3 py-3 text-xs">
                <div className="p-3 bg-white border rounded-lg hover:border-amber-500 transition-colors">
                  <p className="font-bold text-gray-800">Noorani Qaida (HD Colored PDF)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Perfect reference for letters joining shapes and throat pronunciation exercises.</p>
                  <a href="#qaida-link" onClick={() => alert('HD Noorani Qaida resource opened inside class screen shared frame.')} className="text-emerald-800 hover:underline font-bold mt-1.5 inline-block">Open Resource Link</a>
                </div>

                <div className="p-3 bg-white border rounded-lg hover:border-amber-500 transition-colors">
                  <p className="font-bold text-gray-800">Tajweed Rules Checklist</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Madd guidelines, nasal sound counts, and stop rule charts for kids.</p>
                  <a href="#tajweed-link" onClick={() => alert('Tajweed rule guide loaded inside e-board viewer.')} className="text-emerald-800 hover:underline font-bold mt-1.5 inline-block">Open Resource Link</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= STUDENT VIEWPORT ================= */}
      {userRole === 'student' && (
        <div id="student-viewport" className="space-y-8">
          <div className="bg-emerald-950 p-6 rounded-2xl border border-amber-500/30 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] bg-amber-500 text-emerald-950 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Active Scholar Login
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mt-2 font-display">
                Assalamu Alaikum, {dbState.students[0]?.name || "Tariq Mahmood"}!
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1">
                Your virtual classroom with Mufti Zahid Ali is connected. Ready to start reciting the verses today?
              </p>
            </div>
            
            <button
              onClick={() => onEnterClass(dbState.students[0].id, dbState.students[0].name, dbState.students[0].courseId)}
              className="bg-amber-500 text-emerald-950 hover:bg-amber-400 font-extrabold px-6 py-3.5 rounded-xl shadow-lg border-2 border-amber-400 flex items-center gap-2 cursor-pointer text-sm animate-pulse"
            >
              <PlayCircle className="w-5 h-5 text-emerald-950" /> Join Live Classroom Now
            </button>
          </div>

          <div id="student-schedule" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-emerald-800" /> My Recitation Slot timings
              </h3>
              <div className="mt-3.5 flex items-center gap-4 text-xs">
                <div className="bg-[#eefdf6] text-brand-emerald-800 border border-brand-emerald-500/20 p-3 rounded-lg text-center font-bold font-mono">
                  Weekly class days
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-800">
                    {dbState.students[0]?.daysOfWeek.join(' / ')}
                  </p>
                  <p className="text-slate-500 mt-0.5">Slot: {dbState.students[0]?.timeSlot} ({dbState.students[0]?.timezone})</p>
                </div>
              </div>
            </div>

            {/* Recited progress */}
            <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-emerald-800" /> Active Course Progress
              </h3>
              <div className="mt-3.5 text-xs">
                <p className="font-extrabold text-slate-800">Course Registered: {coursesMap[dbState.students[0]?.courseId as keyof typeof coursesMap]}</p>
                <div className="bg-amber-500/5 border border-[#e3a817]/25 p-3 rounded-lg mt-2 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold text-[#0a4a2e]">Last recited lesson:</p>
                    <p className="text-slate-500 font-medium mt-0.5">{dbState.students[0]?.progress[0]?.surah || "Noorani Qaida lesson 5"} (Ayat {dbState.students[0]?.progress[0]?.startAyat || 1}-{dbState.students[0]?.progress[0]?.endAyat || 7})</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(dbState.students[0]?.progress[0]?.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold-500 text-brand-gold-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PARENT VIEWPORT ================= */}
      {userRole === 'parent' && (
        <div id="parent-viewport" className="space-y-8">
          <div className="bg-emerald-950 p-6 rounded-2xl border border-amber-500/30 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] bg-amber-500 text-emerald-950 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Guardian Support Dashboard
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mt-2 font-display">
                Assalamu Alaikum, Guardian Parent
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1">
                Monitor your children's daily/weekly Quran progress reports, attendance metrics, download academic cards, and track due monthly fee invoice status.
              </p>
            </div>
            
            {/* Quick printable report card trigger */}
            <button
              onClick={() => {
                setSelectedReportStudent(activeChild);
                setShowReportModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer text-xs"
            >
              <FileText className="w-4 h-4" /> View Weekly Progress Report Card
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Select student child row if multi-child */}
            <div className="lg:col-span-1 sleek-card hover:translate-y-0 border-slate-200/60 p-5 shadow-sm space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-slate-100 pb-2 font-mono">Children Monitored</p>
              
              {dbState.students.filter(s => s.status === 'active').map(st => (
                <button
                  key={st.id}
                  onClick={() => setActiveChildId(st.id)}
                  className={`w-full p-3.5 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                    activeChildId === st.id 
                      ? 'bg-brand-emerald-900 text-white border-brand-gold-500/30 shadow-md' 
                      : 'bg-stone-50 hover:bg-slate-100 border-slate-205 text-gray-850'
                  }`}
                >
                  <div className="text-xs">
                    <p className="font-extrabold">{st.name}</p>
                    <p className={activeChildId === st.id ? 'text-brand-gold-400 font-bold font-mono text-[10px] mt-0.5' : 'text-slate-500 font-mono text-[10px] mt-0.5'}>
                      Course: {st.courseId.toUpperCase()}
                    </p>
                  </div>
                  <User className={`w-4 h-4 shrink-0 ${activeChildId === st.id ? 'text-brand-gold-500' : 'text-slate-400'}`} />
                </button>
              ))}

              <p className="text-[10px] text-gray-400 leading-tight italic pt-2">
                * To add another child under your parent email registration, simply fill out our online admission form with identical email coordinates!
              </p>
            </div>

            {/* Active monitored Child Statistics (Report metrics) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Attendance rate card */}
                <div className="sleek-card text-center p-5 hover:translate-y-0 border-slate-200/55 shadow-sm">
                  <Activity className="w-6 h-6 text-brand-emerald-800 mx-auto" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 font-mono">Class Attendance Rate</p>
                  <p className="text-xl font-extrabold text-[#0a4a2e] mt-1 font-sans">
                    {activeChild?.attendance.length ? Math.round((activeChild.attendance.filter(a => a.status === 'present').length / activeChild.attendance.length) * 100) : 100}%
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {activeChild?.attendance.filter(a => a.status === 'present').length} out of {activeChild?.attendance.length} slots attended
                  </p>
                </div>

                {/* Stars average */}
                <div className="sleek-card text-center p-5 hover:translate-y-0 border-slate-200/55 shadow-sm">
                  <Award className="w-6 h-6 text-[#be8606] mx-auto" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 font-mono">Average Recite Rating</p>
                  <p className="text-xl font-extrabold text-[#0a4a2e] mt-1 font-sans">
                    {activeChild?.progress.length ? (activeChild.progress.reduce((acc, c) => acc + c.rating, 0) / activeChild.progress.length).toFixed(1) : "5.0"} / 5.0
                  </p>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-gold-500 text-brand-gold-500" />
                    ))}
                  </div>
                </div>

                {/* Days list */}
                <div className="sleek-card text-center p-5 hover:translate-y-0 border-slate-200/55 shadow-sm">
                  <Clock className="w-6 h-6 text-brand-emerald-800 mx-auto" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 font-mono font-mono">Scheduled class days</p>
                  <p className="text-sm font-extrabold text-[#0a4a2e] mt-1">
                    {activeChild?.daysOfWeek.join(' / ') || "Mon / Wed / Fri"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activeChild?.timeSlot}</p>
                </div>

              </div>

              {/* Progress Timeline List */}
              <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-emerald-800" /> Student Progress Timeline & Scholar Notes
                </h3>
                
                {activeChild?.progress.length === 0 ? (
                  <p className="text-xs text-gray-400 p-6 text-center">Your child hasn't started reciting any chapters yet. Session reports log when classes launch!</p>
                ) : (
                  <div className="flow-root mt-4 text-xs">
                    <ul className="-mb-8">
                      {activeChild?.progress.map((prog, index) => (
                        <li key={prog.id || index}>
                          <div className="relative pb-8">
                            {index !== activeChild.progress.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-brand-emerald-50 text-[#0a4a2e] border border-brand-emerald-500/10 flex items-center justify-center font-extrabold">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5 flex flex-col sm:flex-row justify-between gap-2">
                                <div>
                                  <p className="font-extrabold text-[#0a4a2e]">
                                    Recited: {prog.surah} <span className="text-slate-500 font-normal">(Ayat {prog.startAyat} to {prog.endAyat})</span>
                                  </p>
                                  <p className="text-slate-600 mt-1 italic p-2.5 bg-[#eefdf6]/50 border-l-2 border-[#be8606] rounded-r-lg font-sans">
                                    "{prog.masteryNotes}"
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="flex gap-0.5 justify-end">
                                    {[...Array(prog.rating)].map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-brand-gold-500 text-brand-gold-500" />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono block mt-1">{prog.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Invoices paid list */}
              <div className="sleek-card p-5 hover:translate-y-0 border-slate-200/60 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0a4a2e] uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-emerald-800" /> Academy Tuition Fee Billing
                </h3>
                <div className="divide-y divide-slate-100 text-xs mt-3">
                  {dbState.invoices.filter(i => i.studentId === activeChildId).map((inv) => (
                    <div key={inv.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-extrabold text-slate-800">{inv.month} Invoice</p>
                        <p className="text-[10px] text-slate-400">Due before {inv.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-800 font-mono">${inv.amount} USD</span>
                        {inv.status === 'paid' ? (
                          <span className="bg-[#eefdf6] text-brand-emerald-800 border border-brand-emerald-300/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide text-[9px]">PAID</span>
                        ) : (
                          <button
                            onClick={() => {
                              handleMarkPayment(inv.id);
                            }}
                            className="bg-brand-emerald-900 border border-brand-gold-500/20 text-brand-gold-100 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-brand-emerald-850 transition-colors"
                          >
                            Pay Online (Simulator)
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= GLOBAL ISLAMIC DIGITAL LIBRARY SECTION ================= */}
      <div id="islamic-digital-library-section" className="space-y-6 pt-8 border-t border-slate-200/80 mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#032e1d] to-[#0a4a2e] border border-amber-500/20 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 select-none pointer-events-none mt-[-20px] mr-[-20px] text-9xl font-serif">📖</div>
          <div className="relative z-10">
            <span className="text-[10px] bg-amber-500 text-emerald-950 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Academic Library & Publications
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mt-2 font-display">
              ڈیجیٹل کتب خانہ اور نصابی مواد (Islamic Bookshelf & Learning Desk)
            </h2>
            <p className="text-xs text-emerald-100/95 mt-1 max-w-2xl font-sans">
              کتب مطالعہ، تجویدی قواعد، نورانی قاعدہ اور مفتی زاہد علی صاحب کی مقبول لکھی گئی کتابیں ڈاؤن لوڈ اور پی ڈی ایف فارمیٹ میں حاصل کریں۔
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Books Shelf & Search: 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-stone-50 border border-slate-200/60 p-3 rounded-xl flex flex-col md:flex-row gap-3 justify-between items-center text-xs shadow-xs">
              
              {/* Category buttons */}
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {[
                  { id: 'all', label: '📖 تمام کتب' },
                  { id: 'quran', label: '📗 قرآن پاک' },
                  { id: 'qaida', label: '📙 نورانی قاعدہ' },
                  { id: 'mufti_books', label: '✍️ تصانیفِ مفتی صاحب' },
                  { id: 'other', label: '📚 دیگر کتب' }
                ].map((tc) => (
                  <button
                    key={tc.id}
                    onClick={() => setBookCategoryFilter(tc.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${bookCategoryFilter === tc.id ? 'bg-[#0a4a2e] text-white shadow' : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'}`}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>

              {/* Text Search input */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="کتاب یا مصنف تلاش کریں (Search books)..."
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-250 py-2 px-3 pl-8 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                />
                <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
              </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="p-10 text-center bg-white border border-slate-150 rounded-2xl text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2 animate-pulse" />
                <p className="text-xs font-semibold">کوئی کتاب نہیں ملی۔ (No books matched your criteria.)</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-slate-200/85 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full flex flex-col overflow-hidden group">
                    {/* Artistic Top Book Visual representing Quranic / Islamic Binding */}
                    <div className="bg-[#0a4a2e]/5 p-5 flex flex-col justify-between items-center relative min-h-[145px] border-b border-dashed border-slate-200 overflow-hidden group-hover:bg-[#0a4a2e]/10 transition-colors">
                      <div className="absolute right-3 top-0 w-3 h-10 bg-amber-500 rounded-b-sm shadow-xs" />
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full absolute top-3 left-3 select-none">
                        {b.category === "mufti_books" ? "تصانیفِ مفتی" : b.category === "qaida" ? "قاعدہ" : b.category === "quran" ? "قرآن پاک" : "دیگر کتب"}
                      </span>
                      <BookOpen className="w-9 h-9 text-[#0a4a2e] mb-2 mt-4 drop-shadow-xs group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-black text-[#0a4a2e] text-center line-clamp-2 max-w-xs">{b.title}</p>
                      <p className="text-[10px] text-amber-700 font-bold mt-1 font-sans">{b.author}</p>
                    </div>
                    
                    {/* Description & metadata details */}
                    <div className="p-4 flex-1 flex flex-col justify-between text-xs text-slate-650">
                      <p className="line-clamp-3 text-slate-500 font-sans text-[11px] leading-relaxed mb-4 text-center mt-1" dir="rtl">{b.description || "کوئی تفصیل نہیں دی گئی۔"}</p>
                      
                      <div className="space-y-3 mt-auto">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono border-t pt-2 border-slate-100">
                          <span>{b.fileSize || "4.5 MB"}</span>
                          <span className="text-[#0a4a2e] uppercase font-bold text-[9px]">Islamic Desk Portfolio</span>
                        </div>

                        <div className="flex gap-2 w-full">
                          <a
                            href={b.url && b.url !== '#' ? b.url : `https://archive.org/details/NooraniQaidaEnglishUrdu`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-[#0a4a2e] hover:bg-[#083b25] text-brand-gold-100 border border-brand-gold-500/15 py-1.5 rounded-lg text-[10px] font-extrabold uppercase text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download className="w-3 h-3 text-brand-gold-400" /> PDF
                          </a>
                          <button
                            onClick={() => {
                              alert(`توجہ فرمائیں! " ${b.title} " اب پڑھنے کے لئے آن لائن لوڈ ہو رہی ہے۔\n(Note: Interactive book simulation loads inside shared workspace frame!)`);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-emerald-950 py-1.5 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                            title="Read on screen"
                          >
                            پڑھیے 📖
                          </button>
                          {(userRole === 'admin' || userRole === 'teacher') && (
                            <button
                              onClick={() => {
                                if(confirm(`کیا آپ اس کتاب "${b.title}" کو حذف کرنا چاہتے ہیں؟`)) {
                                  onAction("DELETE_BOOK", { bookId: b.id });
                                }
                              }}
                              className="border border-red-200 hover:bg-red-50 text-red-500 p-2 rounded-lg transition-colors cursor-pointer"
                              title="حذف کریں / Delete book"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Book Uploader panel ONLY for admin/teacher role: 1 column */}
          <div className="lg:col-span-1">
            {(userRole === 'admin' || userRole === 'teacher') ? (
              <div className="sleek-card bg-amber-500/5 border border-amber-500/20 p-5 hover:translate-y-0 shadow-sm space-y-4">
                <div className="border-b border-amber-500/20 pb-3">
                  <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#0a4a2e]" /> کتب اپلوڈ فارم / Books Manager
                  </h3>
                  <p className="text-[10px] text-emerald-900 mt-1">Upload new Noorani Qaida editions, Mushaf copies, or original written publications directly.</p>
                </div>

                <form onSubmit={handleUploadBook} className="space-y-3 text-xs text-slate-700">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">کتاب کا نام (Book Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلا: تجویدی قاعدہ آسان سبق"
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">مصنف کا نام (Author) *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلا: مفتی زاہد علی"
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg p-2 text-slate-800 outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">کتاب کی درجہ بندی (Category) *</label>
                    <select
                      value={newBookCategory}
                      onChange={(e) => setNewBookCategory(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg p-2.5 text-slate-800 outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                    >
                      <option value="mufti_books">✍️ میری لکھی گئی کتب (Mufti's Writings)</option>
                      <option value="qaida">📙 نورانی قاعدہ (Noorani Qaida)</option>
                      <option value="quran">📗 قرآن پاک (Quran Pak)</option>
                      <option value="other">📚 دیگر اسلامی کتب (Other Islamic Books)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">کتاب کا سائز (File Size)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5.6 MB"
                      value={newBookSize}
                      onChange={(e) => setNewBookSize(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg p-2 text-slate-800 outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">آن لائن مطالعہ یا پی ڈی ایف کا لنک (PDF URL)</label>
                    <input
                      type="text"
                      placeholder="https://archive.org/..."
                      value={newBookUrl}
                      onChange={(e) => setNewBookUrl(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg p-2 text-slate-800 outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">کتاب کے بارے میں مختصر وضاحت (Description)</label>
                    <textarea
                      rows={2}
                      placeholder="لکھیں کہ یہ کتاب کس موضوع پر ہے..."
                      value={newBookDescription}
                      onChange={(e) => setNewBookDescription(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-lg p-2 text-slate-800 outline-none focus:ring-1 focus:ring-[#0a4a2e]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-900 border border-brand-gold-500/20 text-brand-gold-100 font-extrabold py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-emerald-800 transition-colors"
                  >
                    Add & Sync Book 📖
                  </button>
                </form>
              </div>
            ) : (
              <div className="sleek-card border-brand-emerald-500/10 bg-brand-emerald-500/5 p-5 hover:translate-y-0 text-xs text-slate-750">
                <h4 className="font-extrabold text-[#0a4a2e] mb-2 uppercase tracking-wider">💡 ممبران کے لیے خصوصی ہدایت</h4>
                <p className="leading-relaxed font-sans text-slate-600 text-[11px]">
                  محترم سٹوڈنٹس اور گارڈینز! یہ کتب خانہ آپ کے تعلیمی سفر کو آسان بنانے کے لیے ڈیزائن کیا گیا ہے۔ آپ کسی بھی کتاب کی پی ڈی ایف حاصل کر سکتے ہیں یا "پڑھیے" دباکر آن لائن ورچوئل ایڈیشن کھول سکتے ہیں۔ کتابیں اپلوڈ کرنے کا اختیار صرف اکیڈمی انتطامیہ اور مفتی زاہد علی صاحب کے پاس ہے۔
                </p>
                <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 text-center font-mono text-[9px] text-emerald-900 italic">
                  * M Hashir Online Quranic Desk
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= Printable Report Card Modal (Our automatic Parent PDF output simulator) ================= */}
      <AnimatePresence>
        {showReportModal && selectedReportStudent && (
          <div className="fixed inset-0 bg-transparent/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full border-t-8 border-emerald-900 relative"
            >
              {/* Header inside modal */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-emerald-990 tracking-wide uppercase">
                    M Hashir Quran Academy Academic Report
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    System Generated Weekly Progress log report card
                  </p>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-slate-600 font-bold p-1 rounded border hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close Card
                </button>
              </div>

              {/* Printable Body Part */}
              <div id="printable-report-body" className="space-y-6 mt-4 text-xs select-text">
                <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border">
                  <div>
                    <p className="text-gray-400 font-bold text-[9px] uppercase font-mono">Student Details</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{selectedReportStudent.name}</p>
                    {selectedReportStudent.fatherName && (
                      <p className="text-slate-650 text-[11px] font-semibold">Father / والد: <span className="font-extrabold text-[#0a4a2e]">{selectedReportStudent.fatherName}</span></p>
                    )}
                    <p className="text-slate-500">Course: {coursesMap[selectedReportStudent.courseId as keyof typeof coursesMap]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 font-bold text-[9px] uppercase font-mono">Weekly Period</p>
                    <p className="text-sm font-bold text-emerald-800 mt-1">June 2026 Season</p>
                    <p className="text-slate-500 font-mono">Guardian: {selectedReportStudent.parentEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border p-3.5 rounded-lg">
                    <h5 className="font-bold text-[#0a4a2e] uppercase tracking-wider mb-2 font-mono text-[10px]">Tajweed Performance Rating</h5>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((stIdx) => (
                        <Star key={stIdx} className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ))}
                      <span className="text-sm font-bold text-gray-800 ml-2">Excellent (Level 5)</span>
                    </div>
                    <p className="text-slate-500 mt-2 text-[11px] leading-relaxed">
                      Recites the difficult throat Arabic articulation points with proper air friction and nasal duration.
                    </p>
                  </div>

                  <div className="border p-3.5 rounded-lg">
                    <h5 className="font-bold text-[#0a4a2e] uppercase tracking-wider mb-2 font-mono text-[10px]">Academic Attendance</h5>
                    <p className="text-xl font-bold text-emerald-800 leading-tight">
                      {selectedReportStudent.attendance.filter(a => a.status === 'present').length} out of {selectedReportStudent.attendance.length} Sessions Present
                    </p>
                    <p className="text-slate-500 mt-1 text-[11px]">
                      Regularly punctuality translates to high memorization retainment rates. Beautiful performance!
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 border-b pb-1 text-sm">Detailed Learning Records</h4>
                  <div className="mt-2.5 divide-y border-t border-b">
                    {selectedReportStudent.progress.map((pr, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between gap-4">
                        <div>
                          <p className="font-bold text-emerald-990">{pr.surah} (Ayat {pr.startAyat}-{pr.endAyat})</p>
                          <p className="text-slate-500 italic mt-1 font-sans">"{pr.masteryNotes}"</p>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 font-mono">{pr.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seal signature alignment */}
                <div className="flex justify-between items-center pt-6 border-t font-serif">
                  <div className="text-center">
                    <div className="w-24 h-5 border-b border-gray-400 mx-auto" />
                    <p className="text-[9px] text-gray-450 mt-1 uppercase font-bold tracking-widest">Mufti Zahid Ali</p>
                    <p className="text-[8px] text-gray-400 italic">Academy Chairman & Tutor seal</p>
                  </div>
                  <div className="text-center text-emerald-950 font-display font-medium text-[11px] border border-emerald-900/20 px-3 py-1 bg-emerald-50 rounded">
                    ⭐ OFFIClAL REPORT SEAL APPROVED
                  </div>
                </div>
              </div>

              {/* Print and Close controls */}
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-emerald-950 hover:bg-emerald-900 text-amber-500 p-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow border border-amber-500/20"
                >
                  <Download className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Finished Reviewing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
