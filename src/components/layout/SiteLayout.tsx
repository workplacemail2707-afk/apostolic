import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { SCHOOL_INFO, cn } from '@/src/lib/utils';

const NAV_ITEMS = [
  { label: 'About', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'School Life', to: '/school-life' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[var(--brown)]">
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--plum)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Slim top contact bar */}
      <div className="border-b border-[var(--line)] bg-[var(--cream)] text-[13px] text-[#5C4639]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={SCHOOL_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 hover:text-[var(--plum)] transition-colors tabular-nums"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--orange)]" strokeWidth={1.5} />
              <span>{SCHOOL_INFO.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${SCHOOL_INFO.email}`}
              className="inline-flex items-center gap-1.5 hover:text-[var(--plum)] transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-[var(--orange)]" strokeWidth={1.5} />
              <span>{SCHOOL_INFO.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apostolic Carmel on Facebook"
              className="p-1 text-[#5C4639] hover:text-[var(--plum)] transition-colors"
            >
              <Facebook className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apostolic Carmel on Instagram"
              className="p-1 text-[#5C4639] hover:text-[var(--plum)] transition-colors"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apostolic Carmel on YouTube"
              className="p-1 text-[#5C4639] hover:text-[var(--plum)] transition-colors"
            >
              <Youtube className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Sticky white header */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 md:h-[72px] max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="font-display text-[20px] md:text-[22px] font-medium tracking-[-0.01em] text-[var(--plum)] whitespace-nowrap shrink-0"
          >
            Apostolic Carmel
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-[var(--brown)]"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors',
                    isActive
                      ? 'border-[var(--plum)] text-[var(--plum)]'
                      : 'border-transparent hover:border-[var(--line)] hover:text-[var(--plum)]'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
              <Link to="/admissions">Apply Now</Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)] lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 flex flex-col bg-white px-6 py-5 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-[22px] font-medium text-[var(--plum)]"
            >
              Apostolic Carmel
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--brown)] cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-[48px] items-center justify-between rounded-[12px] px-4 font-display text-[22px] font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--cream)] text-[var(--plum)]'
                      : 'text-[var(--brown)] hover:bg-[var(--cream)]'
                  )
                }
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-4 w-4 opacity-50" strokeWidth={1.5} />
              </NavLink>
            ))}
            <NavLink
              to="/publications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[48px] items-center justify-between rounded-[12px] px-4 font-display text-[22px] font-medium text-[var(--brown)] hover:bg-[var(--cream)]"
            >
              <span>Magazines & Newsletters</span>
              <ArrowUpRight className="h-4 w-4 opacity-50" strokeWidth={1.5} />
            </NavLink>
          </nav>

          <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-5">
            <Button asChild variant="accent" size="lg" className="w-full">
              <Link to="/admissions" onClick={() => setMobileMenuOpen(false)}>
                Apply Now
              </Link>
            </Button>
            <div className="flex items-center justify-between text-[14px] text-[#5C4639]">
              <a href={SCHOOL_INFO.phoneHref} className="hover:text-[var(--plum)]">
                {SCHOOL_INFO.phoneDisplay}
              </a>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--plum)]">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Brown Footer */}
      <footer className="bg-[var(--brown)] text-white pb-20 lg:pb-0">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2 pr-4">
              <p className="font-display text-[24px] font-medium text-white">
                {SCHOOL_INFO.name}
              </p>
              <p className="mt-2 font-display italic text-[17px] text-white/80">
                “{SCHOOL_INFO.tagline}”
              </p>
              <p className="mt-4 max-w-sm text-[15px] leading-[24px] text-white/75">
                A Catholic day and boarding convent school in Buru Buru Phase V, Nairobi, run by the Sisters of the Apostolic Carmel.
              </p>
              <div className="mt-6 space-y-2 text-[14px] text-white/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--amber)]" strokeWidth={1.5} />
                  <span>
                    {SCHOOL_INFO.addressLine}
                    <br />
                    {SCHOOL_INFO.poBox}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--amber)]" strokeWidth={1.5} />
                  <a href={SCHOOL_INFO.phoneHref} className="hover:text-white underline-offset-4 hover:underline tabular-nums">
                    {SCHOOL_INFO.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--amber)]" strokeWidth={1.5} />
                  <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-white underline-offset-4 hover:underline">
                    {SCHOOL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-[17px] font-medium text-white">School</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] text-white/78">
                <li><Link to="/about" className="hover:text-white transition-colors">Our History</Link></li>
                <li><Link to="/about#vision" className="hover:text-white transition-colors">Vision & Mission</Link></li>
                <li><Link to="/about#values" className="hover:text-white transition-colors">Core Values</Link></li>
                <li><Link to="/academics" className="hover:text-white transition-colors">Academic Pathways</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-[17px] font-medium text-white">Admissions</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] text-white/78">
                <li><Link to="/admissions" className="hover:text-white transition-colors">Grade 10 Entry</Link></li>
                <li><Link to="/admissions#fees" className="hover:text-white transition-colors">School Fees</Link></li>
                <li><Link to="/admissions#apply" className="hover:text-white transition-colors">Application Form</Link></li>
                <li><Link to="/admissions#faq" className="hover:text-white transition-colors">Parent FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-[17px] font-medium text-white">Community</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] text-white/78">
                <li><Link to="/school-life" className="hover:text-white transition-colors">School Life & Boarding</Link></li>
                <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
                <li><Link to="/news" className="hover:text-white transition-colors">News & Events</Link></li>
                <li><Link to="/publications" className="hover:text-white transition-colors">Newsletters & Magazines</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Location</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-8 text-[14px] text-white/70 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/admin" className="hover:text-white transition-colors">
                Staff Portal
              </Link>
              <a
                href={SCHOOL_INFO.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp Admissions
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile sticky thumb-friendly bottom bar (Call · WhatsApp · Apply) */}
      <div
        aria-label="Quick parent actions"
        className="fixed bottom-0 left-0 right-0 z-40 grid h-13 grid-cols-3 border-t border-[var(--line)] bg-white/98 backdrop-blur-sm lg:hidden"
      >
        <a
          href={SCHOOL_INFO.phoneHref}
          className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[var(--brown)] hover:bg-[var(--cream)] active:bg-[var(--cream)]"
        >
          <Phone className="h-4 w-4 text-[var(--plum)]" strokeWidth={1.5} />
          <span>Call</span>
        </a>
        <a
          href={SCHOOL_INFO.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 border-x border-[var(--line)] text-[14px] font-medium text-[var(--brown)] hover:bg-[var(--cream)] active:bg-[var(--cream)]"
        >
          <MessageCircle className="h-4 w-4 text-[var(--plum)]" strokeWidth={1.5} />
          <span>WhatsApp</span>
        </a>
        <Link
          to="/admissions"
          className="flex items-center justify-center bg-[var(--orange)] text-[14px] font-medium text-white hover:bg-[#A64714]"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
