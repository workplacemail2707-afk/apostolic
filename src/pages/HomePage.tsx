import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  Wallet,
  BookOpen,
  MapPin,
  Cross,
  ShieldCheck,
  HeartHandshake,
  Leaf,
  Compass,
  Award,
  Smile,
  Flag,
  Download,
  Clock,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { Hero, TimelineStep, ValueTile } from '@/src/components/school/Primitives';
import { VisitBookingModal } from '@/src/components/school/VisitBookingModal';
import { Button } from '@/src/components/ui/button';
import { CORE_VALUES, CARMEL_FAMILY_SCHOOLS, MAP_DIRECTIONS_URL, MAP_EMBED_URL, type CoreValueItem } from '@/src/data/schoolContent';
import { formatDateShort, SCHOOL_INFO } from '@/src/lib/utils';
import type { Post, Publication } from '@/src/types/school';

const ICON_MAP: Record<CoreValueItem['iconName'], typeof Cross> = {
  Cross,
  BookOpen,
  ShieldCheck,
  HeartHandshake,
  Leaf,
  Compass,
  Award,
  Smile,
  Flag,
};

const QUICK_LINKS = [
  {
    title: 'Admissions',
    description: 'Entry criteria, interview dates, and downloadable Grade 10 forms.',
    to: '/admissions',
    icon: GraduationCap,
  },
  {
    title: 'School Fees',
    description: 'Clear term-by-term schedules for Day and Boarding scholars.',
    to: '/admissions#fees',
    icon: Wallet,
  },
  {
    title: 'Academic Pathways',
    description: 'CBE Senior School tracks, science labs, library, and results.',
    to: '/academics',
    icon: BookOpen,
  },
  {
    title: 'Contact & Location',
    description: 'Katulo Road, Buru Buru Phase V — directions, hours, and enquiries.',
    to: '/contact',
    icon: MapPin,
  },
];

const LIFE_GALLERY_TILES = [
  {
    title: 'Music Festivals & Debate',
    category: 'Co-curricular',
    image: '/src/assets/images/life_music_debate_1795001369409.jpg',
    alt: 'Apostolic Carmel Girls choir singing in purple blazers at the music festival',
  },
  {
    title: 'Science & Inquiry',
    category: 'Academics',
    image: '/src/assets/images/life_academics_lab_1795001369517.jpg',
    alt: 'Students conducting chemistry experiments in the bright science laboratory',
  },
  {
    title: 'Netball & Athletics',
    category: 'Sports',
    image: '/src/assets/images/life_sports_netball_1795001370293.jpg',
    alt: 'Girls playing netball on the outdoor school court in Nairobi sunshine',
  },
  {
    title: 'Chapel & Boarding Life',
    category: 'Liturgy & Community',
    image: '/src/assets/images/life_boarding_chapel_1795001370747.jpg',
    alt: 'Peaceful timber pews and stained glass windows inside the convent school chapel',
  },
];

