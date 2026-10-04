import * as React from "react";
import { cn } from "@/lib/utils";

const fieldClassName =
  "flex h-12 w-full border border-bone/12 bg-noir px-4 py-2.5 font-sans text-sm text-bone " +
  "transition-colors placeholder:text-bone/30 " +
  "hover:border-bone/25 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 " +
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/40 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldClassName, className)} {...props} />
  )
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClassName, "h-auto py-3", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldClassName, "appearance-none pr-9", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";