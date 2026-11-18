import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Section } from '@/src/components/school/Section';
import { SchoolImage } from '@/src/components/school/SchoolImage';
import { Button } from '@/src/components/ui/button';
import { formatDateShort } from '@/src/lib/utils';
import type { Post } from '@/src/types/school';

export function NewsPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadPost() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/posts/${encodeURIComponent(slug || '')}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setPost(data.post);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Section surface="white">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--cream)]" />
          <div className="h-12 w-full rounded bg-[var(--cream)]" />
          <div className="h-80 w-full rounded-[14px] bg-[var(--cream)]" />
        </div>
      </Section>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <SeoHead title="Article Not Found" description="The requested school article could not be found." path={`/news/${slug || ''}`} />
        <Section surface="white">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="font-display text-[36px] text-[var(--brown)]">Article not found</h1>
            <p className="mt-3 text-[17px] text-[#5C4639]">
              This announcement may have been archived or unpublished.
            </p>
            <Button asChild variant="primary" className="mt-6">
              <Link to="/news">Return to News & Events</Link>
            </Button>
          </div>
        </Section>
      </>
    );
  }

  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <SeoHead title={post.title} description={post.excerpt} path={`/news/${post.slug}`} />

      <Section surface="white">
        <article className="mx-auto max-w-3xl">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--plum)] hover:text-[var(--plum-dark)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span>Back to News & Events</span>
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#665246]">
            <span className="font-medium text-[var(--orange)]">{post.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at} className="tabular-nums">
              {formatDateShort(post.published_at)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.author_name}</span>
          </div>

          <h1 className="mt-3 font-display text-[var(--brown)]">{post.title}</h1>
          <p className="mt-4 text-[19px] leading-[30px] text-[#5C4639]">{post.excerpt}</p>

          <div className="mt-8">
            <SchoolImage
              src={post.cover_url}
              alt={post.title}
              lazy={false}
              className="aspect-[16/9]"
            />
          </div>

          <div className="mt-10 space-y-6 text-[17px] leading-[30px] text-[var(--brown)]">
            {paragraphs.map((para, idx) => {
              if (para.startsWith('## ')) {
                return (
                  <h2 key={idx} className="pt-2 font-display text-[26px] leading-[34px] text-[var(--plum)]">
                    {para.slice(3)}
                  </h2>
                );
              }
              return <p key={idx}>{para}</p>;
            })}
          </div>
        </article>
      </Section>
    </>
  );
}
