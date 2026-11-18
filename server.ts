import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  getDb,
  verifyPassword,
  UPLOADS_DIR,
  UPLOAD_IMAGES_DIR,
  UPLOAD_DOCS_DIR,
  type StaffUser,
} from './server/db.ts';

const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || 'apostolic-carmel-dev-secret-key-2026';
const COOKIE_NAME = 'ac_staff_session';

interface AuthenticatedRequest extends Request {
  staffUser?: StaffUser;
}

function parseCookies(header: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    result[key] = decodeURIComponent(val);
  }
  return result;
}

function signSessionToken(userId: number, email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, email, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string): { uid: number; email: string } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      uid: number;
      email: string;
      exp: number;
    };
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    return { uid: parsed.uid, email: parsed.email };
  } catch {
    return null;
  }
}

function requireStaffAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  const verified = verifySessionToken(token);
  if (!verified) {
    res.status(401).json({ error: 'Session expired or invalid.' });
    return;
  }
  const db = getDb();
  const user = db
    .prepare('SELECT id, email, name, role, active FROM users WHERE id = ? AND active = 1')
    .get(verified.uid) as StaffUser | undefined;
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    res.status(403).json({ error: 'Restricted to authorized Apostolic Carmel staff.' });
    return;
  }
  req.staffUser = user;
  next();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    const dir = isPdf ? UPLOAD_DOCS_DIR : UPLOAD_IMAGES_DIR;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .slice(0, 40);
    cb(null, `${base || 'upload'}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP images and PDF files are supported.'));
    }
  },
});

async function startServer() {
  const db = getDb();
  const app = express();

  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, school: "Apostolic Carmel Girls' Secondary School" });
  });

  // Public News & Events (strictly published only)
  app.get('/api/posts', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const limit = typeof req.query.limit === 'string' ? Math.min(Number(req.query.limit) || 50, 50) : 50;

    let rows;
    if (category && category !== 'All') {
      rows = db
        .prepare(
          `SELECT id, slug, title, category, excerpt, body, cover_url, published_at, author_name
           FROM posts
           WHERE status = 'published' AND category = ?
           ORDER BY published_at DESC, id DESC
           LIMIT ?`
        )
        .all(category, limit);
    } else {
      rows = db
        .prepare(
          `SELECT id, slug, title, category, excerpt, body, cover_url, published_at, author_name
           FROM posts
           WHERE status = 'published'
           ORDER BY published_at DESC, id DESC
           LIMIT ?`
        )
        .all(limit);
    }
    res.json({ posts: rows });
  });

  app.get('/api/posts/:slug', (req, res) => {
    const post = db
      .prepare(
        `SELECT id, slug, title, category, excerpt, body, cover_url, published_at, author_name
         FROM posts
         WHERE slug = ? AND status = 'published'`
      )
      .get(req.params.slug);
    if (!post) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    res.json({ post });
  });

  // Public Newsletters & Magazines (strictly published only)
  app.get('/api/publications', (_req, res) => {
    const publications = db
      .prepare(
        `SELECT id, title, term, year, kind, description, file_url, created_at
         FROM publications
         WHERE status = 'published'
         ORDER BY year DESC, id DESC`
      )
      .all();
    res.json({ publications });
  });

  // Public Gallery
  app.get('/api/gallery', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const featured = req.query.featured === 'true';

    let items;
    if (featured) {
      items = db
        .prepare('SELECT * FROM gallery_items WHERE featured_home = 1 ORDER BY sort_order ASC, id ASC')
        .all();
    } else if (category && category !== 'All') {
      items = db
        .prepare('SELECT * FROM gallery_items WHERE category = ? ORDER BY sort_order ASC, id ASC')
        .all(category);
    } else {
      items = db.prepare('SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC').all();
    }
    res.json({ items });
  });

  // Public Contact Enquiry submission
  app.post('/api/enquiries', (req, res) => {
    const { name, phone, email, subject, message } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      typeof phone !== 'string' ||
      phone.trim().length < 7 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof message !== 'string' ||
      message.trim().length < 8
    ) {
      res.status(400).json({ error: 'Please provide a valid name, phone number, email address, and message.' });
      return;
    }

    const result = db
      .prepare(
        'INSERT INTO enquiries (name, phone, email, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(
        name.trim(),
        phone.trim(),
        email.trim().toLowerCase(),
        typeof subject === 'string' && subject.trim() ? subject.trim() : 'General Enquiry',
        message.trim(),
        'New'
      );

    res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Thank you. Your message has been received by our school office.',
    });
  });

  // Public School Visit Booking submission
  app.post('/api/visits', (req, res) => {
    const { parentName, phone, email, studentGrade, preferredDate, preferredSlot, notes } = req.body ?? {};
    if (
      typeof parentName !== 'string' ||
      parentName.trim().length < 2 ||
      typeof phone !== 'string' ||
      phone.trim().length < 7 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof preferredDate !== 'string' ||
      !preferredDate.trim()
    ) {
      res.status(400).json({ error: 'Please complete your name, phone, email, and preferred visit date.' });
      return;
    }

    const result = db
      .prepare(
        `INSERT INTO visit_bookings (parent_name, phone, email, student_grade, preferred_date, preferred_slot, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'New')`
      )
      .run(
        parentName.trim(),
        phone.trim(),
        email.trim().toLowerCase(),
        typeof studentGrade === 'string' && studentGrade.trim() ? studentGrade.trim() : 'Grade 10',
        preferredDate.trim(),
        typeof preferredSlot === 'string' && preferredSlot.trim() ? preferredSlot.trim() : '10:00 AM – 11:30 AM',
        typeof notes === 'string' ? notes.trim() : '',
      );

    res.status(201).json({
      id: result.lastInsertRowid,
      message: 'School visit request received. Our Admissions Office will confirm shortly.',
    });
  });

  // Staff Authentication
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const row = db
      .prepare('SELECT id, email, name, password_hash, role, active FROM users WHERE email = ?')
      .get(email.trim().toLowerCase()) as (StaffUser & { password_hash: string }) | undefined;

    if (!row || row.active !== 1 || !verifyPassword(password, row.password_hash)) {
      res.status(401).json({ error: 'Invalid staff email or password.' });
      return;
    }

    const token = signSessionToken(row.id, row.email);
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    res.json({
      user: { id: row.id, email: row.email, name: row.name, role: row.role },
    });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', requireStaffAuth, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.staffUser });
  });

  // Admin: Posts CRUD
  app.get('/api/admin/posts', requireStaffAuth, (_req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY published_at DESC, id DESC').all();
    res.json({ posts });
  });

  app.post('/api/admin/posts', requireStaffAuth, (req: AuthenticatedRequest, res) => {
    const { title, category, excerpt, body, cover_url, published_at, status } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length < 3 || typeof body !== 'string' || body.trim().length < 10) {
      res.status(400).json({ error: 'Title and article body are required.' });
      return;
    }

    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `post-${Date.now()}`;
    let uniqueSlug = baseSlug;
    let suffix = 1;
    while (db.prepare('SELECT id FROM posts WHERE slug = ?').get(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${suffix++}`;
    }

    const cleanExcerpt =
      typeof excerpt === 'string' && excerpt.trim()
        ? excerpt.trim()
        : body.trim().replace(/\s+/g, ' ').slice(0, 155) + (body.trim().length > 155 ? '…' : '');
    const cleanStatus = status === 'published' ? 'published' : 'draft';
    const cleanDate =
      typeof published_at === 'string' && published_at.trim()
        ? published_at.trim()
        : new Date().toISOString().slice(0, 10);
    const cleanCover =
      typeof cover_url === 'string' && cover_url.trim()
        ? cover_url.trim()
        : '/src/assets/images/hero_carmel_campus_1795001368170.jpg';

    const result = db
      .prepare(
        `INSERT INTO posts (slug, title, category, excerpt, body, cover_url, published_at, status, author_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        uniqueSlug,
        title.trim(),
        typeof category === 'string' && category.trim() ? category.trim() : 'Announcements',
        cleanExcerpt,
        body.trim(),
        cleanCover,
        cleanDate,
        cleanStatus,
        req.staffUser?.name || 'School Communications'
      );

    const created = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ post: created });
  });

  app.put('/api/admin/posts/:id', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    const { title, category, excerpt, body, cover_url, published_at, status } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length < 3 || typeof body !== 'string' || body.trim().length < 10) {
      res.status(400).json({ error: 'Title and article body are required.' });
      return;
    }

    const cleanExcerpt =
      typeof excerpt === 'string' && excerpt.trim()
        ? excerpt.trim()
        : body.trim().replace(/\s+/g, ' ').slice(0, 155);

    db.prepare(
      `UPDATE posts
       SET title = ?, category = ?, excerpt = ?, body = ?, cover_url = ?, published_at = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      title.trim(),
      typeof category === 'string' && category.trim() ? category.trim() : 'Announcements',
      cleanExcerpt,
      body.trim(),
      typeof cover_url === 'string' && cover_url.trim()
        ? cover_url.trim()
        : '/src/assets/images/hero_carmel_campus_1795001368170.jpg',
      typeof published_at === 'string' && published_at.trim()
        ? published_at.trim()
        : new Date().toISOString().slice(0, 10),
      status === 'published' ? 'published' : 'draft',
      id
    );

    const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json({ post: updated });
  });

  app.patch('/api/admin/posts/:id/status', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const nextStatus = req.body?.status === 'published' ? 'published' : 'draft';
    const info = db
      .prepare("UPDATE posts SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .run(nextStatus, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }
    res.json({ post: db.prepare('SELECT * FROM posts WHERE id = ?').get(id) });
  });

  app.delete('/api/admin/posts/:id', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }
    res.json({ ok: true });
  });

  // Admin: Publications (Newsletters & Magazines)
  app.get('/api/admin/publications', requireStaffAuth, (_req, res) => {
    const publications = db.prepare('SELECT * FROM publications ORDER BY year DESC, id DESC').all();
    res.json({ publications });
  });

  app.post('/api/admin/publications', requireStaffAuth, (req, res) => {
    const { title, term, year, kind, description, file_url, status } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length < 2 || typeof file_url !== 'string' || !file_url.trim()) {
      res.status(400).json({ error: 'Title and uploaded PDF file are required.' });
      return;
    }

    const cleanKind = kind === 'Magazine' || kind === 'Admissions' ? kind : 'Newsletter';
    const cleanStatus = status === 'draft' ? 'draft' : 'published';
    const cleanYear = Number(year) || new Date().getFullYear();

    const result = db
      .prepare(
        `INSERT INTO publications (title, term, year, kind, description, file_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        title.trim(),
        typeof term === 'string' && term.trim() ? term.trim() : 'Term I',
        cleanYear,
        cleanKind,
        typeof description === 'string' ? description.trim() : '',
        file_url.trim(),
        cleanStatus
      );

    res.status(201).json({
      publication: db.prepare('SELECT * FROM publications WHERE id = ?').get(result.lastInsertRowid),
    });
  });

  app.patch('/api/admin/publications/:id/status', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const nextStatus = req.body?.status === 'published' ? 'published' : 'draft';
    const info = db.prepare('UPDATE publications SET status = ? WHERE id = ?').run(nextStatus, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Publication not found.' });
      return;
    }
    res.json({ publication: db.prepare('SELECT * FROM publications WHERE id = ?').get(id) });
  });

  app.delete('/api/admin/publications/:id', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM publications WHERE id = ?').run(id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Publication not found.' });
      return;
    }
    res.json({ ok: true });
  });

  // Admin: Enquiries & Visit Bookings
  app.get('/api/admin/enquiries', requireStaffAuth, (_req, res) => {
    const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
    res.json({ enquiries });
  });

  app.patch('/api/admin/enquiries/:id', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const status = req.body?.status;
    if (status !== 'New' && status !== 'Reviewed' && status !== 'Responded') {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }
    const info = db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }
    res.json({ enquiry: db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) });
  });

  app.get('/api/admin/visits', requireStaffAuth, (_req, res) => {
    const visits = db.prepare('SELECT * FROM visit_bookings ORDER BY id DESC').all();
    res.json({ visits });
  });

  app.patch('/api/admin/visits/:id', requireStaffAuth, (req, res) => {
    const id = Number(req.params.id);
    const status = req.body?.status;
    if (status !== 'New' && status !== 'Confirmed' && status !== 'Completed') {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }
    const info = db.prepare('UPDATE visit_bookings SET status = ? WHERE id = ?').run(status, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Visit booking not found.' });
      return;
    }
    res.json({ visit: db.prepare('SELECT * FROM visit_bookings WHERE id = ?').get(id) });
  });

  // Admin: File Upload (cover images + PDFs)
  app.post('/api/admin/upload', requireStaffAuth, (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err.message || 'Upload failed.' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'No file selected.' });
        return;
      }
      const isPdf =
        req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
      const subDir = isPdf ? 'docs' : 'images';
      res.json({ url: `/uploads/${subDir}/${req.file.filename}`, filename: req.file.originalname });
    });
  });

  // Vite dev middleware or static dist serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apostolic Carmel server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
