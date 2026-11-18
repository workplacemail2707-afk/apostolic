import { Link } from 'react-router-dom';
import { FlaskConical, Globe, Palette, Laptop, BookMarked, ArrowRight } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero, StatCounter } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { Button } from '@/src/components/ui/button';

const PATHWAYS = [
  {
    title: 'STEM Pathway',
    subtitle: 'Science, Technology, Engineering & Mathematics',
    icon: FlaskConical,
    subjects: ['Pure Sciences (Biology, Chemistry, Physics)', 'Mathematics & Applied Sciences', 'Computer Science & ICT'],
    careers: 'Prepares scholars for Medicine, Engineering, Pharmacy, Data Science, Architecture, and Environmental Studies.',
  },
  {
    title: 'Social Sciences Pathway',
    subtitle: 'Humanities, Languages & Business',
    icon: Globe,
    subjects: ['History, Geography & Christian Religious Education', 'Business Studies & Economics', 'English, Kiswahili & Literature'],
    careers: 'Prepares scholars for Law, Diplomacy, Commerce, Education, Journalism, and Public Leadership.',
  },
  {
    title: 'Arts & Sports Science Pathway',
    subtitle: 'Creative Expression & Athletics',
    icon: Palette,
    subjects: ['Music & Performing Arts', 'Fine Art & Design', 'Physical Education & Sports Science'],
    careers: 'Prepares scholars for Music Education, Creative Design, Sports Management, and Cultural Leadership.',
  },
];

export function AcademicsPage() {
  return (
    <>
      <SeoHead
        title="Academics & Pathways"
        description="Senior School educational pathways (STEM, Social Sciences, Arts & Sports), academic performance metrics, science laboratories, library, and e-learning."
        path="/academics"
      />

      <Hero
        compact
        eyebrow="Scholarship & Inquiry"
        title="Educational Pathways Built for Clarity & Excellence"
        subtitle="Structured mentorship from Grade 10 through senior graduation, pairing Kenya's CBE Senior School pathways with strong foundations in languages, sciences, and digital literacy."
      />

      {/* Pathways */}
      <Section surface="white">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
            Senior School Curriculum
          </p>
          <h2 className="mt-2 font-display text-[var(--brown)]">Three Focused Pathways</h2>
          <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
            Every learner works with her class mentor to align subject combinations with her strengths and university aspirations.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PATHWAYS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="flex flex-col justify-between rounded-[14px] border border-[var(--line)] bg-white p-7"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--cream)] text-[var(--plum)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-display text-[24px] leading-[32px] text-[var(--brown)]">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[14px] font-medium text-[var(--orange)]">{p.subtitle}</p>
                  <ul className="mt-5 space-y-2 border-t border-[var(--line)] pt-4 text-[15px] text-[#5C4639]">
                    {p.subjects.map((sub) => (
                      <li key={sub}>· {sub}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-6 border-t border-[var(--line)] pt-4 text-[14px] leading-[22px] text-[#665246]">
                  {p.careers}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Academic Performance */}
      <Section surface="cream">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
            Academic Performance
          </p>
          <h2 className="mt-2 font-display text-[var(--brown)]">Steady, Measurable Growth</h2>
          <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
            Consistent daily prep, small-group laboratory practicals, and individualized academic clinics drive strong national examination outcomes.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCounter
            value={94}
            suffix="%"
            label="University & Tertiary Transition"
            detail="Graduates qualifying for degree and diploma programmes (indicative cohort average)."
          />
          <StatCounter
            value={8.4}
            decimals={1}
            label="School Mean Grade Score"
            detail="Steady B-grade average across recent national candidate cohorts."
          />
          <StatCounter
            value={100}
            suffix="%"
            label="Science Practical Readiness"
            detail="Dedicated Physics, Chemistry, and Biology laboratories with modern apparatus."
          />
          <StatCounter
            value={16}
            suffix=":1"
            label="Student-to-Teacher Ratio"
            detail="Attentive academic mentorship across class streams and evening prep."
          />
        </div>
      </Section>

      {/* Library & E-Learning */}
      <Section surface="white">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <SchoolImage
              src="/src/assets/images/life_academics_lab_1795001369517.jpg"
              alt="Apostolic Carmel students studying in the science laboratory"
              className="aspect-[4/3]"
            />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
                Learning Resources
              </p>
              <h2 className="mt-2 font-display text-[var(--brown)]">Library & E-Learning</h2>
              <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
                Our quiet library and networked ICT lab bridge print scholarship with supervised digital research—equipping girls for CBE project portfolios and university study.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[14px] border border-[var(--line)] bg-[var(--cream)] p-5">
                <BookMarked className="h-5 w-5 text-[var(--plum)]" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-[19px] text-[var(--brown)]">8,500+ Print Volumes</h3>
                <p className="mt-1 text-[14px] leading-[22px] text-[#5C4639]">
                  Reference texts, East African literature, periodicals, and quiet reading tables.
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--line)] bg-[var(--cream)] p-5">
                <Laptop className="h-5 w-5 text-[var(--plum)]" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-[19px] text-[var(--brown)]">ICT & E-Learning Lab</h3>
                <p className="mt-1 text-[14px] leading-[22px] text-[#5C4639]">
                  Guided coding, digital simulations, and curated offline-first study archives.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild variant="primary">
                <Link to="/admissions">
                  <span>Explore Grade 10 Admissions</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
