import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-full text-[15px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] disabled:pointer-events-none disabled:opacity-50 min-h-[44px] cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--plum)] text-white hover:bg-[var(--plum-dark)]',
        accent: 'bg-[var(--orange)] text-white hover:bg-[#A64714]',
        outline:
          'border border-[var(--line)] bg-white text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)]',
        outlineLight:
          'border border-white/75 bg-transparent text-white hover:bg-white/15',
        ghost: 'text-[var(--brown)] hover:bg-[var(--cream)] hover:text-[var(--plum)]',
        subtle: 'bg-[var(--cream)] text-[var(--brown)] hover:bg-[#F2EAE2]',
        destructive: 'bg-[#B42318] text-white hover:bg-[#912018]',
      },
      size: {
        default: 'px-6 py-2.5',
        sm: 'min-h-[38px] px-4 py-1.5 text-[14px]',
        lg: 'min-h-[48px] px-7 py-3 text-[16px]',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
