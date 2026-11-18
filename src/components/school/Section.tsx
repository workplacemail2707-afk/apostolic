import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export type SectionSurface = 'white' | 'cream' | 'plum';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  surface?: SectionSurface;
  containerClassName?: string;
  noPadding?: boolean;
  animate?: boolean;
}

export function Section({
  surface = 'white',
  className,
  containerClassName,
  noPadding = false,
  animate = true,
  children,
  ...props
}: SectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const surfaceStyles: Record<SectionSurface, string> = {
    white: 'bg-white text-[var(--brown)]',
    cream: 'bg-[var(--cream)] text-[var(--brown)]',
    plum: 'bg-[var(--plum)] text-white',
  };

  return (
    <section
      className={cn(surfaceStyles[surface], !noPadding && 'section-pad', className)}
      {...props}
    >
      {animate && !prefersReducedMotion ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', containerClassName)}
        >
          {children}
        </motion.div>
      ) : (
        <div className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
