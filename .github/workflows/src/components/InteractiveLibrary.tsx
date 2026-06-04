/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, BookOpen, Volume2, Info, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle, Search, HelpCircle, X, Layers,
  ChevronRight, Bookmark, Play, Moon, Eye
} from 'lucide-react';

interface InteractiveLibraryProps {
  onClose?: () => void;
  defaultTab?: 'qaida' | 'quran';
}

// Noorani Qaida lessons list with interactive syllables
interface QaidaItem {
  ar: string;
  trans: string;
  makhrajUrdu: string;
  makhrajEng: string;
  type?: 'heavy' | 'throat' | 'normal' | 'lips';
}

const qaidaLessons = [
  {
    id: 1,
    title: "Lesson 1: Individual Letters (مفردات حروف تہجی)",
    description: "Learn correct pronunciation of single Arabic letters from their exact points of articulation (Makhraj).",
    items: [
      { ar: "ا", trans: "Alif", makhrajUrdu: "خلاءِ دہن (منہ کا خالی حصہ)", makhrajEng: "Empty space of the mouth", type: "normal" },
      { ar: "ب", trans: "Baa", makhrajUrdu: "دونوں ہونٹوں کا گیلا حصہ ملنے سے", makhrajEng: "Moist inner part of both lips", type: "lips" },
      { ar: "ت", trans: "Taa", makhrajUrdu: "زبان کی نوک اور اوپر کے سامنے والے دانتوں کی جڑ سے", makhrajEng: "Tip of the tongue and base of upper two front teeth", type: "normal" },
      { ar: "ث", trans: "Thaa", makhrajUrdu: "زبان کی نوک اور اوپر کے سامنے والے دانتوں کے اندرونی کنارے سے (نرمی سے)", makhrajEng: "Tip of tongue and inner edges of upper front teeth (softly)", type: "normal" },
      { ar: "ج", trans: "Jeem", makhrajUrdu: "زبان کا درمیان اور تالو کا درمیان ملنے سے", makhrajEng: "Middle of the tongue and middle of the palate", type: "normal" },
      { ar: "ح", trans: "Haa", makhrajUrdu: "حلق کے درمیانی حصے سے", makhrajEng: "Middle of the throat (heavily breathed)", type: "throat" },
      { ar: "خ", trans: "Khaa", makhrajUrdu: "حلق کے منہ والے آخری اوپر والے حصے سے (پر یعنی موٹا پڑھیں)", makhrajEng: "Top of the throat (pronounced thick/scraped)", type: "heavy" },
      { ar: "د", trans: "Daal", makhrajUrdu: "زبان کی نوک اور اوپر کے دانتوں کی جڑ سے", makhrajEng: "Tip of the tongue and base of upper front teeth", type: "normal" },
      { ar: "ذ", trans: "Thaal", makhrajUrdu: "زبان کی نوک اور سامنے والے دانتوں کے کنارے سے (نرم آواز)", makhrajEng: "Tip of tongue and front teeth edges (soft sound)", type: "normal" },
      { ar: "ر", trans: "Raa", makhrajUrdu: "زبان کی نوک اور اس کی پشت جب اوپر کے مسوڑھوں سے لگے", makhrajEng: "Tip of tongue and its back against upper gums", type: "normal" },
      { ar: "ز", trans: "Zaa", makhrajUrdu: "زبان کی نوک جب اوپر اور نیچے کے سامنے والے دانتوں کے درمیاں سے آواز نکالے (سیٹی کی طرح سخت)", makhrajEng: "Tip of tongue, vibrating sharply with front teeth (whistling sound)", type: "normal" },
      { ar: "س", trans: "Seen", makhrajUrdu: "سیٹی والی تیز اور باریک آواز کے ساتھ", makhrajEng: "Sharp whistling sound, thin tone", type: "normal" },
      { ar: "ش", trans: "Sheen", makhrajUrdu: "زبان کا تالو کی چوڑائی سے ٹکراؤ", makhrajEng: "Middle of tongue against upper palate with spreading breath", type: "normal" },
      { ar: "ص", trans: "Suad", makhrajUrdu: "پر پڑھا جائے گا، منہ سے گونج پیدا کر کے (مستعلیہ / موٹا)", makhrajEng: "Thick, rounded whistling sound (Heavy letter)", type: "heavy" },
      { ar: "ض", trans: "Dhad", makhrajUrdu: "زبان کی دائیں یا بائیں کروٹ اوپر کی داڑھوں کی جڑ سے ملنے سے (نہایت بھاری)", makhrajEng: "Side rim of tongue against base of upper molars (Very heavy)", type: "heavy" },
      { ar: "ط", trans: "Tua", makhrajUrdu: "زبان کی نوک اور سامنے اوپر کے دانتوں کی جڑ (نہایت پر اور موٹا)", makhrajEng: "Tip of tongue and base of upper teeth (Strong, thick)", type: "heavy" },
      { ar: "ظ", trans: "Zua", makhrajUrdu: "زبان کی نوک اور اوپر کے دانتوں کے اندرونی کنارے سے نہایت موٹا", makhrajEng: "Tip of tongue and upper teeth edges (thickly breathed)", type: "heavy" },
      { ar: "ع", trans: "Ayn", makhrajUrdu: "وسط حلق (حلق کے درمیانی حصے) سے صاف صاف", makhrajEng: "Middle of throat (clear, distinct Arabic Ayn sound)", type: "throat" },
      { ar: "غ", trans: "Ghayn", makhrajUrdu: "حلق کے اوپر والے حصے سے نہایت موٹا پڑھیں", makhrajEng: "Top of the throat next to mouth (thick vibration)", type: "heavy" },
      { ar: "ف", trans: "Faa", makhrajUrdu: "اوپر کے دانتوں کا پیٹ نیچے کے ہونٹ پر لگے", makhrajEng: "Inner lip and upper teeth meeting", type: "lips" },
      { ar: "ق", trans: "Qaaf", makhrajUrdu: "زبان کی جڑ اور بالکل اوپر والا تالو ملنے سے (بھاری آواز)", makhrajEng: "Deep base of tongue against soft palate (Heavy block letter)", type: "heavy" },
      { ar: "ك", trans: "Kaaf", makhrajUrdu: "زبان کی جڑ تالو سے مگر منہ کی طرف ہٹ کر (باریک آواز)", makhrajEng: "Base of tongue meeting palate slightly forward (Light acoustic)", type: "normal" },
      { ar: "ل", trans: "Laam", makhrajUrdu: "زبان کا کنارہ تالو کے تہائی حصہ سے", makhrajEng: "Side rim of tongue against front upper palate", type: "normal" },
      { ar: "م", trans: "Meem", makhrajUrdu: "دونوں ہونٹوں کے خشک حصے ملنے سے", makhrajEng: "Dry outer part of both lips meeting", type: "lips" },
      { ar: "ن", trans: "Noon", makhrajUrdu: "زبان کا سرا تالو سے لگے", makhrajEng: "Tip of tongue directly against gum ridge", type: "normal" },
      { ar: "و", trans: "Waw", makhrajUrdu: "دونوں ہونٹوں کو گول کرنے سے (نہایت خوبصورتی سے)", makhrajEng: "Rounding both lips leaving a tiny gap", type: "lips" },
      { ar: "ہ", trans: "Haa (Soft)", makhrajUrdu: "اقصیٰ حلق یعنی حلق کے نیچے والے سینے کی طرف کے حصے سے", makhrajEng: "Lowest part of throat near chest (soft breath)", type: "throat" },
      { ar: "ی", trans: "Yaa", makhrajUrdu: "زبان کا وسط منہ کے تالو سے ملنے پر", makhrajEng: "Middle of the tongue against upper palate", type: "normal" }
    ]
  },
  {
    id: 2,
    title: "Lesson 2: Joint Forms & Combinations (مرکبات)",
    description: "Understand how Arabic letters change shape when written together in compound words.",
    items: [
      { ar: "لا", trans: "Laam Alif", makhrajUrdu: "لا م اور الف کا ملاپ", makhrajEng: "Laam and Alif joined together", type: "normal" },
      { ar: "بل", trans: "Baa Laam", makhrajUrdu: "با اور لام کا ملاپ", makhrajEng: "Baa and Laam compound", type: "normal" },
      { ar: "تم", trans: "Taa Meem", makhrajUrdu: "تا اور میم کا ملاپ", makhrajEng: "Taa and Meem compound", type: "normal" },
      { ar: "جت", trans: "Jeem Taa", makhrajUrdu: "جیم اور تا کا ملاپ", makhrajEng: "Jeem and Taa compound", type: "normal" },
      { ar: "خق", trans: "Khaa Qaaf", makhrajUrdu: "خا اور قاف کا بھاری ملاپ", makhrajEng: "Two heavy letters combined", type: "heavy" },
      { ar: "سع", trans: "Seen Ayn", makhrajUrdu: "سین اور عین کا ملاپ", makhrajEng: "Seen and Ayn compound", type: "normal" },
      { ar: "ضط", trans: "Dhad Tua", makhrajUrdu: "دو انتہائی پر اور بھاری حروف کا ملاپ", makhrajEng: "Dhad and Tua (highly thick compound)", type: "heavy" },
      { ar: "من", trans: "Meem Noon", makhrajUrdu: "میم اور نون کا ملاپ", makhrajEng: "Meem and Noon compound", type: "normal" }
    ]
  },
  {
    id: 3,
    title: "Lesson 3: Harakaat Vowels (حرکات: زبر، زیر، پیش)",
    description: "Learn how the short vowels - Fatha (Zabar), Kasra (Zer), and Damma (Pesh) alter sounds without elongation.",
    items: [
      { ar: "أَ", trans: "Alif-Zabar (A)", makhrajUrdu: "آواز اوپر اٹھائیں (آ)", makhrajEng: "Sound directed upwards. Do not stretch.", type: "normal" },
      { ar: "إِ", trans: "Alif-Zer (I)", makhrajUrdu: "آواز نیچے گرائیں (ای)", makhrajEng: "Sound directed downwards. Do not stretch.", type: "normal" },
      { ar: "أُ", trans: "Alif-Pesh (U)", makhrajUrdu: "دونوں ہونٹ گول کریں (او)", makhrajEng: "Sound pronounced with fully rounded lips (Ooh).", type: "normal" },
      { ar: "بَ", trans: "Baa-Zabar (Ba)", makhrajUrdu: "ہونٹوں کو حرکت دے کر جلدی پڑھا جائے", makhrajEng: "Expressed quickly, do not drag or bounce.", type: "lips" },
      { ar: "بِ", trans: "Baa-Zer (Bi)", makhrajUrdu: "زیر کی باریک آواز جلدی سے", makhrajEng: "Short vowel under Baa, pronounced quickly.", type: "lips" },
      { ar: "بُ", trans: "Baa-Pesh (Bu)", makhrajUrdu: "ہونٹ گول کر کے جلد ادا کریں", makhrajEng: "Double rounded Baa vowel, short sound.", type: "lips" },
      { ar: "تَ", trans: "Taa-Zabar (Ta)", makhrajUrdu: "زبان کی نوک سے جلدی پڑھیں", makhrajEng: "Swiftly pronounced without elongation.", type: "normal" },
      { ar: "تِ", trans: "Taa-Zer (Ti)", makhrajUrdu: "تیزی سے زیر کی آواز", makhrajEng: "Quick vocalized sound.", type: "normal" }
    ]
  },
  {
    id: 4,
    title: "Lesson 4: Tanween Double Vowels (تنوین: دو زبر، دو زیر، دو پیش)",
    description: "Learn the rules of Nunation (sounds ending in 'N' vibration) called Tanween.",
    items: [
      { ar: "اًا", trans: "Alif-Do-Zabar (An)", makhrajUrdu: "آواز نون غنے کے ساتھ سانس کی طرح 'آن' آتی ہے", makhrajEng: "Pronounced as 'An' ending with nasalized N vibration.", type: "normal" },
      { ar: "بًا", trans: "Baa-Do-Zabar (Ban)", makhrajUrdu: "دو زبر کے ساتھ 'بن'", makhrajEng: "Pronounced quickly as 'Ban'.", type: "lips" },
      { ar: "بٍ", trans: "Baa-Do-Zer (Bin)", makhrajUrdu: "دو زیر کے ساتھ 'بن'", makhrajEng: "Pronounced quickly as 'Bin'.", type: "lips" },
      { ar: "بٌ", trans: "Baa-Do-Pesh (Bun)", makhrajUrdu: "دو پیش کے ساتھ 'بن' (ہونٹ گول ہوں گے)", makhrajEng: "Pronounced with rounded lips 'Bun'.", type: "lips" },
      { ar: "تً", trans: "Taa-Do-Zabar (Tan)", makhrajUrdu: "دو زبر کے ساتھ 'تن'", makhrajEng: "Pronounced as 'Tan'.", type: "normal" },
      { ar: "تٍ", trans: "Taa-Do-Zer (Tin)", makhrajUrdu: "دو زیر کے ساتھ 'تن'", makhrajEng: "Pronounced as 'Tin'.", type: "normal" },
      { ar: "تٌ", trans: "Taa-Do-Pesh (Tun)", makhrajUrdu: "دو پیش کے ساتھ 'تن'", makhrajEng: "Pronounced as 'Tun'.", type: "normal" },
      { ar: "خً", trans: "Khaa-Do-Zabar (Khan)", makhrajUrdu: "موٹی بھاری آواز غنے کے ساتھ 'خن'", makhrajEng: "Pronounced as heavy thick 'Khang' vowel sound.", type: "heavy" }
    ]
  }
];

