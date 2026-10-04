import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 border px-2.5 py-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.18em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-gold/40 bg-gold/10 text-gold",
        secondary: "border-bone/15 bg-bone/[0.05] text-muted-foreground",
        outline: "border-bone/25 text-bone/80",
        solid: "border-transparent bg-gold text-noir",
        muted: "border-transparent bg-noir/70 text-bone",
        destructive: "border-transparent bg-destructive text-white",
        success: "border-transparent bg-emerald-500/90 text-white"
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      shape: "pill"
    }
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, shape }), className)} {...props} />;
}