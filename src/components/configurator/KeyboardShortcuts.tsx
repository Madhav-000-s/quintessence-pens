"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  // Show shortcuts helper on ? key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["←", "→"], description: "Switch between sections" },
        { keys: ["P"], description: "Toggle pricing details" },
      ],
    },
    {
      category: "Actions",
      items: [
        { keys: ["Ctrl/⌘", "S"], description: "Share configuration" },
        { keys: ["Ctrl/⌘", "D"], description: "Download configuration" },
        { keys: ["Ctrl/⌘", "R"], description: "Reset to defaults" },
      ],
    },
    {
      category: "Help",
      items: [
        { keys: ["?"], description: "Show keyboard shortcuts" },
        { keys: ["Esc"], description: "Close dialogs" },
      ],
    },
  ];

  return (
    <>

      {/* Shortcuts overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close shortcuts"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {shortcuts.map((category) => (
                <div key={category.category}>
                  <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div
                        key={item.description}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{item.description}</span>
                        <div className="flex gap-1">
                          {item.keys.map((key) => (
                            <kbd
                              key={key}
                              className="inline-flex min-w-[2rem] items-center justify-center rounded border border-muted bg-muted/50 px-2 py-1 font-mono text-xs font-semibold"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Press <kbd className="rounded border bg-muted px-1 py-0.5">?</kbd>{" "}
              anytime to view shortcuts
            </p>
          </div>
        </>
      )}
    </>
  );
}
