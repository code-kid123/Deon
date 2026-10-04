"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { answer, GREETING, type StylistReply } from "@/lib/ai/stylist";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
  links?: { label: string; href: string }[];
};

const SUGGESTIONS = [
  "What size should I order?",
  "I have a wedding in Lagos",
  "Tell me about the academy"
];

let messageId = 0;

/**
 * Floating DEON AI stylist launcher and chat panel.
 *
 * Backed by a deterministic rule-based knowledge base so it responds usefully with
 * no API key configured. Replace `answer()` with an Anthropic call when wiring a
 * real model.
 */
export function AiStylist() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: GREETING }
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    // Other surfaces (e.g. the homepage CTA) open the panel via this event rather
    // than prop drilling state through the tree.
    const onOpen = () => setOpen(true);
    window.addEventListener("deon:open-ai", onOpen);
    return () => window.removeEventListener("deon:open-ai", onOpen);
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: messageId++, role: "user", text: trimmed }
    ]);
    setInput("");
    setTyping(true);

    // Simulated latency; mirrors what a real model call would introduce.
    window.setTimeout(() => {
      const reply: StylistReply = answer(trimmed);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: messageId++, role: "assistant", text: reply.text, links: reply.links }
      ]);
    }, 620);
  }

  return (
    <>
      {/* Launcher + invitation tooltip */}
      <div className="fixed bottom-5 right-5 z-[55] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        {open ? null : (
          <div
            role="note"
            className="pointer-events-none absolute -top-14 right-0 hidden whitespace-nowrap border border-gold/25 bg-noir/95 px-3.5 py-2 font-sans text-[0.625rem] uppercase tracking-[0.14em] text-bone/80 shadow-lift backdrop-blur sm:block"
          >
            Ask DEON AI for styling tips, sizes, or course details.
            <span
              aria-hidden
              className="absolute -bottom-px right-5 h-2 w-2 rotate-45 border-b border-r border-gold/25 bg-noir/95"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="deon-ai-panel"
          aria-label={open ? "Close DEON AI stylist" : "Open DEON AI stylist"}
          className={cn(
            "group relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 ease-luxe",
            open
              ? "border-gold/40 bg-bone/10 text-gold"
              : "border-gold/50 bg-gold text-noir hover:shadow-glow"
          )}
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Sparkles className="h-5 w-5" strokeWidth={1.5} />
          )}

          {open ? null : (
            <span
              aria-hidden
              className="absolute inset-0 -z-10 animate-ping rounded-full border border-gold/30"
            />
          )}
        </button>
      </div>

      {/* Panel */}
      <div
        id="deon-ai-panel"
        role="dialog"
        aria-modal={false}
        aria-label="DEON AI stylist"
        className={cn(
          "fixed bottom-24 right-4 z-[56] flex w-[calc(100vw-2rem)] max-w-[24rem] flex-col border border-bone/12 bg-noir/95 shadow-lift backdrop-blur-xl transition-all duration-500 ease-luxe sm:right-8",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
        style={{ height: "min(32rem, calc(100dvh - 9rem))" }}
      >
        <header className="flex items-center gap-3 border-b border-bone/10 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="flex flex-col">
            <p className="font-serif text-base leading-none text-bone">DEON AI</p>
            <p className="mt-1 font-sans text-[0.5625rem] uppercase tracking-[0.2em] text-gold/80">
              Styling &amp; course advisor
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close DEON AI stylist"
            className="ml-auto text-bone/45 transition-colors hover:text-gold"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex flex-col gap-2", message.role === "user" && "items-end")}
            >
              <div
                className={cn(
                  "max-w-[92%] px-4 py-3 font-sans text-[0.8125rem] leading-relaxed",
                  message.role === "user"
                    ? "bg-gold/15 text-bone"
                    : "border border-bone/10 bg-bone/[0.04] text-bone/90"
                )}
              >
                {message.text}
              </div>

              {message.links?.length ? (
                <ul className="flex max-w-[92%] flex-col gap-1.5">
                  {message.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group inline-flex items-center gap-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-gold hover:text-gold-soft"
                      >
                        {link.label}
                        <ArrowUpRight
                          className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          {typing ? (
            <div className="flex gap-1.5 px-1 py-1" aria-label="DEON AI is typing">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/70"
                  style={{ animationDelay: `${dot * 160}ms` }}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Suggestions, only before the first question */}
        {messages.length === 1 ? (
          <div className="flex flex-wrap gap-2 border-t border-bone/10 px-5 py-3">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-bone/15 px-3 py-1.5 font-sans text-[0.625rem] uppercase tracking-[0.12em] text-bone/70 transition-colors hover:border-gold hover:text-gold"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-bone/10 px-5 py-4"
        >
          <label htmlFor="deon-ai-input" className="sr-only">
            Message DEON AI
          </label>
          <input
            id="deon-ai-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about sizing, an occasion, a course…"
            className="w-full bg-transparent font-sans text-sm text-bone outline-none placeholder:text-bone/30"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 font-sans text-[0.625rem] uppercase tracking-[0.16em] text-gold transition-opacity disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}