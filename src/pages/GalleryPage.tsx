import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { cn } from '@/src/lib/utils';
import type { GalleryItem } from '@/src/types/school';

const CATEGORIES = ['All', 'Campus', 'Academics', 'Music & Debate', 'Sports', 'Liturgy', 'Boarding'];

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchGallery() {
      setLoading(true);
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setItems(data.items || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchGallery();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filtered.length) % filtered.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, filtered.length]);

  const activeItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <SeoHead
        title="Campus & Student Gallery"
        description="Photographs of Apostolic Carmel Girls' Secondary School campus, science labs, choir, sports, chapel liturgy, and boarding life in Buru Buru Phase V."
        path="/gallery"
      />

      <Hero
        compact
        eyebrow="Campus Moments"
        title="Gallery"
        subtitle="Glimpses of daily life across our Buru Buru Phase V courtyard, laboratories, sports courts, music stage, and chapel."
      />

      <Section surface="white">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter gallery by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxIndex(null);
              }}
              className={cn(
                'min-h-[40px] rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                activeCategory === cat
                  ? 'bg-[var(--plum)] text-white'
                  : 'border border-[var(--line)] bg-white text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-[14px] border border-[var(--line)] bg-[var(--cream)]/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-10 text-[#5C4639]">No photographs found in this category yet.</p>
        ) : (
          <div className="mt-8 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="group block w-full break-inside-avoid overflow-hidden rounded-[14px] border border-[var(--line)] bg-white text-left transition-colors hover:border-[var(--plum)] cursor-pointer"
              >
                <SchoolImage
                  src={item.image_url}
                  alt={item.caption || item.title}
                  className={cn(
                    'rounded-none border-0 border-b border-[var(--line)]',
                    idx % 3 === 0 ? 'aspect-[4/3]' : idx % 3 === 1 ? 'aspect-[3/4]' : 'aspect-square'
                  )}
                  imgClassName="group-hover:scale-[1.03]"
                />
                <div className="p-4">
                  <p className="text-[12px] font-medium text-[var(--orange)]">{item.category}</p>
                  <h2 className="mt-1 font-display text-[19px] leading-[26px] text-[var(--brown)]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#5C4639]">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* Lightbox */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brown)]/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[16px] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black">
              <img
                src={activeItem.image_url}
                alt={activeItem.caption || activeItem.title}
                referrerPolicy="no-referrer"
                className="mx-auto max-h-[68vh] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close lightbox"
                className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--brown)] hover:bg-white cursor-pointer"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)
                    }
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--brown)] hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % filtered.length)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--brown)] hover:bg-white cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
              <div>
                <p className="text-[13px] font-medium text-[var(--orange)]">{activeItem.category}</p>
                <h3 className="mt-0.5 font-display text-[22px] text-[var(--brown)]">{activeItem.title}</h3>
                <p className="mt-1 text-[15px] text-[#5C4639]">{activeItem.caption}</p>
              </div>
              <span className="text-[13px] text-[#665246] tabular-nums">
                {lightboxIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
