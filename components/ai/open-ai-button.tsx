"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Opens the DEON AI panel from anywhere on the page.
 *
 * The panel is a sibling controlled by `AiStylist`; this dispatches a custom event
 * rather than reaching into that component's state, so the launcher stays the only
 * owner of open/closed.
 */
export function OpenAiButton() {
  function open() {
    window.dispatchEvent(new CustomEvent("deon:open-ai"));
  }

  return (
    <Button onClick={open} size="lg">
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      Open DEON AI
    </Button>
  );
}