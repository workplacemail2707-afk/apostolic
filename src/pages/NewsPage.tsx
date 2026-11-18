import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { Button } from '@/src/components/ui/button';
import { cn, formatDateShort } from '@/src/lib/utils';
import type { Post } from '@/src/types/school';

const NEWS_CATEGORIES = ['All', 'Admissions', 'Academics', 'Events', 'Spirituality', 'Announcements'];

export function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setPosts(data.posts || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = category === 'All' ? posts : posts.filter((p) => p.category === category);

  return (
    <>
      <SeoHead
        title="News & Events"
        description="Latest announcements, academic distinctions, music festival highlights, and pastoral events at Apostolic Carmel Girls' Secondary School."
        path="/news"
      />

      <Hero
        compact
        eyebrow="Campus Chronicle"
        title="News & Events"
        subtitle="Updates from our Principal’s office, academic departments, boarding community, and diocesan calendar."
        actions={
          <Button asChild variant="outline">
            <Link to="/publications">
              <FileText className="h-4 w-4 text-[var(--plum)]" strokeWidth={1.5} />
              <span>View Magazines & Newsletters</span>
            </Link>
          </Button>
        }
      />

      <Section surface="white">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter news by category">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'min-h-[40px] rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
                category === cat
                  ? 'bg-[var(--plum)] text-white'
                  : 'border border-[var(--line)] bg-white text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[340px] rounded-[14px] border border-[var(--line)] bg-[var(--cream)]/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-[14px] border border-[var(--line)] bg-[var(--cream)] p-8 text-center">
            <p className="font-display text-[20px] text-[var(--brown)]">
              No published stories in {category} yet.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setCategory('All')}>
              View All Categories
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
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
                    <h2 className="mt-3 font-display text-[21px] leading-[28px] text-[var(--brown)] group-hover:text-[var(--plum)] transition-colors">
                      {post.title}
                    </h2>
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
    </>
  );
}
