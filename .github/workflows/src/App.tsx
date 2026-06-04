/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, LogIn, LayoutDashboard, Globe, ShieldAlert, CheckCircle, 
  HelpCircle, RefreshCw, PhoneCall, Layers, Award, Sparkles, AlertCircle, 
  BookOpen, Heart, Users, MessageSquare, BookOpenText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PublicPages from './components/PublicPages';
import DashboardPortal from './components/DashboardPortal';
import Classroom from './components/Classroom';
import AIChatbot from './components/AIChatbot';
import { AcademyState, Student } from './types';

// Root state initialization with safe empty defaults for fallback
const defaultDB: AcademyState = {
  teachers: [],
  students: [],
  announcements: [],
  invoices: []
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'why' | 'courses' | 'admission' | 'blog' | 'contact'>('home');
  const [isClassroomActive, setIsClassroomActive] = useState(false);
  
  // Dashboard states
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [dashboardRole, setDashboardRole] = useState<'admin' | 'teacher' | 'student' | 'parent'>('admin');
  
  // Active selected student for classroom loading metrics
  const [activeClassroomStudent, setActiveClassroomStudent] = useState<{ id: string; name: string; courseId: string }>({
    id: "s_tariq",
    name: "Tariq Mahmood",
    courseId: "tajweed"
  });

  // DB Sync state
  const [dbState, setDbState] = useState<AcademyState>(defaultDB);
  const [dbLoading, setDbLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'connecting' | 'error'>('connecting');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Fetch complete database state
  const fetchDB = async () => {
    try {
      setSyncStatus('connecting');
      const response = await fetch('/api/db');
      if (!response.ok) throw new Error("Database failed to respond");
      const data = await response.json();
      setDbState(data);
      setSyncStatus('synced');
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchDB();
  }, []);

  // Sync any actions to Express/JSON db asynchronously and update local state
  const handleAction = async (type: string, payload: any) => {
    try {
      setSyncStatus('connecting');
      
      const response = await fetch('/api/db/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload })
      });

      if (!response.ok) throw new Error("Action dispatch failed");
      const result = await response.json();
      
      if (result.success && result.db) {
        setDbState(result.db);
        setSyncStatus('synced');
        
        // Trigger alert notification
        let notify = "Action successfully synchronized!";
        if (type === "REGISTER_STUDENT") {
          notify = `New application submitted for student: ${payload.name}! Check Admin Panel.`;
        } else if (type === "APPROVE_STUDENT") {
          notify = "Student application approved as Active scholar slot.";
        } else if (type === "ADD_ANNOUNCEMENT") {
          notify = `Notice broadcasted successfully: "${payload.title}"!`;
        } else if (type === "RECORD_PROGRESS") {
          notify = `Recitation log saved successfully for today.`;
        } else if (type === "MARK_INVOICE_PAID") {
          notify = `Invoice successfully marked PAID.`;
        } else if (type === "ADD_BOOK") {
          notify = `کتاب کامیابی سے کتب خانے میں شامل کر دی گئی ہے: "${payload.title}"`;
        } else if (type === "DELETE_BOOK") {
          notify = `کتاب کامیابی سے کتب خانے سے خارج کر دی گئی ہے۔`;
        }
        
        setNotificationMsg(notify);
        setTimeout(() => setNotificationMsg(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const handleLaunchClassroom = (studentId: string, name: string, courseId: string) => {
    setActiveClassroomStudent({ id: studentId, name, courseId });
    setIsClassroomActive(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between selection:bg-brand-emerald-500/30 selection:text-brand-emerald-900">
      
      {/* Real-time system notifications popup banners */}
      <AnimatePresence>
        {notificationMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-24 right-4 sm:right-6 z-[200] sleek-dark-card text-brand-gold-100 px-5 py-3.5 shadow-2xl flex items-center gap-2.5 max-w-sm"
          >
            <CheckCircle className="w-5 h-5 text-brand-gold-500 shrink-0 animate-pulse" />
            <div>
              <p className="font-extrabold uppercase text-[10px] tracking-widest text-[#e3a817]">Academy Alert</p>
              <p className="mt-0.5 leading-snug text-xs">{notificationMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database connection status monitor bar */}
      <div id="development-health-header" className="bg-[#042e1c] text-[10px] text-gray-300 py-2 px-4 flex justify-between items-center sm:px-6 font-mono no-print md:text-[11px] border-b border-[#e3a817]/20 relative">
        <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#e3a817]/40 to-transparent" />
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-brand-gold-500" />
          <span>Academy Master Session: <strong className="text-brand-gold-500">mhashironline@gmail.com</strong></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full inline-block ${
              syncStatus === 'synced' ? 'bg-green-500 animate-pulse' : syncStatus === 'connecting' ? 'bg-amber-500 animate-spin' : 'bg-red-500'
            }`} />
            <span className="capitalize text-gray-300">Sync: {syncStatus}</span>
          </div>
          <button
            onClick={fetchDB}
            className="hover:text-brand-gold-500 transition-colors flex items-center gap-1 cursor-pointer"
            title="Force refresh database status"
          >
            <RefreshCw className="w-3 h-3" /> reload
          </button>
        </div>
      </div>

      {/* Top Banner Branding / Header Navigation */}
      <header id="main-academy-header" className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-[60] no-print px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand Emblem with Cinzel serif display typography */}
          <div 
            onClick={() => {
              setIsDashboardActive(false);
              setIsClassroomActive(false);
              setActiveTab('home');
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0a4a2e] to-[#042e1c] flex items-center justify-center text-[#e3a817] font-display font-extrabold text-lg border border-[#e3a817]/40 shadow-md transform group-hover:scale-105 transition-all">
              🕌
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] bg-[#eefdf6] text-brand-emerald-800 border border-brand-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Global Academics</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight font-display text-[#0a4a2e] group-hover:text-brand-emerald-500 transition-colors">
                M Hashir Online Quran Academy
              </h1>
            </div>
          </div>

          {/* Menus and CTAs Router */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            {!isDashboardActive && !isClassroomActive && (
              <nav className="flex items-center gap-1 sm:gap-2 font-sans text-xs font-semibold text-slate-650">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'home' ? 'text-brand-emerald-900 bg-brand-emerald-50 border border-brand-emerald-500/10 font-bold' : 'hover:text-[#0a4a2e] hover:bg-slate-50'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'about' ? 'text-brand-emerald-900 bg-brand-emerald-50 border border-brand-emerald-500/10 font-bold' : 'hover:text-[#0a4a2e] hover:bg-slate-50'}`}
                >
                  About Scholars
                </button>
                <button
                  onClick={() => setActiveTab('why')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'why' ? 'text-brand-emerald-900 bg-brand-emerald-50 border border-brand-emerald-500/10 font-bold' : 'hover:text-[#0a4a2e] hover:bg-slate-50'}`}
                >
                  Why Us
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'courses' ? 'text-brand-emerald-900 bg-brand-emerald-50 border border-brand-emerald-500/10 font-bold' : 'hover:text-[#0a4a2e] hover:bg-slate-50'}`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'blog' ? 'text-brand-emerald-900 bg-brand-emerald-50 border border-brand-emerald-500/10 font-bold' : 'hover:text-[#0a4a2e] hover:bg-slate-50'}`}
                >
                  Islamic Blog
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'contact' ? 'text-brand-emerald-900 bg-brand-emerald-50 border border-brand-emerald-500/10 font-bold' : 'hover:text-[#0a4a2e] hover:bg-slate-50'}`}
                >
                  Contact Us
                </button>
              </nav>
            )}

            {/* Prominent WhatsApp Support Button */}
            <a
              href="https://wa.me/923430603445"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1dba52] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all outline-none"
              title="Get Direct Live Support on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              WhatsApp Support
            </a>

            {/* Quick Portals control block (Tester panel) */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3.5 mt-2 md:mt-0">
              {isDashboardActive || isClassroomActive ? (
                /* Back to public visitor site CTA */
                <button
                  onClick={() => {
                    setIsDashboardActive(false);
                    setIsClassroomActive(false);
                    setActiveTab('home');
                  }}
                  className="bg-transparent hover:bg-slate-50 text-[#0a4a2e] border border-slate-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:border-slate-350"
                >
                  <Globe className="w-4 h-4" /> Guest visitor site
                </button>
              ) : (
                /* Enter administrative portals dropdown selection */
                <button
                  onClick={() => {
                    setIsDashboardActive(true);
                  }}
                  className="bg-gradient-to-r from-brand-emerald-900 to-brand-emerald-950 hover:from-brand-emerald-800 hover:to-brand-emerald-900 text-brand-gold-100 font-bold text-xs px-4 py-2 rounded-xl border border-brand-gold-500/25 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-gold-500" /> Portals Dashboard Login
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Action / Supervisor Actor panel visible globally only if Dashboard is active */}
      <AnimatePresence>
        {isDashboardActive && !isClassroomActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#fef8e7] border-b border-[#e3a817]/30 p-3.5 text-xs flex flex-col md:flex-row justify-between items-center px-6 sm:px-12 shadow-inner no-print gap-3"
            id="actor-switch-panel"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500 inline-block animate-ping" />
              <span className="font-extrabold text-[#0a4a2e] uppercase font-mono tracking-wider">
                PORTAL INTERACTIVE DEMO ACCELERATOR:
              </span>
              <span className="text-slate-700">Experience user-specific screens with state authorization instantly.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setDashboardRole('admin')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer font-bold uppercase ${
                  dashboardRole === 'admin' 
                    ? 'bg-gradient-to-r from-brand-emerald-900 to-brand-emerald-950 text-brand-gold-100 border-brand-gold-500 scale-105 shadow-sm' 
                    : 'bg-white text-gray-800 border-slate-200 hover:bg-slate-55 hover:border-slate-300'
                }`}
              >
                SuperAdmin
              </button>
              <button
                onClick={() => setDashboardRole('teacher')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer font-bold uppercase ${
                  dashboardRole === 'teacher' 
                    ? 'bg-gradient-to-r from-brand-emerald-900 to-brand-emerald-950 text-brand-gold-100 border-brand-gold-500 scale-105 shadow-sm' 
                    : 'bg-white text-gray-800 border-slate-200 hover:bg-slate-55 hover:border-slate-300'
                }`}
              >
                Teacher
              </button>
              <button
                onClick={() => setDashboardRole('student')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer font-bold uppercase ${
                  dashboardRole === 'student' 
                    ? 'bg-gradient-to-r from-brand-emerald-900 to-brand-emerald-950 text-brand-gold-100 border-brand-gold-500 scale-105 shadow-sm' 
                    : 'bg-white text-gray-800 border-slate-200 hover:bg-slate-55 hover:border-slate-300'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setDashboardRole('parent')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] sm:text-xs tracking-wider transition-all cursor-pointer font-bold uppercase ${
                  dashboardRole === 'parent' 
                    ? 'bg-gradient-to-r from-brand-emerald-900 to-brand-emerald-950 text-brand-gold-100 border-brand-gold-500 scale-105 shadow-sm' 
                    : 'bg-white text-gray-800 border-slate-200 hover:bg-slate-55 hover:border-slate-300'
                }`}
              >
                Parents Portal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Main body container */}
      <main className="flex-1 py-6">
        
        {dbLoading ? (
          /* Loading overlay in sleek layout style */
          <div className="flex flex-col items-center justify-center p-24 text-center space-y-4 font-sans max-w-md mx-auto my-12 sleek-card">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-brand-gold-500/20 border-t-brand-emerald-800 rounded-full animate-spin" />
              <span className="absolute text-lg">🕌</span>
            </div>
            <h3 className="font-extrabold text-[#0a4a2e] text-sm sm:text-base tracking-tight font-display">M Hashir Quran Academy Database syncing...</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Wait while we fetch authorized tables, certified scholar profiles, and scheduled recitation logs securely.</p>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              
              {/* 1. If actively inside in-app virtual WebRTC classroom */}
              {isClassroomActive ? (
                <motion.div
                  key="active-classroom"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Classroom
                    studentId={activeClassroomStudent.id}
                    studentName={activeClassroomStudent.name}
                    courseId={activeClassroomStudent.courseId}
                    userRole={dashboardRole}
                    onExit={() => setIsClassroomActive(false)}
                    onRecordProgress={(payload) => handleAction("RECORD_PROGRESS", { studentId: activeClassroomStudent.id, ...payload })}
                  />
                </motion.div>
              ) : isDashboardActive ? (
                /* 2. Advanced Multi-User Dashboard System */
                <motion.div
                  key="dashboard-portal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <DashboardPortal
                    dbState={dbState}
                    userRole={dashboardRole}
                    onAction={handleAction}
                    onEnterClass={handleLaunchClassroom}
                  />
                </motion.div>
              ) : (
                /* 3. Core Pages & Public Frontend */
                <motion.div
                  key="public-front"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <PublicPages
                    activeTab={activeTab}
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      // scroll to top
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onSubmitAdmission={(payload) => handleAction("REGISTER_STUDENT", payload)}
                    teachers={dbState.teachers}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}

      </main>

      {/* Integrated AI Float Chatbot widget (Corner helper) */}
      {!isClassroomActive && (
        <AIChatbot 
          onOpenAdmission={() => {
            setIsDashboardActive(false);
            setActiveTab('admission');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      )}

      {/* Footer view */}
      <footer id="main-academy-footer" className="bg-[#052818] text-white border-t border-amber-500/20 py-12 px-6 sm:px-12 mt-16 no-print">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-amber-300 text-base">📚 M Hashir Quran Academy</h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
              Authentic online recitation programs led by certified, highly experienced Qaris who have completed proper Tajweed courses and possess extensive teaching experience.
            </p>
            <p className="text-[10px] text-gray-400 font-mono">
              Designed dynamically with built-in WebRTC classroom structures and supervisor indicators.
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs text-emerald-100">
            <h4 className="font-display font-bold text-amber-300">Quick Portal Shortcuts</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setIsDashboardActive(true); setDashboardRole('admin'); }} className="text-left hover:underline cursor-pointer">1. SuperAdmin Console login</button>
              <button onClick={() => { setIsDashboardActive(true); setDashboardRole('teacher'); }} className="text-left hover:underline cursor-pointer">2. Tutor Live Schedule dashboard</button>
              <button onClick={() => { setIsDashboardActive(true); setDashboardRole('student'); }} className="text-left hover:underline cursor-pointer">3. Pupils Classroom log timelines</button>
              <button onClick={() => { setIsDashboardActive(true); setDashboardRole('parent'); }} className="text-left hover:underline cursor-pointer">4. Parents Progress & Billing portal</button>
            </div>
          </div>

          <div className="space-y-3 font-sans text-xs text-emerald-100">
            <h4 className="font-display font-bold text-amber-300">Worldwide Support</h4>
            <p className="leading-snug">Connect directly with Mufti Zahid Ali's desk regarding classes or trial timings:</p>
            <div className="pt-2">
              <a
                href="https://wa.me/923430603445"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-[#25D366] text-white font-bold p-2 px-4 rounded hover:bg-[#1dba52] transition-colors items-center gap-1.5"
              >
                Chat on WhatsApp (+92 343 0603445)
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-emerald-900 mt-10 pt-6 text-center text-[11px] text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 M Hashir Online Quran Academy. All Islamic Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Charter</a>
            <a href="#terms" className="hover:underline">Tuition Agreement</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
