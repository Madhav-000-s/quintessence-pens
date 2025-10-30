"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { toast } from "sonner";

export function AIDesignButton() {
  const { applyAIDesign, isLoadingAI } = useConfiguratorStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    try {
      await applyAIDesign();

      // Get fresh state after applyAIDesign completes
      const { aiSuggestion, aiError } = useConfiguratorStore.getState();

      if (aiSuggestion) {
        toast.success("AI Design Applied!", {
          description: `Why suggested: ${aiSuggestion}`,
          duration: 6000,
        });
      } else {
        toast.success("AI Design Applied!", {
          description: "Your personalized design has been applied",
          duration: 6000,
        });
      }
    } catch (error) {
      const { aiError } = useConfiguratorStore.getState();
      toast.error("Failed to generate AI design", {
        description: aiError || "Please try again later",
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoadingAI}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group fixed bottom-8 left-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#d4af37] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Generate AI Design Suggestion"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d03f] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />

      {/* Pulse animation ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-[#d4af37] ${isLoadingAI ? 'animate-ping' : ''}`} />

      {/* Icon */}
      <Sparkles
        className={`relative z-10 h-7 w-7 text-white transition-transform duration-300 ${
          isLoadingAI ? 'animate-spin' : isHovered ? 'scale-110' : ''
        }`}
      />

      {/* Tooltip */}
      {isHovered && !isLoadingAI && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          AI Design Suggestion
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {isLoadingAI && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
          Generating...
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </button>
  );
}
