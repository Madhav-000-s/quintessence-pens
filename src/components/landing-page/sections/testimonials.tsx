"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heading } from "../heading";
import { cn } from "@/lib/utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AdjectiveWord {
  id: string;
  text: string;
  position: { x: number; y: number };
  size: 'xl' | 'lg' | 'md';
  animationDelay: number;
  review: TestimonialReview;
}

interface TestimonialReview {
  author: string;
  role: string;
  content: string;
  rating: number;
}

interface TestimonialsState {
  words: AdjectiveWord[];
  visibleWords: Set<string>;
  isAnimating: boolean;
  hoveredWord: string | null;
}

interface PositionConstraints {
  minDistance: number;
  viewportPadding: number;
  maxAttempts: number;
}

interface WordPlacement {
  word: AdjectiveWord;
  bounds: DOMRect;
  isValid: boolean;
  attempts: number;
}

// Premium brand adjectives with associated testimonials
const adjectiveWordsData: Array<{ word: string; review: TestimonialReview }> = [
  {
    word: "Elegant",
    review: {
      author: "Sarah Mitchell",
      role: "Interior Designer",
      content: "The elegant design of these pieces transformed my client's space into something truly extraordinary. Every detail speaks of refined craftsmanship and timeless beauty.",
      rating: 5
    }
  },
  {
    word: "Crafted",
    review: {
      author: "James Chen",
      role: "Architect",
      content: "Meticulously crafted with attention to every detail. The level of precision and care in the construction is evident in every piece. This is true artisanship.",
      rating: 5
    }
  },
  {
    word: "Premium",
    review: {
      author: "Emma Rodriguez",
      role: "Luxury Consultant",
      content: "Premium quality that exceeds expectations. The materials, finish, and overall execution are simply outstanding. Worth every penny for discerning clients.",
      rating: 5
    }
  },
  {
    word: "Refined",
    review: {
      author: "Michael Thompson",
      role: "Art Collector",
      content: "A refined aesthetic that complements any sophisticated space. The subtle elegance and understated luxury make these pieces stand out in my collection.",
      rating: 5
    }
  },
  {
    word: "Luxurious",
    review: {
      author: "Victoria Laurent",
      role: "Hotel Owner",
      content: "Luxurious beyond compare. Our guests constantly comment on the exquisite quality and beauty. These pieces have elevated our entire establishment.",
      rating: 5
    }
  },
  {
    word: "Artisan",
    review: {
      author: "David Park",
      role: "Gallery Curator",
      content: "True artisan quality that honors traditional techniques while embracing modern design. Each piece tells a story of dedication and mastery.",
      rating: 5
    }
  },
  {
    word: "Sophisticated",
    review: {
      author: "Isabella Rossi",
      role: "Fashion Designer",
      content: "Sophisticated design that reflects impeccable taste. The balance of form and function is perfect, creating pieces that are both beautiful and practical.",
      rating: 5
    }
  },
  {
    word: "Timeless",
    review: {
      author: "Robert Anderson",
      role: "Antique Dealer",
      content: "Timeless pieces that will be treasured for generations. The classic design combined with superior craftsmanship ensures these will never go out of style.",
      rating: 5
    }
  },
  {
    word: "Exquisite",
    review: {
      author: "Sophia Williams",
      role: "Event Planner",
      content: "Exquisite attention to detail in every aspect. These pieces have become the centerpiece of our most prestigious events, always drawing admiration.",
      rating: 5
    }
  },
  {
    word: "Masterful",
    review: {
      author: "Alexander Kim",
      role: "Master Craftsman",
      content: "Masterful execution from concept to completion. As a fellow craftsman, I deeply appreciate the skill and dedication evident in every piece.",
      rating: 5
    }
  }
];

// Text sizes for variety
const textSizes: ('xl' | 'lg' | 'md')[] = ['xl', 'lg', 'md'];

