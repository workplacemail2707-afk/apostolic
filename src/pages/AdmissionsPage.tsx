import { useState } from 'react';
import { Check, Download, Calendar } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero, TimelineStep } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { VisitBookingModal } from '@/src/components/school/VisitBookingModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { Button } from '@/src/components/ui/button';
import { ADMISSIONS_FAQS, FEE_SCHEDULE_BY_TERM } from '@/src/data/schoolContent';
import { SCHOOL_INFO } from '@/src/lib/utils';

const REQUIREMENTS = [
  'Certified copy of the student’s Birth Certificate',
  'Junior School Assessment / Grade 9 progress report & school leaving certificate',
  'Two recent passport-size colour photographs',
  'Copy of Baptismal Certificate (for Catholic applicants; students of all faiths welcome)',
  'Copy of Parent / Guardian National ID or Passport',
  'Non-refundable Registration & Interview Fee of Ksh 2,500',
];

export function AdmissionsPage() {
  const [visitOpen, setVisitOpen] = useState(false);

  return (
    <>
      <SeoHead
        title="Admissions & School Fees"
        description="Grade 10 admissions requirements, termly Day and Boarding school fees, application steps, downloadable PDF form, and parent FAQs."
        path="/admissions"
      />

      <Hero
        compact
        eyebrow="Admissions"
        title="Joining Apostolic Carmel"
        subtitle="Clear requirements, transparent termly fee structures, and personal guidance from our Sisters and Admissions Office."
        actions={
          <>
            <a
              href="/uploads/docs/grade-10-application-form.pdf"
              download="Apostolic-Carmel-Grade-10-Application-Form.pdf"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--orange)] px-7 py-3 text-[16px] font-medium text-white hover:bg-[#A64714] transition-colors"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              <span>Download Application Form (PDF)</span>
            </a>
            <Button variant="outline" size="lg" onClick={() => setVisitOpen(true)}>
              <Calendar className="h-4 w-4 text-[var(--plum)]" strokeWidth={1.5} />
              <span>Book a School Visit</span>
            </Button>
          </>
        }
      />

      {/* Requirements */}
      <Section id="requirements" surface="white">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
              Checklist
            </p>
            <h2 className="mt-2 font-display text-[var(--brown)]">Entry Requirements</h2>
            <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
              We admit motivated young women entering Grade 10 (Day or Boarding) as well as qualified transfer students where spaces permit.
            </p>
            <div className="mt-6 rounded-[14px] border border-[var(--line)] bg-[var(--cream)] p-6">
              <p className="text-[13px] text-[#665246]">Registration & Interview Fee</p>
              <p className="mt-1 font-display text-[32px] font-medium text-[var(--orange)] tabular-nums">
                {SCHOOL_INFO.registrationFee}
              </p>
              <p className="mt-2 text-[14px] leading-[22px] text-[#5C4639]">
                Payable upon submission of your application form at the Accounts Office or via school paybill shared during booking.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[16px] border border-[var(--line)] bg-white p-6 md:p-8">
              <h3 className="font-display text-[22px] text-[var(--brown)]">Documents to Submit</h3>
              <ul className="mt-5 divide-y divide-[var(--line)]">
                {REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-start gap-3 py-3.5 text-[16px] leading-[24px] text-[#5C4639]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--plum)]">
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* School Fees Accordion */}
      <Section id="fees" surface="cream">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
            Fee Schedule (Indicative Figures)
          </p>
          <h2 className="mt-2 font-display text-[var(--brown)]">School Fees by Term</h2>
          <p className="mt-3 text-[17px] leading-[28px] text-[#5C4639]">
            Select any term below to inspect the itemized Day Scholar and Boarding fee breakdown. Official fee letters are issued with admission offers.
          </p>
        </div>

        <div className="mt-8 rounded-[16px] border border-[var(--line)] bg-white px-6 md:px-8">
          <Accordion type="single" collapsible defaultValue="term-1">
            {FEE_SCHEDULE_BY_TERM.map((term) => (
              <AccordionItem key={term.termId} value={term.termId} className="last:border-b-0">
                <AccordionTrigger>
                  <div className="flex flex-wrap items-center justify-between gap-4 pr-4 w-full">
                    <span className="font-display text-[20px] font-medium text-[var(--brown)]">
                      {term.termTitle}
                    </span>
                    <span className="text-[14px] font-medium text-[var(--plum)] tabular-nums">
                      Day: {term.dayTotal} · Boarding: {term.boardingTotal}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto rounded-[12px] border border-[var(--line)]">
                    <table className="w-full border-collapse text-left text-[15px]">
                      <thead>
                        <tr className="border-b border-[var(--line)] bg-[var(--cream)] text-[13px] font-medium text-[#5C4639]">
                          <th className="px-4 py-3">Fee Component</th>
                          <th className="px-4 py-3 text-right">Day Scholar</th>
                          <th className="px-4 py-3 text-right">Boarding</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {term.rows.map((row) => (
                          <tr key={row.item}>
                            <td className="px-4 py-3 text-[var(--brown)]">{row.item}</td>
                            <td className="px-4 py-3 text-right text-[#5C4639] tabular-nums">{row.dayAmount}</td>
                            <td className="px-4 py-3 text-right text-[#5C4639] tabular-nums">{row.boardingAmount}</td>
                          </tr>
                        ))}
                        <tr className="bg-[var(--cream)]/60 font-medium text-[var(--brown)]">
                          <td className="px-4 py-3">Term Total</td>
                          <td className="px-4 py-3 text-right text-[var(--plum)] tabular-nums">{term.dayTotal}</td>
                          <td className="px-4 py-3 text-right text-[var(--plum)] tabular-nums">{term.boardingTotal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Application Process & Download */}
      <Section id="apply" surface="white">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
            How to Apply
          </p>
          <h2 className="mt-2 font-display text-[var(--brown)]">Application Process</h2>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TimelineStep
            step="01"
            title="Download Form"
            description="Download the Grade 10 PDF form below or collect a copy at the Buru Buru V gate reception."
          />
          <TimelineStep
            step="02"
            title="Submit Documents"
            description="Return the completed form with birth certificate, Grade 9 report, and Ksh 2,500 registration fee."
          />
          <TimelineStep
            step="03"
            title="Student Interview"
            description="Your daughter meets our teachers for a brief diagnostic check and a warm values conversation."
          />
          <TimelineStep
            step="04"
            title="Admission Offer"
            description="Successful families receive an official admission letter, uniform guide, and termly fee schedule."
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[16px] border border-[var(--line)] bg-[var(--cream)] p-6 md:flex-row md:items-center md:p-8">
          <div>
            <h3 className="font-display text-[24px] text-[var(--brown)]">
              2027 Grade 10 Application Form (PDF)
            </h3>
            <p className="mt-1 text-[15px] text-[#5C4639]">
              Printable 1-page official admissions form · Includes Day & Boarding and CBE pathway selection.
            </p>
          </div>
          <a
            href="/uploads/docs/grade-10-application-form.pdf"
            download="Apostolic-Carmel-Grade-10-Application-Form.pdf"
            className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-[var(--orange)] px-6 py-3 text-[15px] font-medium text-white hover:bg-[#A64714] transition-colors"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            <span>Download Form (PDF)</span>
          </a>
        </div>
      </Section>

      {/* FAQs */}
      <Section id="faq" surface="cream">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.06em] uppercase text-[var(--orange)]">
            Parent Questions
          </p>
          <h2 className="mt-2 font-display text-[var(--brown)]">Frequently Asked Questions</h2>
        </div>

        <div className="mt-8 rounded-[16px] border border-[var(--line)] bg-white px-6 md:px-8">
          <Accordion type="single" collapsible>
            {ADMISSIONS_FAQS.map((faq, idx) => (
              <AccordionItem key={faq.q} value={`faq-${idx}`} className="last:border-b-0">
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <VisitBookingModal open={visitOpen} onOpenChange={setVisitOpen} />
    </>
  );
}
