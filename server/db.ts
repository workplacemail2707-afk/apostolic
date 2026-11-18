import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ensureSeedPdfs } from './pdfGenerator.ts';

export interface StaffUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  active: number;
}

export interface PostRecord {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  cover_url: string;
  published_at: string;
  status: 'published' | 'draft';
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface PublicationRecord {
  id: number;
  title: string;
  term: string;
  year: number;
  kind: 'Newsletter' | 'Magazine' | 'Admissions';
  description: string;
  file_url: string;
  status: 'published' | 'draft';
  created_at: string;
}

export interface EnquiryRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Reviewed' | 'Responded';
  created_at: string;
}

export interface VisitBookingRecord {
  id: number;
  parent_name: string;
  phone: string;
  email: string;
  student_grade: string;
  preferred_date: string;
  preferred_slot: string;
  notes: string;
  status: 'New' | 'Confirmed' | 'Completed';
  created_at: string;
}

export interface GalleryItemRecord {
  id: number;
  title: string;
  category: string;
  caption: string;
  image_url: string;
  featured_home: number;
  sort_order: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const UPLOAD_IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const UPLOAD_DOCS_DIR = path.join(UPLOADS_DIR, 'docs');
const DB_PATH = path.join(DATA_DIR, 'carmel.db');

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_IMAGES_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DOCS_DIR, { recursive: true });
  ensureSeedPdfs(UPLOAD_DOCS_DIR);

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      cover_url TEXT NOT NULL,
      published_at TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('published', 'draft')) DEFAULT 'draft',
      author_name TEXT NOT NULL DEFAULT 'School Communications',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      term TEXT NOT NULL,
      year INTEGER NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('Newsletter', 'Magazine', 'Admissions')),
      description TEXT NOT NULL DEFAULT '',
      file_url TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('published', 'draft')) DEFAULT 'published',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT 'General Enquiry',
      message TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('New', 'Reviewed', 'Responded')) DEFAULT 'New',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS visit_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      student_grade TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_slot TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('New', 'Confirmed', 'Completed')) DEFAULT 'New',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      caption TEXT NOT NULL,
      image_url TEXT NOT NULL,
      featured_home INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  seedInitialData(db);
  dbInstance = db;
  return db;
}