// Quran Surahs with Tajweed markup
interface Verse {
  text: string;
  transUrdu: string;
  transEng: string;
  // Highlights map for showing Tajweed rules: word indexes or ranges
  rules?: {
    type: 'ghunnah' | 'madd' | 'qalqalah';
    text: string;
    explanation: string;
  }[];
}

const quranSurahs = [
  {
    id: "fatiha",
    name: "Surah Al-Fatiha (سورۃ الفاتحہ)",
    verses: [
      {
        text: "بِسْمِ <span class='text-orange-500 font-bold underline' title='Madd Application'>اللَّهِ</span> <span class='text-green-500 font-bold underline' title='Ghunnah'>الرَّحْمَٰنِ</span> الرَّحِيمِ",
        transUrdu: "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم کرنے والا ہے۔",
        transEng: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        rules: [
          { type: "madd", text: "اللَّهِ", explanation: "Pronounce with elongation of 2 beats (Lafdh-e-Jalalah)" },
          { type: "ghunnah", text: "الرَّحْمَٰنِ", explanation: "Green marked indicates Ghunnah of phonetic solar integration." }
        ]
      },
      {
        text: "الْحَمْدُ لِلَّهِ رَبِّ <span class='text-blue-500 font-extrabold underline' title='Qalqalah - bouncing letter b'>الْعَالَمِينَ</span>",
        transUrdu: "سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔",
        transEng: "[All] praise is [due] to Allah, Lord of the worlds.",
        rules: [
          { type: "qalqalah", text: "الْعَالَمِينَ", explanation: "Bouncing and vibration acoustics on letters at pause junctions." }
        ]
      },
      {
        text: "الرَّحْمَٰنِ <span class='text-orange-500 font-bold underline'>الرَّحِيمِ</span>",
        transUrdu: "بڑا مہربان نہایت رحم فرمانے والا۔",
        transEng: "The Entirely Merciful, the Especially Merciful.",
        rules: [
          { type: "madd", text: "الرَّحِيمِ", explanation: "Slight elongation stretching the 'Yaa' letter before stopping." }
        ]
      },
      {
        text: "مَالِكِ يَوْمِ <span class='text-green-555 font-bold underline'>الدِّينِ</span>",
        transUrdu: "روزِ جزاء کا مالک۔",
        transEng: "Sovereign of the Day of Recompense.",
        rules: []
      },
      {
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ <span class='text-orange-500 font-bold underline'>نَسْتَعِينُ</span>",
        transUrdu: "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد چاہتے ہیں۔",
        transEng: "It is You we worship and You we ask for help.",
        rules: [
          { type: "madd", text: "نَسْتَعِينُ", explanation: "Madd 'Aarid li-Sukoon on vowel elongation before end junction." }
        ]
      },
      {
        text: "اهْدِنَا <span class='text-green-500 font-bold underline'>الصِّرَاطَ</span> الْمُسْتَقِيمَ",
        transUrdu: "ہمیں سیدھے راستے پر چلا۔",
        transEng: "Guide us to the straight path.",
        rules: [
          { type: "ghunnah", text: "الصِّرَاطَ", explanation: "Heavy letters pronounced thick and deep with proper nasal breath timing." }
        ]
      },
      {
        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا <span class='text-orange-600 font-extrabold underline decoration-wavy' title='Heavy Elongation (Madd laazim)'>الضَّالِّينَ</span>",
        transUrdu: "ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ کہ ان کا جن پر غضب نازل ہوا اور نہ گمراہوں کا۔",
        transEng: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.",
        rules: [
          { type: "madd", text: "الضَّالِّينَ", explanation: "Madd Laazim (Great Long elongation) - mandatory stretching of 5-6 beats duration." }
        ]
      }
    ]
  },
  {
    id: "ikhlas",
    name: "Surah Al-Ikhlas (سورۃ الاخلاص)",
    verses: [
      {
        text: "قُلْ هُوَ <span class='text-orange-500 font-bold underline'>اللَّهُ</span> أَحَدٌ",
        transUrdu: "کہہ دیجئے: وہ اللہ ایک (ہی) ہے۔",
        transEng: "Say, \"He is Allah, [who is] One.",
        rules: [
          { type: "madd", text: "اللَّهُ", explanation: "Stretch the heavy Sound of Allah name (Lafdh-e-Jalalah)." }
        ]
      },
      {
        text: "<span class='text-orange-500 font-bold underline'>اللَّهُ</span> <span class='text-green-500 font-bold underline'>الصَّمَدُ</span>",
        transUrdu: "اللہ بے نیاز ہے (سب کا سہارا ہے)۔",
        transEng: "Prophet Muhammad said: \"Allah, the Eternal Refuge.\"",
        rules: [
          { type: "ghunnah", text: "الصَّمَدُ", explanation: "Heavily emphasized 'Saad' with echo sound closing on Dal." }
        ]
      },
      {
        text: "لَمْ يَلِدْ وَلَمْ <span class='text-blue-500 font-bold underline'>يُولَدْ</span>",
        transUrdu: "نہ اس نے کسی کو جنا اور نہ وہ خود جنا گیا۔",
        transEng: "He neither begets nor is born,",
        rules: [
          { type: "qalqalah", text: "يُولَدْ", explanation: "Kalkalah / Bouncing echo sound on the letter 'Daa' (د) at the end of word." }
        ]
      },
      {
        text: "وَلَمْ يَكُنْ لَهُ كُفُوًا <span class='text-blue-500 font-bold underline'>أَحَدٌ</span>",
        transUrdu: "اور نہ ہی کوئی اس کا رتبہ ہمسر ہے۔",
        transEng: "And there is none co-equal or equivalent unto Him.\"",
        rules: [
          { type: "qalqalah", text: "أَحَدٌ", explanation: "Pronounce ending 'Dal' (د) with clear rebound/bounce acoustic." }
        ]
      }
    ]
  },
  {
    id: "kauthar",
    name: "Surah Al-Kauthar (سورۃ الکوثر)",
    verses: [
      {
        text: "<span class='text-orange-600 font-extrabold underline decoration-wavy' title='Madd-e-Muttasil'>إِنَّا أَعْطَيْنَاكَ</span> <span class='text-green-500 font-bold underline'>الْكَوْثَرَ</span>",
        transUrdu: "بے شک ہم نے آپ کو کوثر (بے انتہا بھلائی اور حوضِ کوثر) عطا کی۔",
        transEng: "Indeed, We have granted you, [O Muhammad], al-Kawthar.",
        rules: [
          { type: "madd", text: "إِنَّا أَعْطَيْنَاكَ", explanation: "Madd Jaiz (Medium Elongation) - pronounce with 3-4 beats stretch." },
          { type: "ghunnah", text: "الْكَوْثَرَ", explanation: "Noon-Mushaddad rules: Keep holding nasal breath voice on 'Inna' (نّ) for 2 beats." }
        ]
      },
      {
        text: "فَصَلِّ لِرَبِّكَ <span class='text-blue-500 font-bold underline'>وَانْحَرْ</span>",
        transUrdu: "پس آپ اپنے پروردگار کے لیے نماز پڑھیں اور قربانی کریں۔",
        transEng: "So pray to your Lord and sacrifice [to Him alone].",
        rules: [
          { type: "qalqalah", text: "وَانْحَرْ", explanation: "Clear throat execution of Haa (ح) joined instantly to heavy Raa." }
        ]
      },
      {
        text: "<span class='text-green-500 font-bold underline'>إِنَّ شَانِئَكَ</span> هُوَ <span class='text-blue-500 font-bold underline'>الْأَبْتَرُ</span>",
        transUrdu: "یقیناً آپ کا دشمن ہی بے نام و نشاں رہے گا۔",
        transEng: "Indeed, your enemy is the one cut off.",
        rules: [
          { type: "ghunnah", text: "إِنَّ شَانِئَكَ", explanation: "Holding nasal vibration on Noon-Mushaddad." },
          { type: "qalqalah", text: "الْأَبْتَرُ", explanation: "Vibrating bouncing echo sound on clean letter Baa (ب)." }
        ]
      }
    ]
  }
];

