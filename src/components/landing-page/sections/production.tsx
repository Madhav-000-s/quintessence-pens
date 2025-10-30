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
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundsRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !backgroundsRef.current || !contentContainerRef.current) return;

    const ctx = gsap.context(() => {
      const backgrounds = backgroundsRef.current?.querySelectorAll(".bg-image");
      const contentItems = contentContainerRef.current?.querySelectorAll(".content-item");

      if (!backgrounds || !contentItems) return;

      // Set initial states
      gsap.set(backgrounds, { opacity: 0 });
      gsap.set(backgrounds[0], { opacity: 1 });

      gsap.set(contentItems, {
        x: "100%",
        y: "100%",
        opacity: 0
      });
      gsap.set(contentItems[0], {
        x: 0,
        y: 0,
        opacity: 1
      });

      // Create the main scroll timeline with pinning
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: `+=${productionSteps.length * 1000}`,
          scrub: 1.5,
        },
      });

      // Animate through each step
      productionSteps.forEach((step, index) => {
        if (index === 0) return; // Skip first step as it's already visible

        const prevIndex = index - 1;

        // Add animations for this step transition
        scrollTl
          // Fade out previous background, fade in current
          .to(backgrounds[prevIndex], {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
          }, index)
          .to(backgrounds[index], {
            opacity: 1,
            duration: 0.6,
            ease: "power2.inOut",
          }, index)

          // Exit previous content to left with ghost effect
          .to(contentItems[prevIndex], {
            x: "-30%",
            opacity: 0.3,
            duration: 0.2,
            ease: "power2.in",
          }, index)
          .to(contentItems[prevIndex], {
            x: "-100%",
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          }, index + 0.2)

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
            index + 0.1
          );
      });

      // Track active step for state updates
      scrollTl.to({}, {
        duration: productionSteps.length,
        onUpdate: function () {
          const progress = this.progress();
          const newStep = Math.min(
            Math.floor(progress * productionSteps.length),
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
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background images */}
      <div ref={backgroundsRef} className="absolute inset-0">
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
      <div className="relative z-10 min-h-screen flex items-end">
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
    </section>
  );
}
