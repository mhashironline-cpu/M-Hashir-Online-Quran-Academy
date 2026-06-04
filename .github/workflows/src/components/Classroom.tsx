/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, BookOpen, 
  Send, MessageSquare, PhoneOff, Award, Sparkles, Navigation, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassroomProps {
  studentId: string;
  studentName: string;
  courseId: string;
  userRole: 'teacher' | 'student' | 'admin' | 'parent';
  onExit: () => void;
  onRecordProgress?: (payload: { surah: string; startAyat: number; endAyat: number; rating: number; masteryNotes: string }) => void;
}

interface ChatMsg {
  sender: string;
  senderRole: string;
  text: string;
  time: string;
}

const quranLessons = {
  "noorani": [
    { title: "Noorani Qaida Lesson 1: Arabic Letters", verses: ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص"] },
    { title: "Noorani Qaida Lesson 4: Joint Forms", verses: ["لا", "بل", "تم", "جت", "خق", "سع", "ضط", "ظع", "غف", "قك", "من", "وه"] }
  ],
  "tajweed": [
    { title: "Surah Al-Fatiha", verses: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
    ] }
  ],
  "hifz": [
    { title: "Surah Al-Burush", verses: [
      "وَالسَّمَاءِ ذَاتِ الْبُرُوجِ",
      "وَالْيَوْمِ الْمَوْعُودِ",
      "وَشَاهِدٍ وَمَشْهُودٍ",
      "قُتِلَ أَصْحَابُ الْأُخْدُودِ",
      "النَّارِ ذَاتِ الْوَقُودِ"
    ] }
  ],
  "studies": [
    { title: "Prophetic Adhkar & Daily Duas", verses: [
      "Dua before sleeping: 'Bismika Allahumma Amutu wa Ahya'",
      "Dua before eating: 'Bismillahi wa 'ala Barakatillah'",
      "Makhraj Rule: Pronounce high throat letters like Ghayn and Khaa heavily."
    ] }
  ]
};

