/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, Shield, Award, Users, BookOpen, Clock, Heart, PhoneCall, 
  MapPin, Mail, ChevronRight, CheckCircle, ExternalLink, Play, Sparkles, UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, Teacher } from '../types';
import { blogsData, BlogArticle } from '../blogsData';
import InteractiveLibrary from './InteractiveLibrary';

interface PublicPagesProps {
  activeTab: 'home' | 'about' | 'why' | 'courses' | 'admission' | 'blog' | 'contact';
  onNavigate: (tab: 'home' | 'about' | 'why' | 'courses' | 'admission' | 'blog' | 'contact') => void;
  onSubmitAdmission: (payload: any) => void;
  teachers: Teacher[];
}

export default function PublicPages({ activeTab, onNavigate, onSubmitAdmission, teachers }: PublicPagesProps) {
  // Contact Us state
  const [conName, setConName] = useState('');
  const [conMail, setConMail] = useState('');
  const [conMsg, setConMsg] = useState('');
  const [showConScs, setShowConScs] = useState(false);

  // Dynamic Interactive Library/Reader State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryDefaultTab, setLibraryDefaultTab] = useState<'qaida' | 'quran'>('qaida');

  // Admission local states
  const [admName, setAdmName] = useState('');
  const [admFatherName, setAdmFatherName] = useState('');
  const [admEmail, setAdmEmail] = useState('');
  const [admParent, setAdmParent] = useState('');
  const [admWhatsApp, setAdmWhatsApp] = useState('');
  const [admAge, setAdmAge] = useState('');
  const [admCourse, setAdmCourse] = useState('tajweed');
  const [admTimezone, setAdmTimezone] = useState('GMT+1 (London)');
  const [showAdmScs, setShowAdmScs] = useState(false);

  // Selected Blog state
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);

  const coursesList: Course[] = [
    {
      id: "noorani",
      title: "Noorani Qaida for Beginners",
      level: "Preschool to Adult Beginners",
      description: "Master Arabic letters shapes, joint combinations, and phonetic sounds using the gold-standard colored Noorani Qaida layout.",
      duration: "3-4 Months duration",
      syllabus: ["Arabic alphabet phonetic recognition", "Joint compound syllable shapes", "Harakaat (Short vowels)", "Tanween and Sukoon symbols Layout", "Makharij (Vocal points) fundamentals"],
      image: "https://images.unsplash.com/photo-1544856890-e72c830c2790?w=500&q=80"
    },
    {
      id: "tajweed",
      title: "Quran Reading with Tajweed",
      level: "Intermediate Readers",
      description: "Master beautiful classical recitation rules. Apply Ghunnah nasal codes, Madd elongation intervals, heavy letters, and pronunciation stops.",
      duration: "6-8 Months duration",
      syllabus: ["Tajweed Rules and Articulation", "Heavy vs Light letters sounds", "Elongated vowels (Madd duration rules)", "Quiet Letter silent junctions", "Waqf / Stop indicators inside verse structures"],
      image: "https://images.unsplash.com/photo-1609599006353-e629f1d00f18?w=500&q=80"
    },
    {
      id: "hifz",
      title: "Quran Memorization (Hifz)",
      level: "Advanced Learners",
      description: "Become a Hafiz of the Holy Quran from home. Tailored learning paces with classical SABAQ and Daily revision schedules.",
      duration: "Self-Paced (2-4 Years)",
      syllabus: ["Daily Sabaq (New verse memorization)", "Sabqi (Reciting recent memorizations)", "Classically structured daily MANZIL revision", "Spaced memory retention techniques", "Full Tajweed adherence during speed reading"],
      image: "https://images.unsplash.com/photo-1584281729155-3c10f3c524e1?w=500&q=80"
    },
    {
      id: "studies",
      title: "Islamic Studies and Manners",
      level: "All ages (Highly loved by kids)",
      description: "Learn essential daily Sunnah Duas, Islamic stories of prophets, Fiqh of prayer, and moral character guidance.",
      duration: "Ongoing structured modules",
      syllabus: ["Islamic Daily Duas and Azkhar", "Method of Wudu and Prayer (Salah)", "Prophets Seerah and biographies", "Islamic moral ethics (Akhlaq)", "Basic Hadith memorizations and Tafseer summaries"],
      image: "https://images.unsplash.com/photo-1610444321872-df3dB8c9760c?w=500&q=80"
    }
  ];

  const handlePostAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admName || !admParent || !admWhatsApp) return;
    
    onSubmitAdmission({
      name: admName,
      fatherName: admFatherName,
      email: admEmail,
      parentEmail: admParent,
      whatsapp: admWhatsApp,
      age: admAge,
      courseId: admCourse,
      timezone: admTimezone
    });

    setAdmName('');
    setAdmFatherName('');
    setAdmEmail('');
    setAdmParent('');
    setAdmWhatsApp('');
    setAdmAge('');
    setShowAdmScs(true);
    setTimeout(() => setShowAdmScs(false), 8000);
  };

  const handlePostContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conName || !conMsg) return;
    setShowConScs(true);
    setConName('');
    setConMail('');
    setConMsg('');
    setTimeout(() => setShowConScs(false), 4000);
  };

  return (
    <div id="public-main-content">
      <AnimatePresence mode="wait">
        
        {/* ================= HOME VIEWPORT ================= */}
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-16"
          >
            {/* Majestic Hero Banner */}
            <section className="relative overflow-hidden sleek-dark-card py-20 lg:py-28 text-white mx-4 sm:mx-6">
              {/* Islamic background geometric subtle visual representation */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold-500/15 via-brand-emerald-950 to-brand-emerald-950 opacity-95" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-brand-emerald-800/30 blur-3xl animate-pulse" />
              <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold-500/50 to-transparent" />
              
              <div className="relative max-w-5xl mx-auto px-6 text-center space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold-500/15 text-brand-gold-500 border border-brand-gold-500/30">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Globally Accessible 1-on-1 Classes Open 24/7
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-brand-gold-500 leading-tight">
                  M Hashir Online <br />
                  <span className="text-white">Quran Academy</span>
                </h1>

                <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-sans font-light">
                  Learn to recite and memorize the Holy Quran with authentic Tajweed rules from the safety of your home. Guided by certified Qaris who have completed proper Tajweed courses and possess extensive teaching experience.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => onNavigate('admission')}
                    className="w-full sm:w-auto sleek-btn-gold px-8 py-4 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    Start 3-Day Free Trial <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('courses')}
                    className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-slate-200 hover:text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/20 hover:border-brand-gold-500/40 duration-350 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    Examine Our Courses
                  </button>

                  <button
                    onClick={() => {
                      setLibraryDefaultTab('qaida');
                      setIsLibraryOpen(true);
                    }}
                    className="w-full sm:w-auto bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-extrabold px-8 py-4 rounded-xl transition-all border border-emerald-800/30 duration-350 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95"
                  >
                    📖 Read Online (یہیں سے پڑھیں)
                  </button>
                </div>

                {/* Stat flags for transparency */}
                <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-left">
                  <div>
                    <p className="text-2xl font-bold text-brand-gold-500 font-mono">100%</p>
                    <p className="text-[10px] text-emerald-300/80 uppercase tracking-widest font-mono font-bold">1-on-1 Focus</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-gold-500 font-mono">24/7</p>
                    <p className="text-[10px] text-emerald-300/80 uppercase tracking-widest font-mono font-bold">Flexible Schedules</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-gold-500 font-mono">Female</p>
                    <p className="text-[10px] text-emerald-300/80 uppercase tracking-widest font-mono font-bold">Tutors Available</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-gold-500 font-mono">In-App</p>
                    <p className="text-[10px] text-emerald-300/80 uppercase tracking-widest font-mono font-bold">WebRTC Classroom</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Introduction & Vision section */}
            <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#eefdf6] text-brand-emerald-800 rounded-xl flex items-center justify-center border border-brand-emerald-500/20 shadow-sm">
                  <Award className="w-6 h-6 text-[#0a4a2e]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0a4a2e] tracking-tight font-display">
                  Sincere Prophetic Guidance & High Tajweed Standard
                </h3>
                <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans">
                  Under the scholarly guidance of <strong>Mufti Zahid Ali</strong> (distinguished Alim graduate from Jamia Darul Uloom Karachi under Mufti Taqi Usmani), our academy bridges technical modernization with deep-rooted classical methodologies. We avoid pre-recorded lessons, coupling your child with certified tutors in in-app interactive video classrooms directly in their browser.
                </p>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Whether starting from letters phonetics (Noorani Qaida) or targeting complete memorization (Hifz), we track progress parameters beautifully with dedicated parent dashboards.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => onNavigate('about')}
                    className="text-brand-emerald-800 hover:text-brand-emerald-900 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer hover:underline transition-all"
                  >
                    Read about our Scholars Bios <ChevronRight className="w-4 h-4 text-brand-gold-500" />
                  </button>
                </div>
              </div>

              {/* Styled Unsplash Holy Quran image illustrating e-learning serenity */}
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-gold-500 rounded-2xl transform rotate-3 scale-95 opacity-5 group-hover:rotate-6 transition-transform duration-300" />
                <img
                  src="https://images.unsplash.com/photo-1609599006353-e629f1d00f18?w=550&h=380&fit=crop"
                  alt="Holy Quran on desk"
                  className="rounded-2xl border border-slate-205/80 shadow-xl object-cover w-full scale-100 hover:scale-[1.01] transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            </section>

            {/* Core Values Section (Bento Box styled layout) */}
            <section className="bg-brand-emerald-50/20 p-10 py-16 rounded-3xl max-w-5xl mx-auto px-6 border border-brand-emerald-500/10 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-500/5 blur-3xl rounded-full" />
              <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#0a4a2e] font-display">Our Global E-Learning Values</h2>
                <p className="text-xs sm:text-sm text-slate-500">Built exclusively for busy Muslims worldwide seeking real academic excellence.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="sleek-card p-6 border-slate-200/50 hover:border-brand-emerald-500/25">
                  <Clock className="w-8 h-8 text-brand-gold-500 mb-3" />
                  <h4 className="font-extrabold text-xs text-[#0a4a2e] uppercase tracking-wide">24/7 Scheduling</h4>
                  <p className="text-xs text-slate-500 mt-2">Pick hours that match school times. USA, UK, Canada, UAE, and Australia slots available.</p>
                </div>

                <div className="sleek-card p-6 border-slate-200/50 hover:border-brand-emerald-500/25">
                  <Users className="w-8 h-8 text-brand-gold-500 mb-3" />
                  <h4 className="font-extrabold text-xs text-[#0a4a2e] uppercase tracking-wide">Male & Female Tutors</h4>
                  <p className="text-xs text-slate-500 mt-2">Hafizas and female scholars specifically for girls and young children to learn comfortably.</p>
                </div>

                <div className="sleek-card p-6 border-slate-200/50 hover:border-brand-emerald-500/25">
                  <Shield className="w-8 h-8 text-brand-gold-500 mb-3" />
                  <h4 className="font-extrabold text-xs text-[#0a4a2e] uppercase tracking-wide">In-Browser Video</h4>
                  <p className="text-xs text-slate-500 mt-2">Safe WebRTC classroom built inside the website. No Skype or Zoom installations needed.</p>
                </div>

                <div className="sleek-card p-6 border-slate-200/50 hover:border-brand-emerald-500/25">
                  <Heart className="w-8 h-8 text-brand-gold-500 mb-3" />
                  <h4 className="font-extrabold text-xs text-[#0a4a2e] uppercase tracking-wide">Parent Supervision</h4>
                  <p className="text-xs text-slate-500 mt-2">Live attendance tracking, progressive stars logs, and legal report cards emailed weekly.</p>
                </div>
              </div>
            </section>

            {/* Quick CTAs Box */}
            <section className="sleek-dark-card text-white p-8 sm:p-12 max-w-5xl mx-auto px-6 text-center space-y-4 relative">
              <div className="absolute top-0 left-12 w-24 h-24 bg-brand-gold-500/5 blur-3xl rounded-full" />
              <h3 className="text-2xl font-bold text-brand-gold-500 font-display">Begin Your Journey Towards Quranic Fluency</h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
                Take a 3-day free evaluation trial class. No credit card details required. Meet your assigned Male or Female Arabic tutor today!
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('admission')}
                  className="sleek-btn-gold px-7 py-3.5 text-xs cursor-pointer"
                >
                  Apply For Online Admission Form
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {/* ================= ABOUT US VIEWPORT ================= */}
        {activeTab === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-5xl mx-auto px-6 space-y-12"
          >
            <div className="border-b pb-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a4a2e] font-display">Our Mission & Academy Tutors</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Certified Islamic Scholars bringing Tajweed perfection to your household screen.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-xs sm:text-sm">
                <h3 className="font-display font-bold text-lg text-emerald-990 uppercase tracking-widest">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Prophet PBUH said: *"The best of you are those who learn the Quran and teach it."* (Sahih Al-Bukhari). At M Hashir Online Quran Academy, we believe that learning the Quran extends beyond mechanical translation; it is an active spiritual realization. 
                </p>
                <p className="text-gray-700 leading-relaxed font-sans">
                  Our objective is to serve Muslims residing across the UK, USA, Europe, Canada, Australia, and worldwide by providing authentic Arabic pronunciation and standard Tajweed methodologies, taught by certified Qaris who have completed proper Tajweed courses and possess extensive teaching experience.
                </p>

                <div className="bg-emerald-50 p-4 border rounded-xl space-y-2">
                  <p className="text-xs font-bold text-[#0a4a2e]">Our Three Pillars Academics:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-650 font-sans">
                    <li>100% Male and Female Certified Scholars exclusivity</li>
                    <li>Sincere Tajweed rules and correct Makharij from alphabets</li>
                    <li>Parent tracker dashboards for maximum transparency</li>
                  </ul>
                </div>
              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1544856890-e72c830c2790?w=550&h=300&fit=crop"
                  alt="Reading Quran on desk stands decoration shadow"
                  className="rounded-xl object-cover w-full border"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Premium Biography Block - Mufti Zahid Ali Custom Profile */}
            <div className="bg-[#eefdf6]/50 border border-brand-emerald-500/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-[#0a4a2e]/20 shadow-md shrink-0 mx-auto md:mx-0">
                  <img
                    src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&h=300&fit=crop"
                    alt="Chairman Mufti Zahid Ali Profile Portrait Layout"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <span className="text-[10px] bg-brand-gold-500 text-emerald-950 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                    Academy Chairman & Principal Scholar
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a4a2e] font-display">مفتی زاہد علی (Mufti Zahid Ali)</h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans max-w-3xl">
                    Completed 8-year Alim course (Dars-e-Nizami) from the world-famous <strong>Jamia Darul Uloom Karachi</strong> under the direct mentorship of legendary jurist <strong>Mufti Muhammad Taqi Usmani</strong>. Specialized in Islamic Jurisprudence (Takhassus fil Ifta) from <strong>Jamia Ashraf-ul-Madaris Karachi</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm pt-4 border-t border-brand-emerald-500/10">
                {/* Advanced Urdu Details */}
                <div className="space-y-3 bg-white p-5 rounded-xl border border-slate-205">
                  <h4 className="font-extrabold text-[#0a4a2e] border-b pb-1.5 flex items-center justify-between">
                    <span>مفصل علمی تعارف</span>
                    <span className="font-mono text-[10px] text-brand-gold-500 font-bold uppercase">Urdu Profile</span>
                  </h4>
                  <div className="text-slate-700 space-y-2 text-right leading-relaxed font-sans" dir="rtl">
                    <p className="font-bold text-[#0a4a2e]">مفتی زاہد علی صاحب</p>
                    <p>
                      جامعہ کے موجودہ اساتذہ نے باقاعدہ تجویدی کورس کیا ہے اور پڑھایا بھی ہے، اور وہ عالمی سطح پر سرٹیفائیڈ قراء حضرات ہیں۔ اکیڈمی کے سرپرست مفتی زاہد علی صاحب نے پاکستان کے بڑے بڑے جید علماء کرام سے استفادہ حاصل کیا ہے۔
                    </p>
                    <ul className="list-disc pr-4 space-y-1 text-[11px] text-slate-650">
                      <li><strong>دار العلوم کراچی:</strong> مفتی محمد تقی عثمانی صاحب کے ممتاز تعلیمی ادارے سے ۸ سالہ درسِ نظامی (عمدۃ العلماء) کی تکمیل۔</li>
                      <li><strong>تخصص فی الافتاء:</strong> کراچی کے مایہ ناز ادارے جامعہ اشرف المدارس سے افتاء میں مہارت (سپیشلائزیشن)۔</li>
                      <li><strong>ایم فل و پی ایچ ڈی:</strong> عبد الولی خان یونیورسٹی مردان سے اسلامی علوم میں ایم فل کی ڈگری مکمل کی اور تاحال پی ایچ ڈی جاری ہے۔</li>
                      <li><strong>تجویدی و قرآنی اسناد:</strong> باقاعدہ ایک سالہ تجویدی سرٹیفائیڈ کورس اور نورانی قاعدہ کا ممتاز فریم ورک سرٹیفائیڈ کورس۔</li>
                      <li><strong>مختلف تربیتی کورسز:</strong> اسلامی بینک کاری، اسلامک فائنانس، مختلف تفسیری کورسز، اور فقہی مذاہب کے خصوصی شارٹ کورسز۔</li>
                      <li><strong>عالمی ذمہ داری:</strong> ایک بین الاقوامی / عالمی علمی وبھائی ادارے کے چیئرمین کی حیثیت سے خدمات انجام دے رہے ہیں۔</li>
                    </ul>
                  </div>
                </div>

                {/* Academic Highlights & English Details */}
                <div className="space-y-3 bg-white p-5 rounded-xl border border-slate-205">
                  <h4 className="font-extrabold text-[#0a4a2e] border-b pb-1.5 flex items-center justify-between">
                    <span>Academic Qualifications & Directives</span>
                    <span className="font-mono text-[10px] text-brand-gold-500 font-bold uppercase">English credentials</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#eefdf6] border border-brand-emerald-500/10 p-2.5 rounded-lg text-center">
                        <p className="text-[#0a4a2e] font-extrabold text-xs">M.Phil</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">Islamic Studies</p>
                      </div>
                      <div className="bg-[#eefdf6] border border-brand-emerald-500/10 p-2.5 rounded-lg text-center">
                        <p className="text-[#0a4a2e] font-extrabold text-xs">Ph.D (Cand.)</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">Abdul Wali Khan</p>
                      </div>
                      <div className="bg-[#eefdf6] border border-brand-emerald-500/10 p-2.5 rounded-lg text-center col-span-1">
                        <p className="text-[#0a4a2e] font-extrabold text-xs">Mufti</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">Takhassus Al-Ifta</p>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-650 font-sans list-decimal pl-4">
                      <li><strong>8-Year Specialized Alim:</strong> Completed classical curriculum from Jamia Darul Uloom Karachi under Mufti Muhammad Taqi Usmani.</li>
                      <li><strong>Specialization in Fiqh (Ifta):</strong> Certified from legendary Jamia Ashraf-ul-Madaris Karachi.</li>
                      <li><strong>Certified specialized modules:</strong> Noorani Qaida Methodologies and premium 1-Year Tajweed recitation licenses.</li>
                      <li><strong>Islamic Finance:</strong> Specialized certified structures in Islamic Banking and Fiqh of Modern Transactions.</li>
                      <li><strong>Global Leadership:</strong> Earned spiritual benefit from some of Pakistan's greatest Islamic personalities and currently leading as the active Chairman of a global religious institution.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Scholar/Teachers Registry Grid */}
            <div className="pt-8">
              <div className="text-center mb-8">
                <h3 className="text-lg sm:text-2xl font-bold text-[#0a4a2e] font-display">Certified Islamic Teachers</h3>
                <p className="text-xs text-slate-500 mt-1">Our qualified male and female tutors with certified Islamic degrees.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teachers.map((teach) => (
                  <div key={teach.id} className="bg-white border p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 mx-auto shrink-0 shadow-sm">
                        <img
                          src={teach.avatar}
                          alt={teach.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-[#0a4a2e]">{teach.name}</h4>
                        <p className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block mt-1 font-mono uppercase">{teach.qualification.split(',')[0]}</p>
                      </div>
                      <p className="text-xs text-gray-500 italic">"{teach.bio}"</p>
                    </div>

                    <div className="border-t pt-3 mt-4 text-xs space-y-1.5 text-left text-slate-700">
                      <p className="font-mono text-[10px] text-gray-400 uppercase font-bold">Experience & Courses</p>
                      <p className="font-semibold">{teach.experience}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {teach.courses.map((c, i) => (
                          <span key={i} className="text-[9px] bg-slate-150 text-slate-800 px-1.5 py-0.5 rounded uppercase font-bold font-mono">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= WHY CHOOSE US VIEWPORT ================= */}
        {activeTab === 'why' && (
          <motion.div
            key="why"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-5xl mx-auto px-6 space-y-12"
          >
            <div className="border-b pb-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a4a2e] font-display">Why Choose M Hashir Quran Academy?</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">E-Recitation platforms optimized for worldwide Muslim children and guardian parents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=550&h=300&fit=crop"
                  alt="Pupil female reciting with tutor"
                  className="rounded-2xl border flex object-cover w-full shadow"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-6 text-xs sm:text-sm">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full border border-emerald-900/15 flex items-center justify-center shrink-0 text-emerald-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a4a2e]">Expert Verified 1-on-1 Lessons</h4>
                    <p className="text-slate-500 mt-1">Pre-recorded lessons fail to adjust the complex throat vocal points. All classes are 1-on-1 live, providing absolute tutor screen access for immediate correction.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full border border-emerald-900/15 flex items-center justify-center shrink-0 text-emerald-800">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a4a2e]">Fully Flexible Timetable</h4>
                    <p className="text-slate-500 mt-1">Assign weekday slots that match after-school parameters or early morning setups. Tutors work 24/7 across US, UK, Gulf, European, and Australian timezone zones.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full border border-emerald-900/15 flex items-center justify-center shrink-0 text-emerald-800">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a4a2e]">Certified Sister Hafizas</h4>
                    <p className="text-slate-500 mt-1">We respect Islamic sensitivities. We provide dedicated certified sister Hafizas and tutor scholars for female students and younger children.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full border border-emerald-900/15 flex items-center justify-center shrink-0 text-emerald-800">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a4a2e]">No Downloads Required</h4>
                    <p className="text-slate-500 mt-1">Our secure WebRTC class platform loads directly inside the website browser. There's no risk downloading external trackers like Skype or Zoom.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= COURSES VIEWPORT ================= */}
        {activeTab === 'courses' && (
          <motion.div
            key="courses"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-5xl mx-auto px-6 space-y-12"
          >
            <div className="border-b pb-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a4a2e] font-display">Specialized Quran & Islamic Courses</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">From absolute basics of letters shapes up to memorization rules and daily prayer Fiqh.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coursesList.map((course) => (
                <div key={course.id} className="sleek-card overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 bg-brand-emerald-950 text-brand-gold-500 font-mono text-[10px] font-bold uppercase py-1 px-3 rounded border border-brand-gold-500/30">
                        {course.level}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-lg text-[#0a4a2e] font-display">{course.title}</h3>
                      <p className="text-xs text-brand-emerald-800 font-bold font-mono tracking-wide">{course.duration}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{course.description}</p>
                      
                      <div className="space-y-1 pt-3 border-t border-slate-100">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">Core Weekly Modules</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {course.syllabus.map((s, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                              <CheckCircle className="w-3.5 h-3.5 text-brand-emerald-800 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onNavigate('admission')}
                      className="flex-1 sleek-btn-emerald py-2.5 text-xs text-center cursor-pointer"
                    >
                      Book 3-Day Free Trial
                    </button>
                    {(course.id === 'noorani' || course.id === 'tajweed' || course.id === 'hifz') && (
                      <button
                        onClick={() => {
                          setLibraryDefaultTab(course.id === 'noorani' ? 'qaida' : 'quran');
                          setIsLibraryOpen(true);
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold py-2.5 rounded-xl text-xs text-center cursor-pointer shadow transition-all flex items-center justify-center gap-1.5 border border-amber-600/20 hover:scale-[1.02] active:scale-95"
                      >
                        📖 Read Online (یہیں سے پڑھیں)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= ONLINE ADMISSION VIEWPORT ================= */}
        {activeTab === 'admission' && (
          <motion.div
            key="admission"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto px-6 space-y-12"
          >
            <div className="border-b pb-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a4a2e] font-display">Student Online Admission Form</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Submit registration application below. Once submitted, candidate details instantly sync to Admin dashboards!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form guidelines side block */}
              <div className="sleek-card bg-brand-emerald-50/20 border-brand-emerald-500/10 p-5 p-6 text-xs space-y-4 shadow-sm hover:translate-y-0">
                <h3 className="font-display font-bold text-sm text-[#0a4a2e] uppercase tracking-wide border-b border-brand-emerald-500/15 pb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-emerald-800" /> Trial Procedure
                </h3>
                
                <div className="space-y-4 font-sans text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-brand-emerald-900 block font-bold mb-0.5">1. Application Submission:</strong> Fill student name, parent email address, and active WhatsApp number correctly.
                  </p>
                  <p>
                    <strong className="text-brand-emerald-900 block font-bold mb-0.5">2. Teacher Assignment:</strong> Mufti Zahid Ali's desk compiles slot schedules matching your timezone.
                  </p>
                  <p>
                    <strong className="text-brand-emerald-900 block font-bold mb-0.5">3. In-App Setup:</strong> Switch your acting dashboard role above to <strong className="font-bold underline">"Student"</strong> or <strong className="font-bold underline">"Parent"</strong> with matching emails to interact with class and invoices!
                  </p>
                </div>
              </div>

              {/* Central Admission Form */}
              <div className="lg:col-span-2 sleek-card p-6 shadow-sm hover:translate-y-0 border-slate-200/60 relative">
                
                <AnimatePresence>
                  {showAdmScs && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-green-50 border-2 border-green-500 p-6 rounded-xl text-center space-y-3 mb-6"
                    >
                      <UserCheck className="w-12 h-12 text-green-700 mx-auto animate-bounce" />
                      <h4 className="font-bold text-[#0a4a2e] text-sm">Assalamu Alaikum! Application Submitted Successfully!</h4>
                      <p className="text-xs text-gray-700 leading-relaxed font-sans">
                        Candidate details have been synced to the database. You can now login using **"Admin Dashboard"** to approve the pupil slot, or look using the **"Student" / "Parent"** dashboards to test interactive classrooms!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handlePostAdmission} className="space-y-4 text-xs font-sans">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Student Full Name / طالب علم کا مکمل نام *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Mahmood"
                        value={admName}
                        onChange={(e) => setAdmName(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-gray-805 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Father's Full Name / والد کا نام *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mahmood Ali"
                        value={admFatherName}
                        onChange={(e) => setAdmFatherName(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-gray-805 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Student Age / عمر (برس) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10"
                        value={admAge}
                        onChange={(e) => setAdmAge(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-gray-805 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Preferred Academy Program *</label>
                      <select
                        value={admCourse}
                        onChange={(e) => setAdmCourse(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2 text-gray-805 transition-all outline-none"
                      >
                        <option value="noorani">Noorani Qaida for Kids</option>
                        <option value="tajweed">Quran Reading with Tajweed</option>
                        <option value="hifz">Quran Hifz (Memorization)</option>
                        <option value="studies">Islamic Studies</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-705 font-bold mb-1">Your Local Timezone *</label>
                      <select
                        value={admTimezone}
                        onChange={(e) => setAdmTimezone(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2 text-gray-805 transition-all outline-none"
                      >
                        <option value="GMT+1 (London)">GMT+1 (Europe/London)</option>
                        <option value="EST (New York)">EST (USA/New York)</option>
                        <option value="CST (Chicago)">CST (USA/Chicago)</option>
                        <option value="AEST (Sydney)">AEST (Australia/Sydney)</option>
                        <option value="GMT+4 (Gulf/Dubai)">GMT+4 (Dubai/UAE)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-750 font-bold mb-1">Parent Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="parent@example.com (e.g. mhashironline@gmail.com)"
                        value={admParent}
                        onChange={(e) => setAdmParent(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-gray-805 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-755 font-bold mb-1">Contact WhatsApp Coordinates *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 7911 123456"
                        value={admWhatsApp}
                        onChange={(e) => setAdmWhatsApp(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-gray-805 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Student Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="student@example.com (Leaves blank to auto-generate)"
                      value={admEmail}
                      onChange={(e) => setAdmEmail(e.target.value)}
                      className="w-full bg-slate-50/50 hover:bg-white border border-gray-200 focus:border-brand-emerald-800 focus:ring-1 focus:ring-brand-emerald-800 rounded-lg p-2.5 text-slate-800 transition-all outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sleek-btn-gold py-3.5 text-xs text-center uppercase cursor-pointer"
                  >
                    Register and Book Trials
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* ================= ISLAMIC BLOG VIEWPORT ================= */}
        {activeTab === 'blog' && (
          <motion.div
            key="blog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-5xl mx-auto px-6 space-y-12"
          >
            <div className="border-b pb-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a4a2e] font-display">Islamic Knowledge Hub</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Explanatory articles for kids and parents on Tajweed and daily Quran routines.</p>
            </div>

            {/* If a parent selected an article, show detail view */}
            {selectedBlog ? (
              <div id="selected-blog-viewport" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Back controls */}
                <div className="lg:col-span-12">
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="text-emerald-800 font-bold hover:text-emerald-900 flex items-center gap-1 cursor-pointer text-xs"
                  >
                    ← Back to Islamic Articles stream
                  </button>
                </div>

                {/* Main Article Side */}
                <div className="lg:col-span-9 bg-white border border-gray-200.5 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold py-1 px-3.5 rounded-full uppercase tracking-widest">{selectedBlog.category}</span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a4a2e] font-display leading-tight">{selectedBlog.title}</h2>
                    <p className="text-[10px] text-gray-400 font-mono">Published by scholar **{selectedBlog.author}** • {selectedBlog.date} • {selectedBlog.readTime}</p>
                  </div>

                  {/* Written block content */}
                  <div className="whitespace-pre-line text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 font-sans border-t pt-4">
                    {selectedBlog.content}
                  </div>

                  {/* YouTube iframe integration if URL is specified */}
                  {selectedBlog.youtubeUrl && (
                    <div className="space-y-2 mt-4">
                      <p className="text-[10px] text-[#0a4a2e] uppercase font-bold tracking-widest flex items-center gap-1">
                        <Play className="w-3.5 h-3.5 fill-red-650 text-red-650" /> Supporting visual video lesson lecture:
                      </p>
                      <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-emerald-900/10 shadow-md">
                        <iframe
                          src={selectedBlog.youtubeUrl}
                          title={selectedBlog.title}
                          className="absolute inset-x-0 inset-y-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {selectedBlog.tags.map((tg, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-800 text-[10px] py-0.5 px-2.5 border rounded-lg font-mono">#{tg}</span>
                    ))}
                  </div>
                </div>

                {/* Safe Halal Google AdSense optimized visual placement side wrappers */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
                    <span className="text-[9px] text-amber-500 font-extrabold uppercase tracking-widest block mb-2 font-mono">
                      Halal Sponsor Ad
                    </span>
                    <div className="h-64 bg-amber-50/55 border border-dashed border-amber-500/30 rounded-lg flex flex-col justify-center items-center p-3">
                      <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
                      <p className="text-[10px] text-emerald-950 font-bold mt-2">Certified Arabic Tajweed Course</p>
                      <p className="text-[9px] text-slate-400 mt-1">Book child trial classes inside M Hashir Portal.</p>
                      <button onClick={() => onNavigate('admission')} className="mt-4 bg-emerald-950 text-amber-400 text-[9px] font-bold px-3 py-1.5 rounded uppercase">Book trial</button>
                    </div>
                  </div>

                  <div className="bg-emerald-900/5 border border-emerald-900/10 rounded-xl p-4 text-center">
                    <span className="text-[9px] text-emerald-800 font-extrabold uppercase tracking-widest block mb-2 font-mono">
                      AdSense Placement Placeholders
                    </span>
                    <div className="h-40 bg-[#fff] border rounded-lg flex flex-col justify-center items-center p-2.5">
                      <p className="text-[10px] text-[#0a4a2e] font-extrabold text-center">Family-safe Sponsor Article Ad</p>
                      <p className="text-[8px] text-slate-400 mt-1 text-center">Google verified Halal sponsor media listings occupy this slot.</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Normal Blog catalog list stream */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogsData.map((article) => (
                  <div key={article.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 bg-slate-150 overflow-hidden">
                        <img
                          src={article.id === 'blog_1' ? "https://images.unsplash.com/photo-1609599006353-e629f1d00f18?w=450&q=80" : "https://images.unsplash.com/photo-1544856890-e72c830c2790?w=450&q=80"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 bg-emerald-950 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded font-mono">
                          {article.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-extrabold text-sm text-[#0a4a2e] font-display hover:text-emerald-800 cursor-pointer limit-rows" onClick={() => setSelectedBlog(article)}>
                          {article.title}
                        </h4>
                        <p className="text-[11px] text-slate-650 leading-relaxed font-sans">{article.summary}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex justify-between items-center border-t-0 text-[11px] font-sans">
                      <span className="text-gray-450">{article.date}</span>
                      <button
                        onClick={() => setSelectedBlog(article)}
                        className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Read Post & Watch Video <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ================= CONTACT US VIEWPORT ================= */}
        {activeTab === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto px-6 space-y-12"
          >
            <div className="border-b pb-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0a4a2e] font-display">Get in Touch with Mufti Zahid's Team</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Have any queries on lesson cycles, specialized Fiqh classes, or active rates? We respond inside 24 hours.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              
              {/* Left Aspect: Visual text details */}
              <div className="bg-emerald-950 p-6 rounded-2xl text-white space-y-4">
                <h4 className="font-display font-medium text-amber-300 text-sm tracking-widest uppercase">Direct Channels</h4>
                
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="font-bold uppercase text-gray-400">Academy General Email</p>
                      <p className="text-emerald-100 font-sans break-all">mhashironline@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <PhoneCall className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="font-bold uppercase text-gray-400">WhatsApp direct hotline</p>
                      <p className="text-emerald-100 font-sans">+92 343 0603445</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="font-bold uppercase text-gray-400">HQ Office Coordinates</p>
                      <p className="text-emerald-100 font-sans">A-Block DHA Phase 5, Lahore, Pakistan</p>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Quick-trigger Link */}
                <div className="pt-4 border-t border-emerald-900">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">QUICK CHAT CONNECT</span>
                  <a
                    href="https://wa.me/923430603445"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold py-3.5 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow"
                  >
                    🚀 Safe WhatsApp Direct link
                  </a>
                </div>
              </div>

              {/* Right Aspect: Support message form */}
              <div className="md:col-span-2 bg-white border p-6 rounded-2xl shadow-sm relative">
                <AnimatePresence>
                  {showConScs && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-green-50 border border-green-500 p-4 rounded-xl text-center space-y-2 mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-700 mx-auto" />
                      <p className="font-bold text-[#0a4a2e]">JazakAllahu Khairan!</p>
                      <p className="text-slate-650">We have received your inquiries. Mufti Zahid Ali's desk admin will contact you via WhatsApp shortly!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className="font-display font-bold text-sm text-[#0a4a2e] mb-4 uppercase tracking-wider">Leave a Message</h3>
                
                <form onSubmit={handlePostContact} className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Mahmood"
                        value={conName}
                        onChange={(e) => setConName(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-lg p-2.5 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Active Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. recipient@example.com"
                        value={conMail}
                        onChange={(e) => setConMail(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-lg p-2.5 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">How can we assist you with our programs? *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ask about free 3-day evaluations, specific lesson rates, or request a Certified sister sister scholar..."
                      value={conMsg}
                      onChange={(e) => setConMsg(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-lg p-2.5 text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0a4a2e] hover:bg-emerald-950 text-amber-400 font-bold py-3 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Interactive Digital Library Overlay Modal Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <InteractiveLibrary 
                defaultTab={libraryDefaultTab} 
                onClose={() => setIsLibraryOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
