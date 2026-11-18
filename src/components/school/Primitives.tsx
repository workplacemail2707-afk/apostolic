import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface HeroProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  imageUrl?: string;
  imageAlt?: string;
  trustLine?: string;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function Hero({
  title,
  subtitle,
  eyebrow,
  imageUrl,
  imageAlt,
  trustLine,
  actions,
  compact = false,
}: HeroProps) {
  const [imgError, setImgError] = useState(false);

  if (compact || !imageUrl) {
    return (
      <section className="border-b border-[var(--line)] bg-[var(--cream)] py-14 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-[13px] font-medium tracking-[0.08em] uppercase text-[var(--plum)]">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-[var(--brown)]">{title}</h1>
            <p className="mt-4 max-w-2xl text-[18px] leading-[30px] text-[#5C4639]">{subtitle}</p>
            {actions && <div className="mt-8 flex flex-wrap items-center gap-4">{actions}</div>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[var(--plum-dark)] text-white">
      <div className="absolute inset-0">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--plum)] to-[var(--brown)]" />
        )}
        {/* Soft plum-to-transparent measured scrim for >= 4.5:1 white text contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#4B1F43]/92 via-[#6B2F60]/76 to-[#3B2418]/35"
        />
      </div>

      <div className="relative mx-auto flex min-h-[540px] w-full max-w-[1200px] flex-col justify-center px-4 py-20 sm:px-6 md:min-h-[620px] lg:px-8">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-4 text-[13px] font-medium tracking-[0.08em] uppercase text-white/85">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-white">{title}</h1>
          <p className="mt-5 max-w-xl text-[18px] leading-[30px] text-white/92">{subtitle}</p>
          {actions && <div className="mt-8 flex flex-wrap items-center gap-4">{actions}</div>}
          {trustLine && (
            <p className="mt-8 border-t border-white/25 pt-5 text-[14px] tracking-[0.02em] text-white/85">
              {trustLine}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

interface ValueTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onDark?: boolean;
}

export function ValueTile({ icon, title, description, onDark = false }: ValueTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[14px] p-6 transition-colors',
        onDark
          ? 'border border-white/18 bg-white/[0.06] text-white'
          : 'border border-[var(--line)] bg-white text-[var(--brown)]'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-[10px]',
          onDark ? 'bg-white/12 text-white' : 'bg-[var(--cream)] text-[var(--orange)]'
        )}
      >
        {icon}
      </div>
      <h3
        className={cn(
          'font-display text-[20px] leading-[28px] font-medium',
          onDark ? 'text-white' : 'text-[var(--brown)]'
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'text-[15px] leading-[24px]',
          onDark ? 'text-white/85' : 'text-[#5C4639]'
        )}
      >
        {description}
      </p>
    </div>
  );
}

interface TimelineStepProps {
  step: string;
  title: string;
  description: string;
  highlight?: string;
}

export function TimelineStep({ step, title, description, highlight }: TimelineStepProps) {
  return (
    <div className="flex flex-col justify-between rounded-[14px] border border-[var(--line)] bg-white p-6">
      <div>
        <span className="font-display text-[15px] font-medium text-[var(--orange)] tabular-nums">
          {step}
        </span>
        <h3 className="mt-2 font-display text-[22px] leading-[30px] text-[var(--brown)]">{title}</h3>
        <p className="mt-2 text-[15px] leading-[24px] text-[#5C4639]">{description}</p>
      </div>
      {highlight && (
        <p className="mt-4 border-t border-[var(--line)] pt-3 text-[14px] font-medium text-[var(--plum)] tabular-nums">
          {highlight}
        </p>
      )}
    </div>
  );
}

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  detail: string;
  decimals?: number;
}

export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  detail,
  decimals = 0,
}: StatCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 900;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(value * eased);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setDisplayValue(value);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, prefersReducedMotion]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString();

  return (
    <div ref={ref} className="rounded-[14px] border border-[var(--line)] bg-white p-6">
      <div className="font-display text-[40px] leading-[48px] font-medium text-[var(--plum)] tabular-nums">
        {prefix}
        {formatted}
        {suffix}
      </div>
      <div className="mt-2 text-[17px] font-medium text-[var(--brown)]">{label}</div>
      <p className="mt-1 text-[14px] leading-[22px] text-[#5C4639]">{detail}</p>
    </div>
  );
}
