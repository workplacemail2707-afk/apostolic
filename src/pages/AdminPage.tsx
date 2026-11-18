import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Upload,
  FileText,
  Mail,
  Calendar,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Button } from '@/src/components/ui/button';
import { Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from '@/src/components/ui/forms';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { cn, formatDateShort } from '@/src/lib/utils';
import type { Enquiry, Post, Publication, StaffUser, VisitBooking } from '@/src/types/school';

const PRESET_COVERS = [
  { label: 'Campus Courtyard', url: '/src/assets/images/hero_carmel_campus_1795001368170.jpg' },
  { label: 'Science Laboratory', url: '/src/assets/images/life_academics_lab_1795001369517.jpg' },
  { label: 'Music Festival Choir', url: '/src/assets/images/life_music_debate_1795001369409.jpg' },
  { label: 'Netball Court', url: '/src/assets/images/life_sports_netball_1795001370293.jpg' },
  { label: 'Convent Chapel', url: '/src/assets/images/life_boarding_chapel_1795001370747.jpg' },
];

export function AdminPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard data
  const [posts, setPosts] = useState<Post[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [bannerMsg, setBannerMsg] = useState('');

  // Post Editor Dialog
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Admissions');
  const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 10));
  const [postCover, setPostCover] = useState(PRESET_COVERS[0].url);
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postStatus, setPostStatus] = useState<'published' | 'draft'>('published');
  const [savingPost, setSavingPost] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Publication Upload Dialog
  const [pubModalOpen, setPubModalOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState('');
  const [pubTerm, setPubTerm] = useState('Term I');
  const [pubYear, setPubYear] = useState(String(new Date().getFullYear()));
  const [pubKind, setPubKind] = useState<'Newsletter' | 'Magazine' | 'Admissions'>('Newsletter');
  const [pubDesc, setPubDesc] = useState('');
  const [pubFileUrl, setPubFileUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [savingPub, setSavingPub] = useState(false);

  const flashBanner = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(''), 3500);
  };

  const loadAllAdminData = async () => {
    const [pRes, pubRes, eRes, vRes] = await Promise.all([
      fetch('/api/admin/posts'),
      fetch('/api/admin/publications'),
      fetch('/api/admin/enquiries'),
      fetch('/api/admin/visits'),
    ]);
    if (pRes.ok) setPosts((await pRes.json()).posts || []);
    if (pubRes.ok) setPublications((await pubRes.json()).publications || []);
    if (eRes.ok) setEnquiries((await eRes.json()).enquiries || []);
    if (vRes.ok) setVisits((await vRes.json()).visits || []);
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          await loadAllAdminData();
        }
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed.');
      } else {
        setUser(data.user);
        await loadAllAdminData();
      }
    } catch {
      setLoginError('Network error signing in.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const openNewPost = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostCategory('Admissions');
    setPostDate(new Date().toISOString().slice(0, 10));
    setPostCover(PRESET_COVERS[0].url);
    setPostExcerpt('');
    setPostBody('');
    setPostStatus('published');
    setPostModalOpen(true);
  };

  const openEditPost = (post: Post) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostCategory(post.category);
    setPostDate(post.published_at);
    setPostCover(post.cover_url);
    setPostExcerpt(post.excerpt);
    setPostBody(post.body);
    setPostStatus(post.status === 'published' ? 'published' : 'draft');
    setPostModalOpen(true);
  };

  const handleUploadAsset = async (file: File, target: 'cover' | 'pdf') => {
    const formData = new FormData();
    formData.append('file', file);
    if (target === 'cover') setUploadingCover(true);
    else setUploadingPdf(true);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        flashBanner(data.error || 'Upload failed.');
        return;
      }
      if (target === 'cover') setPostCover(data.url);
      else setPubFileUrl(data.url);
      flashBanner('File uploaded successfully.');
    } finally {
      setUploadingCover(false);
      setUploadingPdf(false);
    }
  };

  const handleSavePost = async (e: FormEvent) => {
    e.preventDefault();
    setSavingPost(true);
    try {
      const payload = {
        title: postTitle,
        category: postCategory,
        published_at: postDate,
        cover_url: postCover,
        excerpt: postExcerpt,
        body: postBody,
        status: postStatus,
      };
      const url = editingPost ? `/api/admin/posts/${editingPost.id}` : '/api/admin/posts';
      const method = editingPost ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setPostModalOpen(false);
        await loadAllAdminData();
        flashBanner(editingPost ? 'Article updated.' : 'Article created.');
      }
    } finally {
      setSavingPost(false);
    }
  };

  const togglePostStatus = async (post: Post) => {
    const next = post.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/admin/posts/${post.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      await loadAllAdminData();
      flashBanner(`Article marked as ${next}.`);
    }
  };

  const deletePost = async (id: number) => {
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadAllAdminData();
      flashBanner('Article deleted.');
    }
  };

  const handleSavePub = async (e: FormEvent) => {
    e.preventDefault();
    if (!pubFileUrl) {
      flashBanner('Please upload a PDF file first.');
      return;
    }
    setSavingPub(true);
    try {
      const res = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pubTitle,
          term: pubTerm,
          year: Number(pubYear),
          kind: pubKind,
          description: pubDesc,
          file_url: pubFileUrl,
          status: 'published',
        }),
      });
      if (res.ok) {
        setPubModalOpen(false);
        setPubTitle('');
        setPubDesc('');
        setPubFileUrl('');
        await loadAllAdminData();
        flashBanner('Publication added.');
      }
    } finally {
      setSavingPub(false);
    }
  };

  const togglePubStatus = async (pub: Publication) => {
    const next = pub.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/admin/publications/${pub.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      await loadAllAdminData();
      flashBanner(`Publication marked as ${next}.`);
    }
  };

  const deletePub = async (id: number) => {
    const res = await fetch(`/api/admin/publications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadAllAdminData();
      flashBanner('Publication removed.');
    }
  };

  const updateEnquiryStatus = async (id: number, status: Enquiry['status']) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await loadAllAdminData();
  };

  const updateVisitStatus = async (id: number, status: VisitBooking['status']) => {
    const res = await fetch(`/api/admin/visits/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await loadAllAdminData();
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cream)] p-6">
        <p className="text-[16px] text-[#5C4639]">Checking staff session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <SeoHead
          title="Staff Admin Login"
          description="Protected communications and admissions dashboard for Apostolic Carmel Girls' Secondary School staff."
          path="/admin"
        />
        <div className="flex min-h-screen flex-col justify-center bg-[var(--cream)] px-4 py-12">
          <div className="mx-auto w-full max-w-md rounded-[16px] border border-[var(--line)] bg-white p-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--plum)] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span>Return to School Website</span>
            </Link>

            <h1 className="mt-6 font-display text-[30px] leading-[38px] text-[var(--brown)]">
              Staff Portal Sign-In
            </h1>
            <p className="mt-2 text-[15px] text-[#5C4639]">
              Authorized Apostolic Carmel staff only. Manage news posts, newsletters, and parent enquiries.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {loginError && (
                <div
                  role="alert"
                  className="rounded-[12px] border border-[#F04438]/30 bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]"
                >
                  {loginError}
                </div>
              )}

              <div>
                <Label htmlFor="staff-email">Staff Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="principal@apostoliccarmel.ac.ke"
                />
              </div>

              <div>
                <Label htmlFor="staff-password">Password</Label>
                <Input
                  id="staff-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter staff password"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loggingIn}>
                {loggingIn ? 'Signing in…' : 'Sign In to Dashboard'}
              </Button>
            </form>

            <div className="mt-6 rounded-[12px] border border-[var(--line)] bg-[var(--cream)] p-4 text-[13px] leading-[20px] text-[#5C4639]">
              <p className="font-medium text-[var(--brown)]">Seeded Staff Account (Demo)</p>
              <p className="mt-1">
                Email: <code className="font-mono text-[var(--plum)]">principal@apostoliccarmel.ac.ke</code>
                <br />
                Password: <code className="font-mono text-[var(--plum)]">CarmelHeights2026!</code>
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('principal@apostoliccarmel.ac.ke');
                  setLoginPassword('CarmelHeights2026!');
                }}
                className="mt-2 text-[13px] font-medium text-[var(--orange)] hover:underline cursor-pointer"
              >
                Fill demo staff credentials
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoHead
        title="Staff Admin Dashboard"
        description="Manage published news, newsletters, and parent enquiries."
        path="/admin"
      />
      <div className="min-h-screen bg-[var(--cream)]">
        {/* Minimal Admin Header */}
        <header className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-display text-[20px] font-medium text-[var(--plum)]">
                Apostolic Carmel
              </Link>
              <span className="text-[13px] text-[#665246]">· Staff Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-[14px] text-[#5C4639] sm:inline">
                {user.name} ({user.role})
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          {bannerMsg && (
            <div
              role="status"
              className="mb-6 flex items-center gap-2 rounded-[12px] border border-[var(--plum)]/30 bg-white px-4 py-3 text-[14px] font-medium text-[var(--plum)]"
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              <span>{bannerMsg}</span>
            </div>
          )}

          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">News & Events ({posts.length})</TabsTrigger>
              <TabsTrigger value="publications">Newsletters & Magazines ({publications.length})</TabsTrigger>
              <TabsTrigger value="enquiries">
                Enquiries & Visits ({enquiries.length + visits.length})
              </TabsTrigger>
            </TabsList>

            {/* NEWS & EVENTS TAB */}
            <TabsContent value="posts">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-[28px] leading-[36px] text-[var(--brown)]">
                    News & Events
                  </h1>
                  <p className="text-[15px] text-[#5C4639]">
                    Only posts marked Published appear on the public website.
                  </p>
                </div>
                <Button variant="accent" onClick={openNewPost}>
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                  <span>New Post</span>
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col justify-between gap-4 rounded-[14px] border border-[var(--line)] bg-white p-5 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#665246]">
                        <span
                          className={cn(
                            'font-medium',
                            post.status === 'published' ? 'text-[var(--plum)]' : 'text-[var(--orange)]'
                          )}
                        >
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span>·</span>
                        <span>{post.category}</span>
                        <span>·</span>
                        <span className="tabular-nums">{formatDateShort(post.published_at)}</span>
                      </div>
                      <h2 className="mt-1 font-display text-[20px] text-[var(--brown)] truncate">
                        {post.title}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => togglePostStatus(post)}>
                        {post.status === 'published' ? (
                          <>
                            <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" strokeWidth={1.5} />
                            <span>Publish</span>
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditPost(post)}>
                        <Edit3 className="h-4 w-4" strokeWidth={1.5} />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${post.title}`}
                        onClick={() => deletePost(post.id)}
                        className="text-[#B42318] hover:bg-[#FEF3F2] hover:text-[#B42318]"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* PUBLICATIONS TAB */}
            <TabsContent value="publications">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-[28px] leading-[36px] text-[var(--brown)]">
                    Newsletters & Magazines
                  </h1>
                  <p className="text-[15px] text-[#5C4639]">
                    Upload PDF newsletters, annual magazines, and admissions circulars.
                  </p>
                </div>
                <Button variant="accent" onClick={() => setPubModalOpen(true)}>
                  <Upload className="h-4 w-4" strokeWidth={1.5} />
                  <span>Upload PDF Publication</span>
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="flex flex-col justify-between gap-4 rounded-[14px] border border-[var(--line)] bg-white p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--cream)] text-[var(--plum)]">
                        <FileText className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#665246] tabular-nums">
                          <span className="font-medium text-[var(--plum)]">
                            {pub.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                          <span>·</span>
                          <span>{pub.kind}</span>
                          <span>·</span>
                          <span>
                            {pub.term} {pub.year}
                          </span>
                        </div>
                        <h2 className="mt-0.5 font-display text-[19px] text-[var(--brown)]">{pub.title}</h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={pub.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[38px] items-center rounded-full border border-[var(--line)] px-4 text-[14px] font-medium text-[var(--brown)] hover:border-[var(--plum)]"
                      >
                        View PDF
                      </a>
                      <Button variant="outline" size="sm" onClick={() => togglePubStatus(pub)}>
                        {pub.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${pub.title}`}
                        onClick={() => deletePub(pub.id)}
                        className="text-[#B42318] hover:bg-[#FEF3F2]"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ENQUIRIES & VISITS TAB */}
            <TabsContent value="enquiries">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[var(--plum)]" strokeWidth={1.5} />
                    <h2 className="font-display text-[24px] text-[var(--brown)]">
                      Contact Enquiries ({enquiries.length})
                    </h2>
                  </div>

                  <div className="mt-4 space-y-4">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="rounded-[14px] border border-[var(--line)] bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-display text-[19px] text-[var(--brown)]">{enq.name}</span>
                          <select
                            aria-label={`Status for ${enq.name}`}
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(enq.id, e.target.value as Enquiry['status'])
                            }
                            className="h-9 rounded-full border border-[var(--line)] bg-[var(--cream)] px-3 text-[13px] font-medium text-[var(--brown)]"
                          >
                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Responded">Responded</option>
                          </select>
                        </div>
                        <p className="mt-1 text-[13px] text-[#665246] tabular-nums">
                          {enq.subject} · {enq.phone} · {enq.email}
                        </p>
                        <p className="mt-3 text-[15px] leading-[23px] text-[#5C4639]">{enq.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--orange)]" strokeWidth={1.5} />
                    <h2 className="font-display text-[24px] text-[var(--brown)]">
                      School Visit Bookings ({visits.length})
                    </h2>
                  </div>

                  <div className="mt-4 space-y-4">
                    {visits.map((v) => (
                      <div key={v.id} className="rounded-[14px] border border-[var(--line)] bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-display text-[19px] text-[var(--brown)]">{v.parent_name}</span>
                          <select
                            aria-label={`Visit status for ${v.parent_name}`}
                            value={v.status}
                            onChange={(e) =>
                              updateVisitStatus(v.id, e.target.value as VisitBooking['status'])
                            }
                            className="h-9 rounded-full border border-[var(--line)] bg-[var(--cream)] px-3 text-[13px] font-medium text-[var(--brown)]"
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <p className="mt-1 text-[13px] font-medium text-[var(--plum)] tabular-nums">
                          {v.preferred_date} · {v.preferred_slot} · {v.student_grade}
                        </p>
                        <p className="mt-1 text-[13px] text-[#665246] tabular-nums">
                          {v.phone} · {v.email}
                        </p>
                        {v.notes && <p className="mt-3 text-[15px] text-[#5C4639]">{v.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Create / Edit Post Modal */}
      <Dialog open={postModalOpen} onOpenChange={setPostModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit News Post' : 'Create News & Event Post'}</DialogTitle>
            <DialogDescription>
              Compose an announcement or story. Save as draft or publish immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePost} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="post-title">Headline</Label>
              <Input
                id="post-title"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g. Grade 10 Parent Orientation Date"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="post-category">Category</Label>
                <select
                  id="post-category"
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="flex h-11 w-full rounded-[12px] border border-[var(--line)] bg-white px-3 text-[15px]"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Academics">Academics</option>
                  <option value="Events">Events</option>
                  <option value="Spirituality">Spirituality</option>
                  <option value="Announcements">Announcements</option>
                </select>
              </div>
              <div>
                <Label htmlFor="post-date">Date</Label>
                <Input
                  id="post-date"
                  type="date"
                  required
                  value={postDate}
                  onChange={(e) => setPostDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="post-status">Visibility</Label>
                <select
                  id="post-status"
                  value={postStatus}
                  onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                  className="flex h-11 w-full rounded-[12px] border border-[var(--line)] bg-white px-3 text-[15px]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="post-cover">Cover Image</Label>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  id="post-cover"
                  value={postCover}
                  onChange={(e) => setPostCover(e.target.value)}
                  className="flex h-11 flex-1 rounded-[12px] border border-[var(--line)] bg-white px-3 text-[14px]"
                >
                  {PRESET_COVERS.map((c) => (
                    <option key={c.url} value={c.url}>
                      {c.label}
                    </option>
                  ))}
                  {!PRESET_COVERS.some((c) => c.url === postCover) && (
                    <option value={postCover}>Uploaded Image ({postCover})</option>
                  )}
                </select>
                <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--cream)] px-4 text-[14px] font-medium text-[var(--brown)] hover:border-[var(--plum)]">
                  <Upload className="h-4 w-4" strokeWidth={1.5} />
                  <span>{uploadingCover ? 'Uploading…' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadAsset(f, 'cover');
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="post-excerpt">Short Summary (1–2 lines)</Label>
              <Input
                id="post-excerpt"
                value={postExcerpt}
                onChange={(e) => setPostExcerpt(e.target.value)}
                placeholder="Optional short deck shown on cards"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Label htmlFor="post-body" className="mb-0">
                  Article Body (supports ## Subheadings and blank-line paragraphs)
                </Label>
                <button
                  type="button"
                  onClick={() => setPostBody((b) => `${b}${b ? '\n\n' : ''}## Section Heading\n`)}
                  className="text-[12px] font-medium text-[var(--plum)] hover:underline cursor-pointer"
                >
                  + Insert Subheading
                </button>
              </div>
              <Textarea
                id="post-body"
                required
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="min-h-[180px]"
                placeholder="Write the full school announcement or event report…"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setPostModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" disabled={savingPost}>
                {savingPost ? 'Saving…' : editingPost ? 'Save Changes' : 'Save Article'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Newsletter / Magazine Modal */}
      <Dialog open={pubModalOpen} onOpenChange={setPubModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Newsletter or Magazine</DialogTitle>
            <DialogDescription>
              Attach a PDF document so parents can download it from the website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePub} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="pub-title">Publication Title</Label>
              <Input
                id="pub-title"
                required
                value={pubTitle}
                onChange={(e) => setPubTitle(e.target.value)}
                placeholder="e.g. The Carmel Echo – Term I Newsletter"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="pub-kind">Type</Label>
                <select
                  id="pub-kind"
                  value={pubKind}
                  onChange={(e) => setPubKind(e.target.value as Publication['kind'])}
                  className="flex h-11 w-full rounded-[12px] border border-[var(--line)] bg-white px-3 text-[14px]"
                >
                  <option value="Newsletter">Newsletter</option>
                  <option value="Magazine">Magazine</option>
                  <option value="Admissions">Admissions</option>
                </select>
              </div>
              <div>
                <Label htmlFor="pub-term">Term</Label>
                <Input
                  id="pub-term"
                  required
                  value={pubTerm}
                  onChange={(e) => setPubTerm(e.target.value)}
                  placeholder="Term I"
                />
              </div>
              <div>
                <Label htmlFor="pub-year">Year</Label>
                <Input
                  id="pub-year"
                  type="number"
                  required
                  value={pubYear}
                  onChange={(e) => setPubYear(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pub-desc">Short Description</Label>
              <Input
                id="pub-desc"
                value={pubDesc}
                onChange={(e) => setPubDesc(e.target.value)}
                placeholder="Summary of highlights inside this issue"
              />
            </div>

            <div>
              <Label>PDF File</Label>
              <div className="flex items-center gap-3">
                <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--cream)] px-4 text-[14px] font-medium text-[var(--brown)] hover:border-[var(--plum)]">
                  <Upload className="h-4 w-4" strokeWidth={1.5} />
                  <span>{uploadingPdf ? 'Uploading PDF…' : 'Choose PDF File'}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadAsset(f, 'pdf');
                    }}
                  />
                </label>
                {pubFileUrl && (
                  <span className="truncate text-[13px] font-medium text-[var(--plum)]">
                    PDF ready
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setPubModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" disabled={savingPub}>
                {savingPub ? 'Publishing…' : 'Publish PDF'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
