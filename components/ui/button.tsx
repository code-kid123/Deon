import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-luxe disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir",
  {
    variants: {
variant: {
        /* Champagne gold: the primary conversion. */
        default: "bg-gold text-noir hover:bg-gold-soft active:bg-gold-deep hover:shadow-glow",
        /* Hairline ghost for secondary conversions on dark surfaces. */
        outline: "border border-bone/25 text-bone hover:border-gold hover:text-gold hover:bg-bone/[0.04]",
        "outline-solid":
          "border border-bone/60 text-bone hover:bg-bone hover:text-noir",
        ghost: "text-bone hover:bg-bone/[0.07] hover:text-gold",
        secondary: "bg-bone/[0.06] text-bone hover:bg-bone/[0.12]",
        link: "text-gold underline-offset-8 hover:underline normal-case tracking-normal",
        destructive: "bg-destructive text-white hover:brightness-110"
      },
      size: {
        sm: "h-9 px-4 text-[0.625rem]",
        default: "h-11 px-7",
        lg: "h-14 px-9",
        icon: "h-10 w-10 px-0",
        "icon-lg": "h-12 w-12 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const buttonClassName = (props: VariantProps<typeof buttonVariants> = {}) =>
  cn(buttonVariants(props));

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";