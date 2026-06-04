/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  youtubeUrl?: string; // Standard youtube embed url format
  tags: string[];
}

export const blogsData: BlogArticle[] = [
  {
    id: "blog_1",
    title: "The Core Importance of Tajweed in Quran Recitation",
    slug: "importance-of-tajweed-quran-reading",
    category: "Tajweed Rules",
    author: "Qari Muhammad Hashir",
    date: "June 01, 2026",
    readTime: "5 min read",
    summary: "Why is Tajweed critical for every Muslim? Discover the linguistic rewards and spiritual depth of reciting the Holy Quran with correct phonetics, heavy letters, and pronunciation makharij.",
    content: `Assalamu Alaikum, dear readers. Learning the Holy Quran is a beautiful obligations for every Muslim, but reciting it with proper Quranic rules (Tajweed) elevates this act of worship to its highest aesthetic scale.

### What is Tajweed?
The word **Tajweed** literally means "proficiency" or "doing something well" in Arabic. In the context of Quranic studies, it is the set of rules governing the correct pronunciation of Arabic letters, including aspects like elongation (Madd), nasal sounds (Ghunnah), stop signs (Waqf), and the articulation points (Makharij).

### Why Tajweed is Vital:
1. **Preserving the Divine Quranic Meanings:** In the Arabic language, modifying the pronunciation of a single character can entirely reverse the sentence meaning. For example, mispronouncing "Qalb" (Heart) as "Kalb" (Dog) changes a beautiful spiritual verse into a critical error.
2. **Following the Prophet's Sunnah:** The Quran was revealed to the Prophet Muhammad (PBUH) in direct Tajweed structure. Following these scales is following his direct recitation habits.
3. **Elevating Your Prayers (Salah):** When you apply the rules of Tajweed, you recite slowly, reflecting on the depth, length, and gravity of each Divine word.

Our structured **Quran Reading with Tajweed Course** at M Hashir Online Quran Academy takes you hand-in-hand from Arabic alphabets recognition (Noorani Qaida) up to mastering complex rule integrations so you can recite the Quran confidently like a professional Qari. Enjoy our tailored tutorial video below!`,
    youtubeUrl: "https://www.youtube.com/embed/gkaA-E_9T3w", // Beautiful Quran Alphabet Tajweed Guide
    tags: ["Tajweed", "Quran Reading", "E-Learning", "Muslim Youth"]
  },
  {
    id: "blog_2",
    title: "3 Proven Rules for Memorizing the Quran at Home (Hifz Tracker)",
    slug: "proven-rules-quran-memorization-hifz",
    category: "Quran Memorization",
    author: "Sheikh Abdul Rahman",
    date: "May 28, 2026",
    readTime: "7 min read",
    summary: "Memorizing the Quran is a monumental honor. We break down the absolute Hifz system (Sabaq, Sabqi, and Manzil) used by classical scholars to achieve flawless memory retention under parental monitoring.",
    content: `Achieving the honor of becoming a **Hafiz of the Holy Quran** is one of the ultimate achievements for both children and parents. Many believe that Hifz is only achievable in traditional boarding schools, but our virtual academy has successfully helped interactive students complete Quran memorization directly from the comfort of their homes!

Here is the famous triple-method strategy used in our e-academy class structures to track, solidify, and preserve memory:

### 1. The Sabaq (New Lesson)
This is the brand-new portion of the surah you memorize and recite to your teacher every day. 
* *Rule*: Always practice your Sabaq in the early morning directly after Fajr prayer. Your mind is fully refreshed, and memory retention is at its theoretical peak.

### 2. The Sabqi (Recent Lessons Revision)
This consists of the lessons you memorized in the last 15 to 30 days. 
* *Rule*: You must revise this to your teacher daily before reciting your new Sabaq. If your Sabqi is weak, your teacher will advise you to freeze new lessons and focus purely on solidifying this critical base.

### 3. The Manzil (Daily Revision of Old Juz)
This is the ultimate system that prevents the Quran from slipping away from your memory. It consists of the parts of the Quran you have already completed.
* *Rule*: Every Hafiz must revise at least 1/2 Juz to 1 Juz daily. Regular recitation in late-night prayers (Qiyam-ul-Layl) ensures your verses grow deep roots inside your sub-conscious brain.

At M Hashir Quran Academy, we create a bespoke personalized spreadsheet tracker for each student, allowing parent supervisors to monitor daily ratings, check attendance, and view teacher scores in real-time. Watch the beautiful revision strategies in the integrated visual below!`,
    youtubeUrl: "https://www.youtube.com/embed/n4q4mO-N9eY", // Quran Memorization Tips
    tags: ["Hifz Course", "Memorization Tips", "Parent Guard", "Quran Kids"]
  },
  {
    id: "blog_3",
    title: "Powerful Duas for Seeking Perfect Islamic Knowledge and Academic Focus",
    slug: "powerful-duas-for-islamic-knowledge-focus",
    category: "Islamic Studies",
    author: "Hafiza Fatima Sajid",
    date: "May 24, 2026",
    readTime: "4 min read",
    summary: "Struggling with focus, memory retention, or pronunciation blocks? Learn the spiritual Duas from the Holy Quran and prophetic Sunnah to boost your memory and keep you connected to your studies.",
    content: `Sometimes, children and adults alike face focus blocks, digital fatigue, or memory struggles when studying Noorani Qaida or revising Quranic Juz. Alongside active self-discipline, turning to Allah (SWT) with sincere Duas can open gates of wisdom and laser focus.

Here are the top three powerful Duas from the Quran and Sunnah to recite before starting your classes:

### 1. Dua for General Knowledge & Wisdom:
From Surah Taha (20:114), this is the short but incredibly powerful command Allah instructed the Prophet (PBUH) to pray:
> **رَّبِّ زِدْنِي عِلْمًا**
> *"Rabbi Zidni 'Ilma"*
> **"My Lord, increase me in knowledge."**

### 2. Dua for Overcoming Speech Blocks and Confidence (Surah Taha 25-28):
Perfect for children learning difficult Arabic pronunciation or Makharij:
> **رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي**
> *"Rabbish-rah li sadri, wa yassir li amri, wahlul 'uqdatan min lisani, yafqahu qawli"*
> **"My Lord, expand for me my chest [with assurance] and ease for me my task and untie the knot from my tongue that they may understand my speech."**

### 3. Prophet's Dua for Mental Clarity and Protection from Laziness:
An excellent prayer to fight off fatigue after a long day at school:
> **اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْهَرَمِ، وَالْبُخْلِ**
> *"Allahumma inni a'udhu bika minal 'ajzi wal-kasali, wal-jubni wal-harami, wal-bukhli"*
> **"O Allah, I seek refuge in You from helplessness, laziness, cowardice, senility, and miserliness."**

Try adding these beautiful prayers to your children's routine before they log into their 1-on-1 dashboard class! Explore our Islamic Studies program where we cover daily Adhkar, Sunnah manners, and values.`,
    youtubeUrl: "https://www.youtube.com/embed/3v4h_j0bIgo", // Dua for knowledge lessons
    tags: ["Duas", "Focus tips", "Islamic Studies", "Kids Duas"]
  }
];
