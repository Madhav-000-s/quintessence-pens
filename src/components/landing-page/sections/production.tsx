"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heading } from "../heading";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const productionSteps = [
  {
    id: 1,
    title: "Melting",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet blandit dui, sed scelerisque purus. Fusce nec blandit libero. In porta non lectus convallis interdum. Praesent et convallis augue. Pellentesque ullamcorper lorem dui, quis fermentum magna consectetur quis.",
    image: "/images/production/s1.png",
  },
  {
    id: 2,
    title: "Forging",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet blandit dui, sed scelerisque purus. Fusce nec blandit libero. In porta non lectus convallis interdum. Praesent et convallis augue. Pellentesque ullamcorper lorem dui, quis fermentum magna consectetur quis.",
    image: "/images/production/s2.png",
  },
  {
    id: 3,
    title: "Shaping",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet blandit dui, sed scelerisque purus. Fusce nec blandit libero. In porta non lectus convallis interdum. Praesent et convallis augue. Pellentesque ullamcorper lorem dui, quis fermentum magna consectetur quis.",
    image: "/images/production/s3.png",
  },
  {
    id: 4,
    title: "Polishing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet blandit dui, sed scelerisque purus. Fusce nec blandit libero. In porta non lectus convallis interdum. Praesent et convallis augue. Pellentesque ullamcorper lorem dui, quis fermentum magna consectetur quis.",
    image: "/images/production/s4.png",
  },
  {
    id: 5,
    title: "Assembly",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet blandit dui, sed scelerisque purus. Fusce nec blandit libero. In porta non lectus convallis interdum. Praesent et convallis augue. Pellentesque ullamcorper lorem dui, quis fermentum magna consectetur quis.",
    image: "/images/production/s5.png",
  },
];

export function Production() {
  const [activeStep, setActiveStep] = useState(-1); // Start at -1 for title slide
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundsRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const titleSlideRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !backgroundsRef.current || !contentContainerRef.current || !titleSlideRef.current) return;

    const ctx = gsap.context(() => {
      const backgrounds = backgroundsRef.current?.querySelectorAll(".bg-image");
      const contentItems = contentContainerRef.current?.querySelectorAll(".content-item");

      if (!backgrounds || !contentItems) return;

      // Set initial states
      gsap.set(backgrounds, { opacity: 0 });
      gsap.set(contentItems, {
        x: "100%",
        y: "100%",
        opacity: 0
      });

      // Animate scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Create the main scroll timeline with pinning
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: `+=${(productionSteps.length + 1) * 1000}`, // +1 for title slide
          scrub: 1.5,
          onUpdate: (self) => {
            // Hide scroll indicator after some progress
            if (self.progress > 0.1) {
              setShowScrollIndicator(false);
            }
          }
        },
      });

      // Title slide animation (fade out)
      scrollTl
        .to(titleSlideRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.in",
        }, 0)
        // Fade in first background
        .to(backgrounds[0], {
          opacity: 1,
          duration: 0.6,
          ease: "power2.inOut",
        }, 0.4)
        // Show first content
        .fromTo(contentItems[0],
          {
            x: "100%",
            y: "100%",
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          0.6
        );

      // Animate through remaining steps
      productionSteps.forEach((step, index) => {
        if (index === 0) return; // Skip first step as it's handled above

        const prevIndex = index - 1;
        const timeOffset = index + 1; // +1 to account for title slide

        // Add animations for this step transition
        scrollTl
          // Fade out previous background, fade in current
          .to(backgrounds[prevIndex], {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
          }, timeOffset)
          .to(backgrounds[index], {
            opacity: 1,
            duration: 0.6,
            ease: "power2.inOut",
          }, timeOffset)

          // Exit previous content to left with ghost effect
          .to(contentItems[prevIndex], {
            x: "-30%",
            opacity: 0.3,
            duration: 0.2,
            ease: "power2.in",
          }, timeOffset)
          .to(contentItems[prevIndex], {
            x: "-100%",
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          }, timeOffset + 0.2)

          // Enter new content from bottom right
          .fromTo(contentItems[index],
            {
              x: "100%",
              y: "100%",
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            timeOffset + 0.1
          );
      });

      // Track active step for state updates
      scrollTl.to({}, {
        duration: productionSteps.length + 1,
        onUpdate: function () {
          const progress = this.progress();
          // -1 for title, 0-4 for steps
          const newStep = Math.min(
            Math.floor(progress * (productionSteps.length + 1)) - 1,
            productionSteps.length - 1
          );
          setActiveStep(newStep);
        },
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
      style={{
        zIndex: 10,
      }}
    >
      {/* Title Slide */}
      <div
        ref={titleSlideRef}
        className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900"
      >
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <Heading
              as="h1"
              size="xl"
              className="mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent"
            >
              Production Process
            </Heading>
            <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
          <p className="font-raleway text-lg text-white/60">
            Witness the journey from raw materials to masterpiece
          </p>
        </div>
      </div>

      {/* Background images */}
      <div ref={backgroundsRef} className="absolute inset-0 z-10">
        {productionSteps.map((step) => (
          <div
            key={`bg-${step.id}`}
            className="bg-image absolute inset-0"
            style={{
              backgroundImage: `url('${step.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content container - bottom left */}
      <div className="relative z-20 min-h-screen flex items-end">
        <div ref={contentContainerRef} className="relative w-full p-16 pb-24">
          {productionSteps.map((step) => (
            <div
              key={`content-${step.id}`}
              className="content-item absolute bottom-24 left-16 max-w-2xl"
            >
              <div className="mb-4 font-raleway text-base text-white/80">
                {step.id.toString().padStart(2, "0")}
              </div>

              <Heading
                as="h2"
                size="lg"
                className="mb-6 text-white"
              >
                {step.title}
              </Heading>

              <div className="font-raleway text-xl text-white/90 leading-relaxed max-w-xl">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-raleway text-xs uppercase tracking-wider text-white/60">
            Scroll to explore
          </span>
          <div className="flex flex-col items-center gap-1">
            <svg
              className="h-6 w-6 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