export function TestimonialsWall() {
  const [state, setState] = useState<TestimonialsState>({
    words: [],
    visibleWords: new Set(),
    isAnimating: false,
    hoveredWord: null,
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle word hover
  const handleWordHover = (wordId: string, event: React.MouseEvent<HTMLDivElement>) => {
    setState(prev => ({ ...prev, hoveredWord: wordId }));

    // Animate word to golden color
    const wordElement = event.currentTarget.querySelector('[data-word-text]') as HTMLElement;
    if (wordElement) {
      gsap.to(wordElement, {
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          const progress = this.progress();
          // Animate from white (#ffffff, #cccccc) to gold (#d4af37, #aa8c2a)
          const r1 = Math.round(255 - progress * (255 - 212));
          const g1 = Math.round(255 - progress * (255 - 175));
          const b1 = Math.round(255 - progress * (255 - 55));

          const r2 = Math.round(204 - progress * (204 - 170));
          const g2 = Math.round(204 - progress * (204 - 140));
          const b2 = Math.round(204 - progress * (204 - 42));

          wordElement.style.background = `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}) 0%, rgb(${r2}, ${g2}, ${b2}) 100%)`;
          wordElement.style.webkitBackgroundClip = 'text';
          wordElement.style.backgroundClip = 'text';
          wordElement.style.webkitTextFillColor = 'transparent';
        }
      });
    }
  };

  const handleWordLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setState(prev => ({ ...prev, hoveredWord: null }));

    // Animate word back to white
    const wordElement = event.currentTarget.querySelector('[data-word-text]') as HTMLElement;
    if (wordElement) {
      gsap.to(wordElement, {
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          const progress = this.progress();
          // Animate from gold (#d4af37, #aa8c2a) back to white (#ffffff, #cccccc)
          const r1 = Math.round(212 + progress * (255 - 212));
          const g1 = Math.round(175 + progress * (255 - 175));
          const b1 = Math.round(55 + progress * (255 - 55));

          const r2 = Math.round(170 + progress * (204 - 170));
          const g2 = Math.round(140 + progress * (204 - 140));
          const b2 = Math.round(42 + progress * (204 - 42));

          wordElement.style.background = `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}) 0%, rgb(${r2}, ${g2}, ${b2}) 100%)`;
          wordElement.style.webkitBackgroundClip = 'text';
          wordElement.style.backgroundClip = 'text';
          wordElement.style.webkitTextFillColor = 'transparent';
        }
      });
    }
  };

  // Word placement algorithm with collision detection and responsive sizing
  const generateWordPositions = (): AdjectiveWord[] => {
    if (!sectionRef.current) return [];

    const viewport = {
      width: sectionRef.current.clientWidth,
      height: sectionRef.current.clientHeight,
    };

    // Responsive constraints based on viewport size
    const isMobile = viewport.width < 768;
    const isTablet = viewport.width >= 768 && viewport.width < 1024;

    const constraints: PositionConstraints = {
      minDistance: isMobile ? 60 : isTablet ? 70 : 80, // Responsive spacing
      viewportPadding: isMobile ? 40 : isTablet ? 50 : 60, // Responsive padding
      maxAttempts: 10, // Maximum placement attempts per word
    };

    const placedWords: AdjectiveWord[] = [];
    const placedBounds: DOMRect[] = [];

    // Helper function to get responsive text size
    const getResponsiveSize = (baseSize: 'xl' | 'lg' | 'md', index: number): 'xl' | 'lg' | 'md' => {
      if (isMobile) {
        // On mobile, use smaller sizes
        return baseSize === 'xl' ? 'lg' : baseSize === 'lg' ? 'md' : 'md';
      }
      return baseSize;
    };

    // Helper function to estimate text bounds with responsive sizing
    const estimateTextBounds = (text: string, size: 'xl' | 'lg' | 'md', x: number, y: number): DOMRect => {
      // Responsive text dimensions based on viewport size
      const baseSizeMultipliers = {
        xl: { width: 12, height: 80 }, // Desktop: text-4xl md:text-8xl
        lg: { width: 10, height: 70 }, // Desktop: text-4xl md:text-7xl  
        md: { width: 8, height: 50 },  // Desktop: text-3xl md:text-5xl
      };

      // Adjust multipliers for smaller screens
      const responsiveMultipliers = isMobile ? {
        xl: { width: 8, height: 50 },
        lg: { width: 7, height: 45 },
        md: { width: 6, height: 35 },
      } : isTablet ? {
        xl: { width: 10, height: 65 },
        lg: { width: 8.5, height: 57 },
        md: { width: 7, height: 42 },
      } : baseSizeMultipliers;

      const multiplier = responsiveMultipliers[size];
      const estimatedWidth = text.length * multiplier.width;
      const estimatedHeight = multiplier.height;

      return new DOMRect(
        x - estimatedWidth / 2,
        y - estimatedHeight / 2,
        estimatedWidth,
        estimatedHeight
      );
    };

    // Check if two rectangles overlap with minimum distance
    const hasCollision = (rect1: DOMRect, rect2: DOMRect, minDistance: number): boolean => {
      const expandedRect1 = new DOMRect(
        rect1.x - minDistance / 2,
        rect1.y - minDistance / 2,
        rect1.width + minDistance,
        rect1.height + minDistance
      );

      return !(
        expandedRect1.right < rect2.left ||
        expandedRect1.left > rect2.right ||
        expandedRect1.bottom < rect2.top ||
        expandedRect1.top > rect2.bottom
      );
    };

    // Check if position is within viewport boundaries
    const isWithinBounds = (bounds: DOMRect, padding: number): boolean => {
      return (
        bounds.left >= padding &&
        bounds.right <= viewport.width - padding &&
        bounds.top >= padding &&
        bounds.bottom <= viewport.height - padding
      );
    };

    // Place each word with collision detection
    adjectiveWordsData.forEach((wordData, index) => {
      const baseSize = textSizes[index % textSizes.length];
      const size = getResponsiveSize(baseSize, index);
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < constraints.maxAttempts) {
        // Generate random position
        const x = Math.random() * (viewport.width - 2 * constraints.viewportPadding) + constraints.viewportPadding;
        const y = Math.random() * (viewport.height - 2 * constraints.viewportPadding) + constraints.viewportPadding;

        // Estimate text bounds at this position
        const bounds = estimateTextBounds(wordData.word, size, x, y);

        // Check if within viewport boundaries
        if (!isWithinBounds(bounds, constraints.viewportPadding)) {
          attempts++;
          continue;
        }

        // Check for collisions with existing words
        let hasCollisionWithExisting = false;
        for (const existingBounds of placedBounds) {
          if (hasCollision(bounds, existingBounds, constraints.minDistance)) {
            hasCollisionWithExisting = true;
            break;
          }
        }

        if (!hasCollisionWithExisting) {
          // Successfully placed word
          const adjectiveWord: AdjectiveWord = {
            id: `word-${index}`,
            text: wordData.word,
            position: { x, y },
            size,
            animationDelay: index * 200, // 200ms stagger
            review: wordData.review,
          };

          placedWords.push(adjectiveWord);
          placedBounds.push(bounds);
          placed = true;
        }

        attempts++;
      }

      // If we couldn't place the word after max attempts, place it anyway with a fallback position
      if (!placed) {
        const fallbackX = (index % 3) * (viewport.width / 3) + viewport.width / 6;
        const fallbackY = Math.floor(index / 3) * (viewport.height / 4) + viewport.height / 4;

        const adjectiveWord: AdjectiveWord = {
          id: `word-${index}`,
          text: wordData.word,
          position: { x: fallbackX, y: fallbackY },
          size,
          animationDelay: index * 200,
          review: wordData.review,
        };

        placedWords.push(adjectiveWord);
      }
    });

    return placedWords;
  };

  // Initialize word positions on mount and resize
  useEffect(() => {
    const initializeWords = () => {
      const words = generateWordPositions();
      setState(prev => ({ ...prev, words }));
    };

    // Initialize on mount
    if (sectionRef.current) {
      initializeWords();
    }

    // Handle resize with debouncing and responsive repositioning
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Reset animations and reinitialize
        if (wordsContainerRef.current) {
          const wordElements = wordsContainerRef.current.querySelectorAll('[data-word]');
          gsap.set(wordElements, { scale: 0, opacity: 0, rotation: -15 });
        }

        // Regenerate positions with new viewport dimensions
        initializeWords();
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Setup staggered reveal animations
  useEffect(() => {
    if (!sectionRef.current || !wordsContainerRef.current || state.words.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state for all words
      const wordElements = wordsContainerRef.current?.querySelectorAll('[data-word]');
      if (!wordElements) return;

      gsap.set(wordElements, {
        scale: 0,
        opacity: 0,
        rotation: -15,
      });

      // Create scroll trigger for testimonials section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%", // Trigger when section is 30% in viewport
        onEnter: () => {
          setState(prev => ({ ...prev, isAnimating: true }));

          // Staggered reveal animation with 200ms delays
          gsap.to(wordElements, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)", // back.out easing for bouncy effect
            stagger: 0.2, // 200ms stagger between words
            onComplete: () => {
              setState(prev => ({ ...prev, isAnimating: false }));
            }
          });
        },
        once: true, // Only trigger once
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [state.words]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden"
    >
          <div
            className="bg-image absolute inset-0"
            style={{
              backgroundImage: `url('/images/production/bg.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
      {/* Words Container */}
      <div ref={wordsContainerRef} className="absolute inset-0">
        {state.words.map((word) => {
          const isHovered = state.hoveredWord === word.id;

          const tooltipPosition = word.position.y > 350 ? "top" : "bottom";
          return (
            <div
              key={word.id}
              data-word={word.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: word.position.x,
                top: word.position.y,
                zIndex: isHovered ? 9999 : 1,
              }}
              onMouseEnter={(e) => handleWordHover(word.id, e)}
              onMouseLeave={handleWordLeave}
            >
              {/* Tooltip - Review Card */}
              {isHovered && (
                <div
                  className={cn("absolute left-1/2 transform z-1000000000 pointer-events-none", tooltipPosition === "top" ? "bottom-full mb-4" : "top-full mt-4")}
                  style={{
                    animation: 'fadeInUp 0.3s ease-out forwards',
                    zIndex: 9999,
                  }}
                >
                  <div className="bg-gradient-to-br from-zinc-900 to-black border border-amber-500/30 rounded-lg shadow-2xl p-6 min-w-[320px] max-w-[400px] backdrop-blur-sm">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: word.review.rating }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review Content */}
                    <p className="text-white/90 text-sm leading-relaxed mb-4 font-raleway">
                      "{word.review.content}"
                    </p>

                    {/* Author Info */}
                    <div className="border-t border-amber-500/20 pt-3">
                      <p className="text-amber-400 font-semibold text-sm font-abril">
                        {word.review.author}
                      </p>
                      <p className="text-white/60 text-xs font-raleway">
                        {word.review.role}
                      </p>
                    </div>

                    {/* Tooltip Arrow */}
                      <div className={cn("absolute left-1/2 transform -translate-x-1/2 -mt-px", tooltipPosition === "top" ? "top-full" : "bottom-full rotate-180")}>
                        <div className="border-8 border-transparent border-t-amber-500/30" />
                      </div>
                  </div>
                </div>
              )}

              {/* Word Text */}
              <Heading
                as="h2"
                size={word.size}
                className="select-none cursor-pointer transition-transform duration-300 hover:scale-110"
                data-word-text
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {word.text}
              </Heading>
            </div>
          );
        })}
      </div>

      {/* CSS Animation for Tooltip */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}