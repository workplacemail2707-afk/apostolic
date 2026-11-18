import { Link } from 'react-router-dom';
import { Music, Trophy, Users, Home, HeartHandshake, ArrowRight } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { Button } from '@/src/components/ui/button';

const CLUBS = [
  'Young Christian Students (YCS) & Legion of Mary',
  'Debate, Public Speaking & Journalism Club',
  'Kenya Science & Engineering Fair Club',
  'Environmental & Eco-Carmel Society',
  'Music, Choir & Traditional Folk Dance',
  'Drama & Choral Verse Ensemble',
  'Red Cross & First Aid Brigade',
  'Mathematics & Robotics Circle',
];

export function SchoolLifePage() {
  return (
    <>
      <SeoHead
        title="School Life & Boarding"
        description="Co-curricular clubs, music festivals, netball and athletics, student leadership, boarding life since 2008, and guidance & counselling."
        path="/school-life"
      />

      <Hero
        compact
        eyebrow="Holistic Formation"
        title="Life Beyond the Classroom"
        subtitle="At Apostolic Carmel, friendships, talents, and spiritual poise flourish across our clubs, sports courts, student leadership council, and boarding family."
      />

      {/* Co-curricular & Sports */}
      <Section surface="white">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <SchoolImage
              src="/src/assets/images/life_sports_netball_1795001370293.jpg"
              alt="Apostolic Carmel netball match on campus court"
              className="aspect-[4/3]"
            />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--orange)]">
              <Trophy className="h-4 w-4" strokeWidth={1.5} />
              <span>Co-Curricular Activities</span>
            </div>
            <h2 className="font-display text-[var(--brown)]">
              Music Festivals, Debate & Athletics
            </h2>
            <p className="text-[17px] leading-[28px] text-[#5C4639]">
              Every student participates in at least one sport and one club each week. Our choir and verse speakers compete proudly in the Kenya National Music & Drama Festivals, while our netball, volleyball, basketball, and athletics teams foster teamwork and vitality.
            </p>
          </div>
        </div>
      </Section>

      {/* Clubs & Student Leadership */}
      <Section surface="cream">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--orange)]">
              <Music className="h-4 w-4" strokeWidth={1.5} />
              <span>Clubs & Societies</span>
            </div>
            <h2 className="mt-2 font-display text-[var(--brown)]">Spaces to Discover New Gifts</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CLUBS.map((club) => (
                <div
                  key={club}
                  className="rounded-[12px] border border-[var(--line)] bg-white px-4 py-3.5 text-[15px] font-medium text-[var(--brown)]"
                >
                  {club}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full rounded-[16px] border border-[var(--line)] bg-white p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--cream)] text-[var(--plum)]">
                <Users className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-display text-[24px] text-[var(--brown)]">
                Student Leadership Council
              </h3>
              <p className="mt-3 text-[16px] leading-[26px] text-[#5C4639]">
                Elected class representatives, house captains, chapel prefects, and the Student Council partner closely with the Principal and teaching staff. Leadership is taught as quiet, accountable service to peers.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Boarding Life & Guidance */}
      <Section surface="white">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--orange)]">
                <Home className="h-4 w-4" strokeWidth={1.5} />
                <span>Boarding Life Since 2008</span>
              </div>
              <h2 className="mt-2 font-display text-[var(--brown)]">
                A Safe, Structured Home in Nairobi
              </h2>
              <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
                Our boarding wing offers clean, well-ventilated dormitories, nutritious balanced meals, supervised evening prep, and warm weekend family activities under the caring presence of resident Sisters and matrons.
              </p>
            </div>

            <div className="rounded-[14px] border border-[var(--line)] bg-[var(--cream)] p-6">
              <div className="flex items-center gap-2 text-[15px] font-medium text-[var(--plum)]">
                <HeartHandshake className="h-5 w-5" strokeWidth={1.5} />
                <span>Guidance & Counselling</span>
              </div>
              <p className="mt-2 text-[15px] leading-[24px] text-[#5C4639]">
                Dedicated chaplaincy and professional school counsellors support girls’ emotional wellbeing, peer relationships, study habits, and personal resilience through one-on-one mentoring and small family groups.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="primary">
                <Link to="/gallery">
                  <span>View Campus Photos</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admissions">Apply for Boarding</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SchoolImage
              src="/src/assets/images/life_music_debate_1795001369409.jpg"
              alt="Apostolic Carmel students singing together in choir uniforms"
              className="aspect-[4/3]"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
