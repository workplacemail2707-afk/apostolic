import {
  Cross,
  BookOpen,
  ShieldCheck,
  HeartHandshake,
  Leaf,
  Compass,
  Award,
  Smile,
  Flag,
} from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero, TimelineStep, ValueTile } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { CORE_VALUES, type CoreValueItem } from '@/src/data/schoolContent';
import { SCHOOL_INFO } from '@/src/lib/utils';

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

export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Us & Carmel Heritage"
        description="History of Apostolic Carmel Girls' Secondary School in Buru Buru Phase V, our Sisters' congregation since 1868, vision, mission, values, and liturgy."
        path="/about"
      />

      <Hero
        compact
        eyebrow="Our Identity & Heritage"
        title="Rooted in Carmel, Serving Nairobi"
        subtitle="A Catholic girls' day and boarding secondary school on the campus of Blessed Sacrament Church, under the Catholic Archdiocese of Nairobi."
      />

      {/* Principal's Full Message */}
      <Section id="principal" surface="white">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SchoolImage
              src="/src/assets/images/principal_sr_joanita_1795001368865.jpg"
              alt="Sr. Joanita AC, Principal"
              arch
              className="aspect-[3/4] max-w-[340px]"
            />
            <p className="mt-4 font-display text-[19px] text-[var(--brown)]">{SCHOOL_INFO.principal}</p>
            <p className="text-[14px] text-[#665246]">Principal, Apostolic Carmel Girls’ Secondary School</p>
          </div>
          <div className="lg:col-span-8 space-y-5">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Welcome Note
            </p>
            <h2 className="font-display text-[var(--brown)]">
              Walking together in faith, discipline, and discovery
            </h2>
            <p className="text-[17px] leading-[28px] text-[#5C4639]">
              Dear Parents, Guardians, and Prospective Students, welcome to Apostolic Carmel Girls’ Secondary School in Buru Buru Phase V. Every morning, as our students cross the courtyard beneath the shadow of Blessed Sacrament Church, we are reminded that education is sacred work: forming capable minds, compassionate hearts, and resilient young women.
            </p>
            <p className="text-[17px] leading-[28px] text-[#5C4639]">
              Whether your daughter joins us as a day scholar from Nairobi’s neighbourhoods or as a boarder from across Kenya, she enters a family-spirited convent school where Sisters and dedicated lay teachers know each girl by name. Our Senior School pathways are thoughtfully supported by serene study rooms, active laboratories, and an ethos of joyful order.
            </p>
          </div>
        </div>
      </Section>

      {/* Our History */}
      <Section id="history" surface="cream">
        <div className="max-w-3xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
            Our History
          </p>
          <h2 className="mt-2 font-display text-[var(--brown)]">
            From Bayonne in 1868 to Buru Buru Phase V
          </h2>
          <p className="mt-4 text-[17px] leading-[28px] text-[#5C4639]">
            The Congregation of the Sisters of the Apostolic Carmel was founded in Bayonne, France in 1868 by Mother Veronica of the Passion, with a missionary dedication to educating young women. Arriving in East Africa in 1991, the Sisters partnered with the Catholic Archdiocese of Nairobi on the campus of Blessed Sacrament Church in Buru Buru Phase V—establishing our secondary school and opening the boarding wing in 2008.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TimelineStep
            step="1868"
            title="Founded in Bayonne"
            description="Mother Veronica of the Passion establishes the Apostolic Carmel in Bayonne, France to form young women through faith and learning."
          />
          <TimelineStep
            step="1991"
            title="Arrival in East Africa"
            description="The Sisters of the Apostolic Carmel begin their educational mission in East Africa, rooted in community service."
          />
          <TimelineStep
            step="2008"
            title="Boarding Wing Opens"
            description="Alongside day scholars on the Blessed Sacrament Church campus, the school welcomes boarders from across Kenya."
          />
          <TimelineStep
            step="Today"
            title="Senior School Pathways"
            description="Continuing under the Catholic Archdiocese of Nairobi with modern laboratories, e-learning, and Grade 10 CBE readiness."
          />
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section id="vision" surface="white">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[16px] border border-[var(--line)] bg-[var(--cream)] p-8">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Our Vision
            </p>
            <h2 className="mt-2 font-display text-[28px] leading-[36px] text-[var(--brown)]">
              Seeking the Heights in Faith & Truth
            </h2>
            <p className="mt-4 text-[17px] leading-[28px] text-[#5C4639]">
              To be a beacon of holistic Catholic education that nurtures intellectually curious, morally upright, and service-driven young women who transform Kenya and the wider world.
            </p>
          </div>

          <div className="rounded-[16px] border border-[var(--line)] bg-[var(--cream)] p-8">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Our Mission
            </p>
            <h2 className="mt-2 font-display text-[28px] leading-[36px] text-[var(--brown)]">
              Forming Mind, Character & Spirit
            </h2>
            <p className="mt-4 text-[17px] leading-[28px] text-[#5C4639]">
              To provide an enabling, disciplined, and compassionate learning environment rooted in Carmelite spirituality, academic rigour, leadership formation, and eco-stewardship.
            </p>
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section id="values" surface="plum">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-white/80">
            Nine Pillars
          </p>
          <h2 className="mt-2 font-display text-white">Core Values</h2>
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

      {/* Motto, Anthem & Spirituality */}
      <Section id="spirituality" surface="white">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
                Motto & Anthem
              </p>
              <h2 className="mt-2 font-display text-[var(--brown)]">“Seeking the Heights”</h2>
              <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
                Our school motto calls every Carmelite scholar to aim beyond the ordinary—in honesty, academic diligence, and charity—inspired by Our Lady of Mount Carmel.
              </p>
            </div>
            <div className="rounded-[14px] border border-[var(--line)] bg-[var(--cream)] p-6">
              <h3 className="font-display text-[20px] text-[var(--plum)]">School Anthem</h3>
              <p className="mt-3 whitespace-pre-line font-display italic text-[16px] leading-[28px] text-[var(--brown)]">
                {`Seeking the heights with hearts sincere,\nGuided by truth and grace each year,\nApostolic Carmel, steady and bright,\nWalking in faith, wisdom, and light.\n\nUnited in service, joyful and free,\nBuilding a future of dignity.`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <SchoolImage
              src="/src/assets/images/life_boarding_chapel_1795001370747.jpg"
              alt="Apostolic Carmel chapel sanctuary"
              className="aspect-[16/10]"
            />
            <div>
              <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
                Spirituality & Liturgy
              </p>
              <h2 className="mt-2 font-display text-[28px] leading-[36px] text-[var(--brown)]">
                A Rhythm of Prayer & Welcome
              </h2>
              <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
                Students begin each day with morning reflection, celebrate weekly Eucharistic liturgy in partnership with Blessed Sacrament Parish, and participate in annual class retreats. Students of all Christian denominations and faiths are warmly respected.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