export default function InteractiveLibrary({ onClose, defaultTab = 'qaida' }: InteractiveLibraryProps) {
  const [activeSegment, setActiveSegment] = useState<'qaida' | 'quran'>(defaultTab);
  
  // Qaida interactive states
  const [activeQaidaLesson, setActiveQaidaLesson] = useState(0);
  const [selectedQaidaItem, setSelectedQaidaItem] = useState<QaidaItem | null>(qaidaLessons[0].items[0]);
  const [isSynthesizingUrdu, setIsSynthesizingUrdu] = useState(false);
  const [audioFeedbackText, setAudioFeedbackText] = useState<string | null>(null);

  // Quran interactive states
  const [activeQuranSurahIdx, setActiveQuranSurahIdx] = useState(0);
  const [selectedQuranVerseIdx, setSelectedQuranVerseIdx] = useState<number | null>(0);
  const [searchQuranQuery, setSearchQuranQuery] = useState('');
  const [transLang, setTransLang] = useState<'both' | 'urdu' | 'english'>('both');

  const selectedSurah = quranSurahs[activeQuranSurahIdx];

  const filteredSurahs = quranSurahs.filter(s => 
    s.name.toLowerCase().includes(searchQuranQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuranQuery.toLowerCase())
  );

  const triggerAudioAcoustic = (arabicLetter: string, pronunciationName: string) => {
    // Generate helpful interactive sound simulation/feedback
    setAudioFeedbackText(pronunciationName);
    setIsSynthesizingUrdu(true);
    
    // Check if SpeechSynthesis is supported for native pronunciation description
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `Pronunciation of classic Arabic letter: ${pronunciationName}. Point of articulation is: ${selectedQaidaItem?.makhrajEng}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setIsSynthesizingUrdu(false);
      setAudioFeedbackText(null);
    }, 1800);
  };

  const handleSurahClick = (id: string) => {
    const idx = quranSurahs.findIndex(s => s.id === id);
    if (idx !== -1) {
      setActiveQuranSurahIdx(idx);
      setSelectedQuranVerseIdx(0);
    }
  };

  return (
    <div id="interactive-digital-library" className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
      
      {/* Premium Header Bar */}
      <div className="bg-[#0a4a2e] text-white px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <BookOpen className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
              <span>M Hashir Online Academy - Interactive Reader</span>
              <span className="text-[9px] bg-amber-500 text-emerald-950 px-2 py-0.5 rounded-full font-mono font-bold uppercase">Digital Books</span>
            </h3>
            <p className="text-[10px] text-emerald-100/80 font-sans">
              Learn Tajweed and Noorani Qaida interactively with guides & makharij points.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Segment Toggle buttons */}
          <div className="bg-emerald-950/60 p-1 rounded-xl flex items-center gap-1 border border-emerald-800/20">
            <button
              onClick={() => setActiveSegment('qaida')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${activeSegment === 'qaida' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'text-gray-300 hover:text-white hover:bg-emerald-900/35'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              تجویدی نورانی قاعدہ
            </button>
            <button
              onClick={() => setActiveSegment('quran')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${activeSegment === 'quran' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'text-gray-300 hover:text-white hover:bg-emerald-900/35'}`}
            >
              <Book className="w-3.5 h-3.5" />
              تجویدی قرآن مجید
            </button>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-emerald-800 text-white transition-colors cursor-pointer"
              title="Close digital viewer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main content split view */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* ================== TAB SUBSECTION 1: NOORANI QAIDA ================== */}
        {activeSegment === 'qaida' && (
          <>
            {/* Sidebar selector for Lessons */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto flex flex-col gap-2.5 shrink-0">
              <h4 className="text-[10px] font-extrabold text-slate-405 uppercase tracking-widest px-2 font-mono">
                Select Study Lesson
              </h4>
              {qaidaLessons.map((les, index) => (
                <button
                  key={les.id}
                  onClick={() => {
                    setActiveQaidaLesson(index);
                    setSelectedQaidaItem(les.items[0] || null);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${activeQaidaLesson === index ? 'bg-emerald-50 border border-emerald-500/20 shadow-sm text-brand-emerald-900 font-bold' : 'hover:bg-slate-200/50 text-slate-700'}`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${activeQaidaLesson === index ? 'bg-brand-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {les.id}
                  </span>
                  <div className="leading-snug">
                    <p className="font-extrabold">{les.title.split(':')[0]}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 max-w-xs">{les.title.split(':')[1] || ""}</p>
                  </div>
                </button>
              ))}

              {/* Informative advice */}
              <div className="mt-auto bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl space-y-1">
                <p className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  Makhraj Principle
                </p>
                <p className="text-[10px] text-slate-650 leading-relaxed font-sans">
                  Click on any box in the alphabet table to reveal its origin (مخرج), classification type, and audio spelling guide.
                </p>
              </div>
            </div>

            {/* Central alphabet grid interaction */}
            <div className="flex-1 bg-white p-4 overflow-y-auto flex flex-col gap-4">
              <div className="border-b pb-2">
                <h4 className="text-sm font-extrabold text-slate-800 font-display">
                  {qaidaLessons[activeQaidaLesson].title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {qaidaLessons[activeQaidaLesson].description}
                </p>
              </div>

              {/* Letters grid layout */}
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {qaidaLessons[activeQaidaLesson].items.map((item, idx) => {
                  const isSelected = selectedQaidaItem?.ar === item.ar;
                  return (
                    <motion.button
                      key={item.ar + idx}
                      onClick={() => {
                        setSelectedQaidaItem(item);
                        triggerAudioAcoustic(item.ar, item.trans);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`h-16 rounded-xl border flex flex-col items-center justify-center relative cursor-pointer font-serif transition-colors ${isSelected ? 'bg-emerald-900 text-white border-transparent shadow shadow-emerald-950/40' : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-emerald-950'}`}
                    >
                      <span className="text-2xl font-bold">{item.ar}</span>
                      <span className="text-[9px] font-sans font-medium text-slate-400 mt-1 uppercase">
                        {item.trans.split(' ')[0]}
                      </span>
                      {item.type === 'heavy' && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" title="Heavy letter (حرف مستعلیہ)" />
                      )}
                      {item.type === 'throat' && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" title="Throat sound (حرف حلقی)" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Articulation details drawer panel */}
              {selectedQaidaItem && (
                <div className="mt-auto bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3.5 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-[#0a4a2e] text-white rounded-lg flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
                        {selectedQaidaItem.ar}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0a4a2e] text-xs sm:text-sm font-sans">
                          Letter Spelling: <strong className="text-amber-600 uppercase font-mono">{selectedQaidaItem.trans}</strong>
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-gray-500 font-medium">Letter classification:</span>
                          <span className="text-[8px] bg-slate-200 text-slate-800 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                            {selectedQaidaItem.type || "normal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Simulation Sound Button */}
                    <button
                      onClick={() => triggerAudioAcoustic(selectedQaidaItem.ar, selectedQaidaItem.trans)}
                      className={`flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all shadow cursor-pointer ${isSynthesizingUrdu ? 'animate-pulse scale-95' : ''}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {isSynthesizingUrdu ? "Spelling Guide..." : "Practice Sound (آواز سنیں)"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3.5 border-t border-slate-200/80 text-xs sm:text-xs">
                    <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                        مخرج کی علمی وضاحت (Urdu Definition)
                      </span>
                      <p className="text-right font-sans text-slate-700 leading-normal" dir="rtl">
                        اس حرف کا مخرج: <strong className="text-[#0a4a2e]">{selectedQaidaItem.makhrajUrdu}</strong> ہے۔
                      </p>
                    </div>

                    <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                        Makhraj Articulation Point (English)
                      </span>
                      <p className="font-sans text-slate-650 leading-normal text-left">
                        {selectedQaidaItem.makhrajEng}.
                      </p>
                    </div>
                  </div>

                  {/* Highlights Indicator strip */}
                  <div className="flex gap-4 text-[9px] text-slate-450 border-t pt-2 bg-clear">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Orange Dot = Heavy Letter (حروف مستعلیہ)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Blue Dot = Throat Articulator (حروف حلقی)</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================== TAB SUBSECTION 2: TAJWEED QURAN READER ================== */}
        {activeSegment === 'quran' && (
          <>
            {/* Sidebar filter list of Surahs */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto flex flex-col gap-3 shrink-0">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Surah (تلاش کریں)..."
                  value={searchQuranQuery}
                  onChange={(e) => setSearchQuranQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <h4 className="text-[10px] font-extrabold text-slate-405 uppercase tracking-widest px-1 font-mono">
                Select Surah (سورہ منتخب کریں)
              </h4>

              <div className="space-y-1.5">
                {filteredSurahs.map((sur, idx) => {
                  const isSelected = selectedSurah.id === sur.id;
                  return (
                    <button
                      key={sur.id}
                      onClick={() => handleSurahClick(sur.id)}
                      className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between cursor-pointer ${isSelected ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-slate-200/50 text-slate-700'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{sur.name.split(' (')[0]}</span>
                      </div>
                      <span className={`font-serif text-[11px] ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                        {sur.name.includes(' (') ? sur.name.substring(sur.name.indexOf('(')) : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Translation Lang toggler */}
              <div className="mt-auto space-y-1 pt-3 border-t">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase font-mono block">Translation settings</span>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border">
                  <button
                    onClick={() => setTransLang('both')}
                    className={`p-1 rounded text-[9px] font-bold cursor-pointer transition-all ${transLang === 'both' ? 'bg-brand-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    Both
                  </button>
                  <button
                    onClick={() => setTransLang('urdu')}
                    className={`p-1 rounded text-[9px] font-bold cursor-pointer transition-all ${transLang === 'urdu' ? 'bg-brand-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    اردو
                  </button>
                  <button
                    onClick={() => setTransLang('english')}
                    className={`p-1 rounded text-[9px] font-bold cursor-pointer transition-all ${transLang === 'english' ? 'bg-brand-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Central reading container with interactive highlighting */}
            <div className="flex-1 bg-stone-50/45 p-5 overflow-y-auto flex flex-col gap-4">
              
              {/* Surah title header */}
              <div className="bg-[#0a4a2e]/5 border border-brand-emerald-500/10 p-4 rounded-xl flex justify-between items-center bg-white shadow-xs">
                <div>
                  <span className="text-[9px] bg-brand-emerald-800 text-white px-2 py-0.5 rounded font-mono font-bold">
                    TAJWEED SENSITIVE RECITATION
                  </span>
                  <h3 className="font-serif text-lg font-extrabold text-[#0a4a2e] mt-1">
                    {selectedSurah.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono italic">M Hashir Academy Digital Desk</span>
                  <p className="text-xs font-bold text-amber-600 font-sans mt-0.5">{selectedSurah.verses.length} Verses (آیات)</p>
                </div>
              </div>

              {/* Tajweed Legend Indicator */}
              <div className="bg-white p-3 border rounded-xl text-[10px] sm:text-xs flex flex-wrap gap-4 items-center justify-center">
                <span className="font-bold text-slate-500 border-r pr-3 uppercase tracking-wider font-mono">Tajweed Guide:</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded" /> Orange = Madd (Elongation)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-500 rounded" /> Green = Ghunnah (Nasal Rule)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded" /> Blue = Qalqalah (Echo Sound)</span>
              </div>

              {/* Verses Stack */}
              <div className="space-y-4 flex-1">
                {selectedSurah.verses.map((v, index) => {
                  const isSelected = selectedQuranVerseIdx === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedQuranVerseIdx(index)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${isSelected ? 'border-amber-500/60 ring-2 ring-amber-500/10 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        {/* Verse label circle */}
                        <span className="w-6 h-6 rounded-full bg-[#eefdf6] border border-brand-emerald-500/20 text-brand-emerald-900 font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                          {index + 1}
                        </span>

                        {/* Arabic text - Large and center/right aligned */}
                        <p 
                          className="text-right font-serif text-2xl sm:text-3xl text-emerald-950 font-bold leading-loose flex-1 tracking-wide"
                          dir="rtl"
                          dangerouslySetInnerHTML={{ __html: v.text }}
                        />
                      </div>

                      {/* Transliteration/Translation display block */}
                      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-2 text-xs sm:text-xs font-sans text-slate-600">
                        {(transLang === 'urdu' || transLang === 'both') && (
                          <p className="text-right text-slate-800 font-medium" dir="rtl">
                            <span className="text-[10px] text-[#0a4a2e] ml-1 select-none font-bold font-mono">اردو:</span> {v.transUrdu}
                          </p>
                        )}
                        {(transLang === 'english' || transLang === 'both') && (
                          <p className="text-left text-slate-500">
                            <span className="text-[10px] text-amber-700 mr-1 select-none font-bold font-mono">ENG:</span> {v.transEng}
                          </p>
                        )}
                      </div>

                      {/* Explicit Interactive Rule list if verse is highlighted */}
                      {isSelected && v.rules && v.rules.length > 0 && (
                        <div className="mt-3 bg-[#eefdf6] border border-brand-emerald-500/10 rounded-lg p-2.5 text-[11px] space-y-1 text-slate-700 animate-slide-in">
                          <p className="font-bold text-[#0a4a2e] flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Tajweed Rules detected in Verse {index + 1}:
                          </p>
                          <ul className="list-disc pl-4 space-y-1.5 text-slate-600 mt-1">
                            {v.rules.map((r, rIdx) => (
                              <li key={rIdx}>
                                <strong className="text-[#0a4a2e] font-serif pr-1">"{r.text}"</strong> : 
                                <span className={`mx-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono ${r.type === 'madd' ? 'bg-orange-100 text-orange-850' : r.type === 'qalqalah' ? 'bg-blue-100 text-blue-850' : 'bg-green-100 text-green-850'}`}>
                                  {r.type.toUpperCase()}
                                </span>
                                {r.explanation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </>
        )}

      </div>

      {/* Persistent Quick Trial CTA Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-center sm:text-left">
          <p className="text-xs font-extrabold text-[#0a4a2e] flex items-center justify-center sm:justify-start gap-1">
            <CheckCircle className="w-4 h-4 text-brand-emerald-800" /> Learn directly under Mufti Zahid Ali's Team
          </p>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">
            Submit an online admission or get live classes schedule over active WhatsApp!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/923430603445"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1dba52] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Class timings over WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
