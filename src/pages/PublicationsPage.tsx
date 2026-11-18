import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { cn } from '@/src/lib/utils';
import type { Publication } from '@/src/types/school';

const PUB_KINDS = ['All', 'Newsletter', 'Magazine', 'Admissions'];

export function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [kind, setKind] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadPubs() {
      setLoading(true);
      try {
        const res = await fetch('/api/publications');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setPublications(data.publications || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPubs();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = kind === 'All' ? publications : publications.filter((p) => p.kind === kind);

  return (
    <>
      <SeoHead
        title="Magazines & Newsletters"
        description="Download termly parent newsletters, The Carmel Echo, and the annual Seeking the Heights school magazine in PDF format."
        path="/publications"
      />

      <Hero
        compact
        eyebrow="School Publications"
        title="Magazines & Newsletters"
        subtitle="Termly letters from the Principal, academic calendars, and our annual school magazine—lightweight PDF downloads designed for mobile reading."
      />

      <Section surface="white">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter publications">
          {PUB_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={cn(
                'min-h-[40px] rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                kind === k
                  ? 'bg-[var(--plum)] text-white'
                  : 'border border-[var(--line)] bg-white text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)]'
              )}
            >
              {k}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-52 rounded-[14px] border border-[var(--line)] bg-[var(--cream)]/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-10 text-[#5C4639]">No publications available in this category yet.</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pub) => (
              <div
                key={pub.id}
                className="flex flex-col justify-between rounded-[14px] border border-[var(--line)] bg-[var(--cream)]/55 p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-[var(--orange)]">{pub.kind}</span>
                    <span className="text-[13px] text-[#665246] tabular-nums">
                      {pub.term} · {pub.year}
                    </span>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[var(--line)] bg-white text-[var(--plum)]">
                      <FileText className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h2 className="font-display text-[21px] leading-[28px] text-[var(--brown)]">
                      {pub.title}
                    </h2>
                  </div>
                  {pub.description && (
                    <p className="mt-3 text-[15px] leading-[24px] text-[#5C4639]">{pub.description}</p>
                  )}
                </div>

                <div className="mt-6 border-t border-[var(--line)] pt-4">
                  <a
                    href={pub.file_url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--plum)] px-5 py-2 text-[14px] font-medium text-white hover:bg-[var(--plum-dark)] transition-colors"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.5} />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