function seedInitialData(db: Database.Database): void {
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  if (userCount === 0) {
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'principal@apostoliccarmel.ac.ke';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'CarmelHeights2026!';
    const insertUser = db.prepare(
      'INSERT INTO users (email, name, password_hash, role, active) VALUES (?, ?, ?, ?, 1)'
    );
    insertUser.run(adminEmail.toLowerCase(), 'Sr. Joanita AC (Principal)', hashPassword(adminPassword), 'admin');
    insertUser.run(
      'admissions@apostoliccarmel.ac.ke',
      'Admissions & Communications Office',
      hashPassword('CarmelAdmissions2026!'),
      'editor'
    );
  }

  const postCount = (db.prepare('SELECT COUNT(*) as c FROM posts').get() as { c: number }).c;
  if (postCount === 0) {
    const insertPost = db.prepare(`
      INSERT INTO posts (slug, title, category, excerpt, body, cover_url, published_at, status, author_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPost.run(
      'grade-10-admissions-2027-open',
      'Grade 10 Admissions & Senior School Pathways Now Open',
      'Admissions',
      'Applications are open for Day and Boarding scholars joining Grade 10 across our STEM, Social Sciences, and Arts & Sports pathways.',
      `Apostolic Carmel Girls' Secondary School in Buru Buru Phase V welcomes prospective families for the upcoming Grade 10 intake under Kenya's Competency-Based Education (CBE) Senior School structure.\n\nOur dedicated faculty guides each young woman to discern her strengths across three well-resourced pathways: Science, Technology, Engineering & Mathematics (STEM); Social Sciences; and Arts & Sports Science.\n\nParents may download the official application form directly from our Admissions page or visit the school office on Katulo Road next to Blessed Sacrament Church, Monday to Friday between 8:00 AM and 4:00 PM. A non-refundable registration and assessment fee of Ksh 2,500 applies upon submission.`,
      '/src/assets/images/hero_carmel_campus_1795001368170.jpg',
      '2026-11-10',
      'published',
      'Admissions Office'
    );

    insertPost.run(
      'regional-science-innovation-distinction',
      'Carmel Scholars Earn Distinction at Nairobi Science & Eco-Congress',
      'Academics',
      'Our Form 3 and Senior Science Club presented an urban rainwater harvesting and greywater filtration prototype at the Nairobi County showcase.',
      `Guided by our Chemistry and Biology department, four Apostolic Carmel students earned top regional honours for their practical water-conservation model designed for Eastlands urban schools.\n\nTrue to our core value of Eco-friendliness, the project demonstrated how simple bio-sand filtration beds can recycle handwashing water for campus kitchen gardens.\n\nThe team moves forward to the National Science & Engineering Fair, continuing a proud tradition of inquiry-led learning in our modern laboratories.`,
      '/src/assets/images/life_academics_lab_1795001369517.jpg',
      '2026-10-28',
      'published',
      'Science Department'
    );

    insertPost.run(
      'national-music-festival-choral-honours',
      'School Choir Shines at the Nairobi Archdiocesan & National Music Festival',
      'Events',
      'Our 36-voice choir captured first place in the Sacred Choral Set Piece and earned high commendation in traditional Kenyan folk harmony.',
      `Music and the spoken word remain vibrant pillars of life at Apostolic Carmel. Over three days at the regional auditorium, our students performed with grace, discipline, and unmistakable joy.\n\nThe adjudicators praised the choir's breath control, diction, and quiet poise on stage. Debate and choral verse finalists also received commendation certificates.\n\nWe warmly thank our music patrons, Sisters of the Apostolic Carmel, and parents whose encouragement sustains the arts on campus.`,
      '/src/assets/images/life_music_debate_1795001369409.jpg',
      '2026-10-14',
      'published',
      'Music & Drama Patron'
    );

    insertPost.run(
      'opening-mass-feast-of-our-lady-of-mount-carmel',
      'Thanksgiving Mass & Boarding Mentorship Retreat',
      'Spirituality',
      'Students, parents, and Sisters gathered at Blessed Sacrament Church for our annual Carmel Day Eucharist and girls’ mentorship symposium.',
      `Rooted in the Carmelite charism brought to East Africa by the Sisters of the Apostolic Carmel in 1991, our school community celebrated a day of prayer, reflection, and sisterhood.\n\nBoarders led the liturgical choir and offertory procession before afternoon house mentorship circles led by alumni pursuing medicine, law, and education across Kenya.\n\nWeekly liturgy, quiet chapel prayer, and pastoral guidance continue to anchor every girl's personal growth throughout the school year.`,
      '/src/assets/images/life_boarding_chapel_1795001370747.jpg',
      '2026-09-25',
      'published',
      'Chaplaincy & Liturgy'
    );

    insertPost.run(
      'term-one-2027-reporting-schedule-draft',
      'Term I 2027 Boarding & Day Reporting Schedule (Draft)',
      'Announcements',
      'Draft internal notice preparing January 2027 reporting gates, uniform checks, and parent orientation hours.',
      `This draft notice outlines staggered reporting times for January 2027 boarders and day scholars. To be reviewed at the December staff briefing prior to publishing.`,
      '/src/assets/images/hero_carmel_campus_1795001368170.jpg',
      '2026-11-16',
      'draft',
      'Deputy Principal'
    );
  }

  const pubCount = (db.prepare('SELECT COUNT(*) as c FROM publications').get() as { c: number }).c;
  if (pubCount === 0) {
    const insertPub = db.prepare(`
      INSERT INTO publications (title, term, year, kind, description, file_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertPub.run(
      'The Carmel Echo – Term III Newsletter',
      'Term III',
      2026,
      'Newsletter',
      'Principal’s end-of-term message, Grade 10 CBE readiness notes, and Term I 2027 calendar.',
      '/uploads/docs/carmel-echo-term-3-2026.pdf',
      'published'
    );
    insertPub.run(
      'Seeking the Heights – Annual School Magazine',
      'Annual Edition',
      2026,
      'Magazine',
      'Our flagship chronicle celebrating student leadership, liturgy, academics, and Carmel heritage.',
      '/uploads/docs/carmel-heights-magazine-2026.pdf',
      'published'
    );
    insertPub.run(
      'The Carmel Echo – Term II Newsletter',
      'Term II',
      2026,
      'Newsletter',
      'County sports report, music festival highlights, and parent-daughter mentorship reflections.',
      '/uploads/docs/carmel-echo-term-2-2026.pdf',
      'published'
    );
  }

  const galleryCount = (db.prepare('SELECT COUNT(*) as c FROM gallery_items').get() as { c: number }).c;
  if (galleryCount === 0) {
    const insertGallery = db.prepare(`
      INSERT INTO gallery_items (title, category, caption, image_url, featured_home, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertGallery.run(
      'Morning Walk Across the Courtyard',
      'Campus',
      'Arched colonnades and quiet gardens inside our Buru Buru Phase V convent campus.',
      '/src/assets/images/hero_carmel_campus_1795001368170.jpg',
      1,
      1
    );
    insertGallery.run(
      'Senior Chemistry & Biology Practicum',
      'Academics',
      'Students conducting guided microscopy and titration practicals in the science laboratory.',
      '/src/assets/images/life_academics_lab_1795001369517.jpg',
      1,
      2
    );
    insertGallery.run(
      'Kenya Music Festival Choral Performance',
      'Music & Debate',
      'The Apostolic Carmel choir performing at the Nairobi Cultural & Music Festival.',
      '/src/assets/images/life_music_debate_1795001369409.jpg',
      1,
      3
    );
    insertGallery.run(
      'County Netball & Athletics Afternoon',
      'Sports',
      'Teamwork, agility, and sportsmanship on the outdoor netball courts.',
      '/src/assets/images/life_sports_netball_1795001370293.jpg',
      1,
      4
    );
    insertGallery.run(
      'Quiet Prayer & School Liturgy',
      'Liturgy',
      'Our sunlit chapel sanctuary where students gather for morning prayer and weekly Mass.',
      '/src/assets/images/life_boarding_chapel_1795001370747.jpg',
      1,
      5
    );
    insertGallery.run(
      'Leadership & Library Mentorship',
      'Boarding',
      'Sr. Joanita AC walking with student leaders in the library wing after evening prep.',
      '/src/assets/images/principal_sr_joanita_1795001368865.jpg',
      0,
      6
    );
  }

  const enquiryCount = (db.prepare('SELECT COUNT(*) as c FROM enquiries').get() as { c: number }).c;
  if (enquiryCount === 0) {
    db.prepare(`
      INSERT INTO enquiries (name, phone, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Grace Wanjiku Mwangi',
      '+254 712 345 678',
      'grace.mwangi@example.co.ke',
      'Grade 10 Boarding Enquiry',
      'Good morning Sister. My daughter is completing Grade 9 in Nairobi and would love to apply for Grade 10 Boarding under the STEM pathway. Could you confirm when interviews take place?',
      'New'
    );
    db.prepare(`
      INSERT INTO enquiries (name, phone, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Peter Ochieng Otieno',
      '+254 722 890 112',
      'p.otieno@example.co.ke',
      'Day Scholar Transport & Lunch',
      'Hello, we live in Buru Buru Phase III and would like to know the reporting time for day scholars and whether school lunch is included in the termly fee schedule.',
      'Reviewed'
    );
  }

  const visitCount = (db.prepare('SELECT COUNT(*) as c FROM visit_bookings').get() as { c: number }).c;
  if (visitCount === 0) {
    db.prepare(`
      INSERT INTO visit_bookings (parent_name, phone, email, student_grade, preferred_date, preferred_slot, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Beatrice Muthoni Njoroge',
      '+254 733 410 922',
      'bmuthoni@example.co.ke',
      'Grade 10 Boarding',
      '2026-11-26',
      '10:00 AM – 11:30 AM',
      'Would like to tour the dormitories and science labs with my daughter.',
      'Confirmed'
    );
  }
}

export { UPLOAD_IMAGES_DIR, UPLOAD_DOCS_DIR, UPLOADS_DIR };
