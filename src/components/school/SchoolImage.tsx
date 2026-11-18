import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SchoolImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  arch?: boolean;
  lazy?: boolean;
  slotLabel?: string;
}

export function SchoolImage({
  src,
  alt,
  className,
  imgClassName,
  arch = false,
  lazy = true,
  slotLabel,
}: SchoolImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[var(--cream)] border border-[var(--line)]',
        arch ? 'arch-mask' : 'rounded-[14px]',
        className
      )}
    >
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover transition-transform duration-500', imgClassName)}
        />
      ) : (
        <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--cream)] to-[#EFE7DF] p-6 text-center text-[#665246]">
          <ImageIcon className="h-7 w-7 text-[var(--plum)]/60" strokeWidth={1.5} />
          <span className="font-display text-[15px] text-[var(--brown)]">{slotLabel || alt}</span>
        </div>
      )}
    </div>
  );
}