export function HomePage() {
  const [visitOpen, setVisitOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadHomeData() {
      try {
        const [postsRes, pubsRes] = await Promise.all([
          fetch('/api/posts?limit=3'),
          fetch('/api/publications'),
        ]);
        if (postsRes.ok) {
          const data = await postsRes.json();
          if (!cancelled) setPosts(data.posts || []);
        }
        if (pubsRes.ok) {
          const data = await pubsRes.json();
          if (!cancelled) setPublications((data.publications || []).slice(0, 3));
        }
      } catch {
        // Silent recovery; empty state handles gracefully
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    }
    loadHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SeoHead
        title="Apostolic Carmel Girls' Secondary School – Seeking the Heights"
        description="Catholic day and boarding girls' secondary school in Buru Buru Phase V, Nairobi, Kenya. Grade 10 admissions, academic pathways, fees, and news."
        path="/"
      />

      {/* 1. Hero */}
      <Hero
        title="Seeking the Heights"
        subtitle="Nurturing young women of steadfast faith, academic excellence, and joyful character in the heart of Buru Buru Phase V."
        imageUrl="/src/assets/images/hero_carmel_campus_1795001368170.jpg"
        imageAlt="Sunlit courtyard and colonnades of Apostolic Carmel Girls' Secondary School in Nairobi"
        trustLine="Catholic convent school · Day & boarding · Buru Buru Phase V"
        actions={
          <>
            <Button asChild variant="accent" size="lg">
              <Link to="/admissions">Grade 10 Admissions Now Open</Link>
            </Button>
            <Button variant="outlineLight" size="lg" onClick={() => setVisitOpen(true)}>
              Book a School Visit
            </Button>
          </>
        }
      />

      {/* 2. Quick Links */}
      <Section surface="cream" aria-label="Parent quick links">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group flex flex-col justify-between rounded-[14px] border border-[var(--line)] bg-white p-6 transition-colors hover:border-[var(--plum)]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--cream)] text-[var(--orange)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="mt-4 font-display text-[22px] leading-[30px] font-medium text-[var(--brown)] group-hover:text-[var(--plum)] transition-colors">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-[24px] text-[#5C4639]">
                    {item.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--plum)]">
                  <span>Open</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* 3. Principal's Welcome */}
      <Section surface="white" aria-labelledby="principal-heading">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SchoolImage
              src="/src/assets/images/principal_sr_joanita_1795001368865.jpg"
              alt="Sr. Joanita AC, Principal of Apostolic Carmel Girls' Secondary School"
              arch
              className="mx-auto aspect-[3/4] max-w-[380px]"
              slotLabel="Principal's Portrait — Sr. Joanita AC"
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Principal’s Welcome
            </p>
            <h2 id="principal-heading" className="mt-2 font-display text-[var(--brown)]">
              A calm home where every girl is known, guided, and challenged to grow.
            </h2>
            <blockquote className="mt-6 font-display text-[21px] leading-[33px] italic text-[var(--plum-dark)]">
              “Education at Apostolic Carmel forms both mind and heart. When a girl feels deeply respected and gently stretched, she rises with quiet confidence toward all that God calls her to be.”
            </blockquote>
            <p className="mt-5 text-[17px] leading-[28px] text-[#5C4639]">
              Rooted in the Sisters of the Apostolic Carmel tradition and guided by Kenya’s Senior School curriculum, our day and boarding community walks closely with parents from orientation through graduation.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="font-display text-[18px] font-medium text-[var(--brown)]">
                  {SCHOOL_INFO.principal}
                </p>
                <p className="text-[14px] text-[#665246]">Principal, Apostolic Carmel Girls’ Secondary School</p>
              </div>
              <Link
                to="/about#principal"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--plum)] hover:text-[var(--plum-dark)]"
              >
                <span>Read more</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Our Core Values (Single Full-Color Plum Band) */}
      <Section surface="plum" aria-labelledby="values-heading">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-white/80">
            Formation & Ethos
          </p>
          <h2 id="values-heading" className="mt-2 font-display text-white">
            Our Core Values
          </h2>
          <p className="mt-3 text-[17px] leading-[28px] text-white/88">
            Nine guiding pillars lived daily in our classrooms, dormitories, chapel, and service across Nairobi.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((val) => {
            const Icon = ICON_MAP[val.iconName];
            return (
              <ValueTile
                key={val.id}
                onDark
                icon={<Icon className="h-5 w-5" strokeWidth={1.5} />}
                title={val.title}
                description={val.description}
              />
            );
          })}
        </div>
      </Section>

      {/* 5. Life at Carmel */}
      <Section surface="white" aria-labelledby="life-heading">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Student Community
            </p>
            <h2 id="life-heading" className="mt-2 font-display text-[var(--brown)]">
              Life at Carmel
            </h2>
            <p className="mt-2 text-[17px] leading-[28px] text-[#5C4639]">
              Debate, music festivals, athletics, quiet liturgy, and warm boarding sisterhood.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/gallery">Explore Full Gallery</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LIFE_GALLERY_TILES.map((tile) => (
            <Link key={tile.title} to="/gallery" className="group block">
              <SchoolImage
                src={tile.image}
                alt={tile.alt}
                className="aspect-[4/3]"
                imgClassName="group-hover:scale-[1.03]"
                slotLabel={tile.title}
              />
              <p className="mt-3 text-[13px] text-[#665246]">{tile.category}</p>
              <h3 className="mt-0.5 font-display text-[19px] leading-[26px] text-[var(--brown)] group-hover:text-[var(--plum)] transition-colors">
                {tile.title}
              </h3>
            </Link>
          ))}
        </div>
      </Section>

      {/* 6. Admissions in 4 Steps */}
      <Section surface="cream" aria-labelledby="admissions-steps-heading">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Simple & Transparent
            </p>
            <h2 id="admissions-steps-heading" className="mt-2 font-display text-[var(--brown)]">
              Admissions in 4 Steps
            </h2>
            <p className="mt-2 text-[17px] leading-[28px] text-[#5C4639]">
              Everything a parent needs to apply for Grade 10 Day or Boarding placement.
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--line)] bg-white px-5 py-3">
            <span className="text-[13px] text-[#665246]">Registration & Interview Fee</span>
            <p className="font-display text-[22px] font-medium text-[var(--orange)] tabular-nums">
              {SCHOOL_INFO.registrationFee}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TimelineStep
            step="Step 01"
            title="Requirements"
            description="Prepare birth certificate copy, Grade 9 assessment report, leaving certificate, and two passport photos."
            highlight="Catholic & all-faith applicants welcome"
          />
          <TimelineStep
            step="Step 02"
            title="School Fees"
            description="Review our clear Day and Boarding termly fee schedules and pathway resource expectations."
            highlight="View Day & Boarding fees"
          />
          <TimelineStep
            step="Step 03"
            title="Application"
            description="Download the official Grade 10 form or collect a printed copy from the Buru Buru V office."
            highlight="Reg. Fee: Ksh 2,500"
          />
          <TimelineStep
            step="Step 04"
            title="Interview"
            description="Attend a welcoming student assessment and parent conversation with our Admissions panel."
            highlight="Placement confirmed promptly"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild variant="accent">
            <Link to="/admissions">Start Application & View Fees</Link>
          </Button>
          <a
            href="/uploads/docs/grade-10-application-form.pdf"
            download="Apostolic-Carmel-Grade-10-Application-Form.pdf"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-2 text-[15px] font-medium text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
          >
            <Download className="h-4 w-4 text-[var(--orange)]" strokeWidth={1.5} />
            <span>Download Application Form (PDF)</span>
          </a>
        </div>
      </Section>

      {/* 7. Latest News */}
      <Section surface="white" aria-labelledby="news-heading">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Campus Chronicle
            </p>
            <h2 id="news-heading" className="mt-2 font-display text-[var(--brown)]">
              Latest News & Events
            </h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--plum)] hover:text-[var(--plum-dark)]"
          >
            <span>All news & events</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        {loadingPosts ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[340px] rounded-[14px] border border-[var(--line)] bg-[var(--cream)]/60 p-6" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-8 text-[#5C4639]">No published news articles yet. Check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/news/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[14px] border border-[var(--line)] bg-white transition-colors hover:border-[var(--plum)]"
              >
                <SchoolImage
                  src={post.cover_url}
                  alt={post.title}
                  className="aspect-[16/10] rounded-none border-0 border-b border-[var(--line)]"
                  imgClassName="group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[13px] text-[#665246]">
                      <span className="font-medium text-[var(--orange)]">{post.category}</span>
                      <time
                        dateTime={post.published_at}
                        className="rounded-[6px] border border-[var(--line)] bg-[var(--cream)] px-2.5 py-0.5 text-[12px] font-medium text-[var(--brown)] tabular-nums"
                      >
                        {formatDateShort(post.published_at)}
                      </time>
                    </div>
                    <h3 className="mt-3 font-display text-[21px] leading-[28px] text-[var(--brown)] group-hover:text-[var(--plum)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[15px] leading-[24px] text-[#5C4639]">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--plum)]">
                    <span>Read story</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* 8. Newsletters & Magazines Strip */}
      <Section surface="cream" aria-labelledby="publications-heading">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Parent Publications
            </p>
            <h2 id="publications-heading" className="mt-2 font-display text-[var(--brown)]">
              Newsletters & Magazines
            </h2>
          </div>
          <Link
            to="/publications"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--plum)] hover:text-[var(--plum-dark)]"
          >
            <span>Browse all issues</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="flex flex-col justify-between rounded-[14px] border border-[var(--line)] bg-white p-6"
            >
              <div>
                <p className="text-[13px] text-[#665246] tabular-nums">
                  {pub.kind} · {pub.term} {pub.year}
                </p>
                <h3 className="mt-1.5 font-display text-[20px] leading-[27px] text-[var(--brown)]">
                  {pub.title}
                </h3>
                {pub.description && (
                  <p className="mt-2 text-[14px] leading-[22px] text-[#5C4639]">{pub.description}</p>
                )}
              </div>
              <div className="mt-5">
                <a
                  href={pub.file_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-[14px] font-medium text-[var(--plum)] hover:border-[var(--plum)] hover:bg-[var(--cream)] transition-colors"
                >
                  <Download className="h-4 w-4" strokeWidth={1.5} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Our Carmel Family */}
      <Section surface="white" className="py-12 md:py-16 border-b border-[var(--line)]" noPadding aria-label="Our Carmel Family">
        <div className="py-12 md:py-16">
          <p className="text-center text-[13px] font-medium tracking-[0.06em] uppercase text-[#665246]">
            Our Carmel Family
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
            {CARMEL_FAMILY_SCHOOLS.map((name) => (
              <span
                key={name}
                className="font-display text-[17px] text-[var(--brown)]/80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* 10. Visit Us */}
      <Section surface="white" aria-labelledby="visit-heading">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-[16px] border border-[var(--line)] bg-[var(--cream)] p-6 md:p-8 lg:col-span-5">
            <div>
              <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
                Visit Us
              </p>
              <h2 id="visit-heading" className="mt-2 font-display text-[var(--brown)]">
                Buru Buru Phase V, Nairobi
              </h2>
              <p className="mt-3 text-[16px] leading-[26px] text-[#5C4639]">
                Our tranquil campus sits on the grounds of Blessed Sacrament Catholic Church along Katulo Road, easily accessible from Jogoo Road and Mumias South Road.
              </p>

              <dl className="mt-6 space-y-4 border-t border-[var(--line)] pt-6 text-[15px]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Physical & Postal Address</dt>
                    <dd className="text-[#5C4639]">
                      {SCHOOL_INFO.addressLine}
                      <br />
                      {SCHOOL_INFO.poBox}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Office & Visiting Hours</dt>
                    <dd className="text-[#5C4639]">{SCHOOL_INFO.hours}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Admissions & Reception</dt>
                    <dd className="text-[#5C4639] tabular-nums">
                      <a href={SCHOOL_INFO.phoneHref} className="hover:text-[var(--plum)] underline-offset-4 hover:underline">
                        {SCHOOL_INFO.phoneDisplay}
                      </a>
                      {' · '}
                      <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-[var(--plum)] underline-offset-4 hover:underline">
                        {SCHOOL_INFO.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="accent" onClick={() => setVisitOpen(true)}>
                Book a School Visit
              </Button>
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-2 text-[15px] font-medium text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
              >
                <span>Open in Maps</span>
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="min-h-[340px] overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--cream)] lg:col-span-7">
            <iframe
              title="Map showing Apostolic Carmel Girls' Secondary School in Buru Buru Phase V, Nairobi"
              src={MAP_EMBED_URL}
              loading="lazy"
              className="h-full min-h-[340px] w-full border-0"
            />
          </div>
        </div>
      </Section>

      <VisitBookingModal open={visitOpen} onOpenChange={setVisitOpen} />
    </>
  );
}
