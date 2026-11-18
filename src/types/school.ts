export interface Post {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  cover_url: string;
  published_at: string;
  status?: 'published' | 'draft';
  author_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Publication {
  id: number;
  title: string;
  term: string;
  year: number;
  kind: 'Newsletter' | 'Magazine' | 'Admissions';
  description: string;
  file_url: string;
  status?: 'published' | 'draft';
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  caption: string;
  image_url: string;
  featured_home: number;
  sort_order: number;
}

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Reviewed' | 'Responded';
  created_at: string;
}

export interface VisitBooking {
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

export interface StaffUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}