export default function Classroom({ studentId, studentName, courseId, userRole, onExit, onRecordProgress }: ClassroomProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(true); // default to shared Quran page view
  const [activeTab, setActiveTab] = useState<'board' | 'chat'>('board');
  
  // Interactive Quran boards
  const lessons = quranLessons[courseId as keyof typeof quranLessons] || quranLessons.noorani;
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [highlightedVerseIdx, setHighlightedVerseIdx] = useState<number | null>(0);
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([
    { sender: 'Mufti Zahid Ali', senderRole: 'teacher', text: 'Assalamu Alaikum Tariq, let us start today\'s session with great focus. Please look over the joint letter symbols.', time: '10:30' },
    { sender: studentName, senderRole: 'student', text: 'Wa Alaikum Assalam teacher, I have practiced my lesson 5 times since yesterday!', time: '10:31' }
  ]);

  // Lesson submission state for teacher view
  const [submitSurah, setSubmitSurah] = useState('');
  const [submitStartAyat, setSubmitStartAyat] = useState(1);
  const [submitEndAyat, setSubmitEndAyat] = useState(7);
  const [submitRating, setSubmitRating] = useState(5);
  const [submitNotes, setSubmitNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProgressSuccessMsg, setShowProgressSuccessMsg] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMsg = {
      sender: userRole === 'teacher' ? 'Mufti Zahid Ali' : studentName,
      senderRole: userRole,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulated Teacher AI responses if user is student
    if (userRole === 'student') {
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          sender: 'Mufti Zahid Ali',
          senderRole: 'teacher',
          text: `MashaAllah student! Excellent pronunciation. Keep reciting the highlighted letter block!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  const handleProgressSubmit = () => {
    if (!submitSurah) return;
    setIsSubmitting(true);
    if (onRecordProgress) {
      onRecordProgress({
        surah: submitSurah,
        startAyat: submitStartAyat,
        endAyat: submitEndAyat,
        rating: submitRating,
        masteryNotes: submitNotes
      });
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setShowProgressSuccessMsg(true);
      setSubmitNotes('');
      setTimeout(() => setShowProgressSuccessMsg(false), 3000);
    }, 1200);
  };

  const activeLesson = lessons[activeLessonIdx] || lessons[0];

  return (
    <div id="classroom-viewport" className="min-h-screen bg-slate-900 text-white flex flex-col font-sans p-1 sm:p-4">
      {/* Top Banner */}
      <div className="bg-emerald-950 p-3 sm:p-4 rounded-xl border border-amber-500/20 mb-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-900 flex items-center justify-center text-amber-400 border border-amber-500/30">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                LIVE 1-ON-1 CLASSROOM
              </span>
              <span className="text-[11px] text-gray-300 font-mono">
                WebRTC Secure Bridge
              </span>
            </div>
            <h1 className="text-sm sm:text-lg font-bold text-amber-300">
              Student: {studentName} • Course: {courseId.toUpperCase()} Reference
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-[10px] text-gray-300 uppercase font-bold">Acting Role</p>
            <p className="text-xs text-amber-400 font-medium capitalize font-mono">
              {userRole} view portal
            </p>
          </div>
          <button
            onClick={onExit}
            className="bg-red-650 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-red-500"
          >
            <PhoneOff className="w-4 h-4" /> Exit Class
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Aspect: Video Feeds & Layout Control */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Webcams Container (WebRTC stream view mockup) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Teacher Webcam Box */}
            <div className="relative aspect-video rounded-xl bg-slate-800 overflow-hidden border border-emerald-500/40">
              {isVideoOn ? (
                <img
                  src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=250&fit=crop"
                  alt="Teacher Mufti Zahid Ali Cam"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-slate-950">
                  <VideoOff className="w-10 h-10 text-gray-500 mb-1" />
                  <span className="text-xs font-mono">Teacher webcam hidden</span>
                </div>
              )}
              {/* Floating label */}
              <div className="absolute bottom-2 left-2 bg-emerald-950/80 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                Mufti Zahid Ali (Tutor)
              </div>
              {/* Mic state */}
              <div className="absolute top-2 right-2 bg-slate-900/80 p-1 rounded-full border border-gray-700">
                <Mic className="w-3.5 h-3.5 text-green-400" />
              </div>
            </div>

            {/* Student Webcam Box */}
            <div className="relative aspect-video rounded-xl bg-slate-800 overflow-hidden border border-amber-500/40">
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
                {/* Visual dynamic representation of audio ripple */}
                <div className="absolute inset-x-0 bottom-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 rounded-full border border-emerald-500 animate-ping" />
                </div>
                
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
                  alt="Student Avatar Cam"
                  className="w-24 h-24 rounded-full border-2 border-emerald-500 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs text-emerald-400 mt-2 font-semibold">Tariq Mahmood</span>
                <span className="text-[10px] text-gray-400">Class Ingress Connected</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-emerald-950/80 px-2.5 py-1 rounded-md text-[10px] font-bold">
                Student Reciting
              </div>
              <div className="absolute top-2 right-2 bg-slate-900/80 p-1 rounded-full border border-gray-700">
                {isAudioOn ? (
                  <Mic className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* WebRTC Controller Bar */}
          <div className="bg-slate-800 p-4 rounded-xl border border-gray-700/60 flex items-center justify-around gap-2">
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center ${
                isAudioOn ? 'bg-emerald-900 text-amber-400 border border-amber-500/30' : 'bg-red-900/50 text-red-300 border border-red-900'
              }`}
              title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center ${
                isVideoOn ? 'bg-emerald-900 text-amber-400 border border-amber-500/30' : 'bg-red-900/50 text-red-300 border border-red-900'
              }`}
              title={isVideoOn ? "Turn off Video" : "Turn on Video"}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center ${
                isScreenSharing ? 'bg-amber-500 text-emerald-950 shadow-lg' : 'bg-slate-700 text-gray-400'
              }`}
              title="Toggle Screen Share Quran Board"
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>

          {/* Teacher Grading Panel inside Live Classroom */}
          {userRole === 'teacher' && (
            <div className="bg-emerald-950 p-4 rounded-xl border border-amber-500/20 shadow-md">
              <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Live Grading & Daily Reporter
              </h3>
              
              <div className="space-y-2 mt-2">
                <div>
                  <label className="block text-[10px] text-gray-300 uppercase font-mono mb-1">Surah / Lesson Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Surah Al-Fatiha"
                    value={submitSurah}
                    onChange={(e) => setSubmitSurah(e.target.value)}
                    className="w-full bg-emerald-900 border border-amber-500/30 text-xs rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-300 uppercase font-mono mb-1">Start Verse/Line</label>
                    <input
                      type="number"
                      value={submitStartAyat}
                      onChange={(e) => setSubmitStartAyat(Number(e.target.value))}
                      className="w-full bg-emerald-900 border border-amber-500/30 text-xs rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-300 uppercase font-mono mb-1">End Verse/Line</label>
                    <input
                      type="number"
                      value={submitEndAyat}
                      onChange={(e) => setSubmitEndAyat(Number(e.target.value))}
                      className="w-full bg-emerald-900 border border-amber-500/30 text-xs rounded p-1.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-300 uppercase font-mono mb-1">Recitation Pronouncing Rating (1-5)</label>
                  <select
                    value={submitRating}
                    onChange={(e) => setSubmitRating(Number(e.target.value))}
                    className="w-full bg-emerald-900 border border-amber-500/30 text-xs rounded p-1.5 text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Outstanding (Flawless)</option>
                    <option value={4}>⭐⭐⭐⭐ Great progress (Minor Tajweed slips)</option>
                    <option value={3}>⭐⭐⭐ Good (Needs Practice)</option>
                    <option value={2}>⭐⭐ Needs Focus on Makharij</option>
                    <option value={1}>⭐ Redo Entire lesson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-300 uppercase font-mono mb-1">Mastery notes & instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Provide Makharij tips to help parents revision at home"
                    value={submitNotes}
                    onChange={(e) => setSubmitNotes(e.target.value)}
                    className="w-full bg-emerald-900 border border-amber-500/30 text-xs rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                  />
                </div>

                <button
                  onClick={handleProgressSubmit}
                  disabled={isSubmitting || !submitSurah}
                  className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-emerald-950 text-xs py-2 rounded transition-all cursor-pointer flex items-center justify-center gap-1 mt-2 shadow-lg disabled:opacity-40"
                >
                  {isSubmitting ? "Saving log..." : "Submit Student Progress Report"}
                </button>

                <AnimatePresence>
                  {showProgressSuccessMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-900 border border-green-500 text-[11px] text-amber-300 rounded p-1.5 text-center flex items-center justify-center gap-1.5 mt-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Log synced! Available to Parent report.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>

        {/* Right Aspect: Shared Interactive Screen vs Text Chat Panel */}
        <div className="lg:col-span-8 flex flex-col bg-slate-850 rounded-xl border border-gray-700/60 overflow-hidden min-h-[400px]">
          
          {/* Top Tabs */}
          <div className="bg-slate-800 px-4 py-2 border-b border-gray-700/60 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('board')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'board' ? 'bg-emerald-900 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Interactive Quran Board
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'chat' ? 'bg-emerald-900 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Text Chat Room ({chatHistory.length})
              </button>
            </div>

            <div className="text-[11px] font-mono text-gray-400">
              Session Duration: 45 Minutes Max
            </div>
          </div>

          {/* Tab Viewports */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
            {activeTab === 'board' ? (
              <div className="space-y-4">
                {isScreenSharing ? (
                  <div>
                    {/* Upper control helper for board */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/30 mb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-ping" />
                        <span className="text-xs text-amber-300 font-bold">
                          {activeLesson.title}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {lessons.map((lesson, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveLessonIdx(idx);
                              setHighlightedVerseIdx(0);
                              if (userRole === 'teacher') {
                                setSubmitSurah(lesson.title);
                              }
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer font-sans font-medium ${
                              activeLessonIdx === idx 
                                ? 'bg-amber-500 text-slate-900 font-semibold' 
                                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                            }`}
                          >
                            Part {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-xs text-gray-400 mb-2 italic">
                      💡 Click on any letter block or verse inside the interactive stream to highlight/point for the student.
                    </div>

                    {/* Highly polished Arabic typeface display card */}
                    <div 
                      className="bg-stone-50 text-slate-950 rounded-xl p-6 shadow-inner text-center leading-loose font-serif border-4 border-emerald-900/40 min-h-[250px] flex flex-col justify-center gap-6"
                      id="quranic-board-view"
                    >
                      {courseId === 'noorani' ? (
                        /* Render as grids of Arabic characters (Qaida style) */
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                          {activeLesson.verses.map((char, index) => (
                            <button
                              key={index}
                              onClick={() => setHighlightedVerseIdx(index)}
                              className={`text-2xl sm:text-4xl py-3 border rounded-xl transition-all duration-300 cursor-pointer font-serif ${
                                highlightedVerseIdx === index
                                  ? 'bg-amber-300 border-amber-500 shadow-md font-bold scale-105 transform'
                                  : 'bg-white hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              {char}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Render as verses list (Tajweed, Hifz scroll styling) */
                        <div className="space-y-4 text-right">
                          {activeLesson.verses.map((verse, index) => (
                            <div
                              key={index}
                              onClick={() => setHighlightedVerseIdx(index)}
                              className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer text-stone-900 text-sm sm:text-xl font-medium font-serif leading-loose ${
                                highlightedVerseIdx === index
                                  ? 'bg-amber-200 border-amber-500 font-bold text-slate-950'
                                  : 'hover:bg-amber-50 border-stone-200/50'
                              }`}
                            >
                              <span className="inline-block bg-slate-900 text-amber-300 rounded-full w-5 h-5 text-center text-[10px] leading-5 mr-3 align-middle font-mono font-bold">
                                {index + 1}
                              </span>
                              {verse}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sync indicator */}
                    <p className="text-[11px] text-gray-400 mt-3 text-center flex items-center justify-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Interactive cursor synchronized with student view
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-slate-800 rounded-xl border border-dashed border-gray-650 min-h-[300px]">
                    <Monitor className="w-12 h-12 text-gray-500 animate-bounce mb-3" />
                    <p className="text-sm font-semibold text-gray-300">Quran Board Shared Screen is Off</p>
                    <p className="text-xs text-gray-400 text-center mt-1">Activate the Shared Screen monitor button below to begin displaying lessons.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Class Live Chat Box View */
              <div className="flex-1 flex flex-col justify-between h-[400px]">
                <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-1">
                  {chatHistory.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.senderRole === userRole ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`flex flex-col max-w-[80%]`}>
                        <div className="flex gap-1.5 items-end mb-0.5 justify-between">
                          <span className="text-[10px] text-gray-400 uppercase font-bold">{m.sender}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{m.time}</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl text-xs sm:text-sm ${
                            m.senderRole === userRole 
                              ? 'bg-emerald-900 text-white rounded-tr-none border border-emerald-800'
                              : 'bg-slate-850 text-gray-200 rounded-tl-none border border-gray-700'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-2 border-t border-gray-700/60 pt-3">
                  <input
                    type="text"
                    placeholder="Type lesson questions..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                    className="flex-1 bg-slate-800 border border-gray-650 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-white"
                  />
                  <button
                    onClick={handleSendChat}
                    className="bg-amber-500 hover:bg-amber-600 text-emerald-950 p-2 text-xs rounded-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
