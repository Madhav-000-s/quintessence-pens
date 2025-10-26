"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const availablePens = [
  {
    id: "zeus",
    name: "Zeus",
    price: "$1,499",
    tagline: "Premium Executive",
    description: "Hexagonal faceted cap with commanding presence",
    image: "/assets/zeus.png",
  },
  {
    id: "poseidon",
    name: "Poseidon",
    price: "$1,299",
    tagline: "Streamlined Torpedo",
    description: "Wave-inspired bands with fluid elegance",
    image: "/assets/poseidon.png",
  },
  {
    id: "hera",
    name: "Hera",
    price: "$999",
    tagline: "Elegant Slender",
    description: "Delicate details with refined proportions",
    image: "/assets/hera.png",
  },
  {
    id: "athena",
    name: "Athena",
    price: "$1,199",
    tagline: "Classic Design",
    description: "Timeless sophistication meets modern craftsmanship",
    image: "/assets/athena.png",
  },
];

export default function DashboardPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pensContainerRef = useRef<HTMLDivElement>(null);
  const pensCardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [currentPenIndex, setCurrentPenIndex] = useState(0);

  useEffect(() => {
    // Force video to play
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
          setVideoError(true);
        }
      }
    };

    playVideo();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 50,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      // Pen carousel scroll-controlled animation - FIXED VERSION
      if (pensContainerRef.current && pensCardsRef.current) {
        const cards = pensCardsRef.current.querySelectorAll(".pen-card");
        const totalPens = cards.length;

        // Set initial positions for all cards
        cards.forEach((card, index) => {
          gsap.set(card, {
            x: index === 0 ? 0 : 100,
            opacity: index === 0 ? 1 : 0,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          });
        });

        // Create timeline for INSTANT, CLEAN transitions
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pensContainerRef.current,
            start: "top top",
            end: `+=${window.innerHeight * (totalPens * 1.5)}`, // 1.5x scroll per pen for more control
            pin: true,
            scrub: 0.3, // Faster scrub for quicker response
            snap: {
              snapTo: 1 / (totalPens - 1),
              duration: { min: 0.2, max: 0.4 }, // Fast snap
              ease: "power3.inOut",
            },
            invalidateOnRefresh: false,
            onUpdate: (self) => {
              // Calculate current index
              const newIndex = Math.min(
                Math.round(self.progress * (totalPens - 1)),
                totalPens - 1
              );

              // Ensure ONLY current card is visible
              cards.forEach((card, idx) => {
                if (idx === newIndex) {
                  gsap.set(card, {
                    visibility: "visible",
                    zIndex: 10,
                  });
                } else {
                  gsap.set(card, {
                    visibility: "hidden",
                    zIndex: 1,
                  });
                }
              });

              setCurrentPenIndex(newIndex);
            },
          },
        });

        // Create INSTANT transitions for each pen
        cards.forEach((card, index) => {
          if (index > 0) {
            const prevCard = cards[index - 1];

            // INSTANT hide previous card
            tl.to(
              prevCard,
              {
                x: -50,
                opacity: 0,
                visibility: "hidden",
                duration: 0.4,
                ease: "power3.inOut",
              },
              index
            );

            // INSTANT show current card
            tl.fromTo(
              card,
              { x: 50, opacity: 0, visibility: "hidden" },
              {
                x: 0,
                opacity: 1,
                visibility: "visible",
                duration: 0.4,
                ease: "power3.inOut",
              },
              index
            );
          }
        });
      }

      // CTA button animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          },
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: "back.out(1.7)",
        });

        // Pulse animation loop
        gsap.to(ctaRef.current, {
          scale: 1.02,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    });

    return () => ctx.revert();
  }, []); // REMOVED currentPenIndex dependency to prevent infinite loop

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[600px] items-center justify-center overflow-hidden"
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setVideoError(true)}
        >
          <source src="/Cinematic_Shots_Of_Four_Pens.mp4" type="video/mp4" />
        </video>

        {/* Fallback gradient if video fails */}
        {videoError && (
          <div className="viewer-luxury-bg absolute inset-0" />
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/50 to-luxury-black/70" />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-luxury-black/80" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1
            ref={headingRef}
            className="text-luxury-heading mb-6 text-6xl font-bold md:text-8xl"
            style={{
              fontFamily: 'var(--font-serif)',
              background: 'linear-gradient(135deg, var(--luxury-gold-light), var(--luxury-gold), var(--luxury-gold-dark))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 20px rgba(212, 175, 55, 0.3)',
            }}
          >
            QUINTESSENCE
          </h1>
          <p className="text-luxury-gold-muted text-xl font-light tracking-wide md:text-2xl">
            Where Artistry Meets Precision
          </p>
        </div>

        {/* Gold divider line */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="divider-luxury" />
        </div>
      </section>

      {/* Available Pens Vertical-Controlled Carousel */}
      <section
        ref={pensContainerRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden py-6"
      >
        <div className="mx-auto w-full max-w-[1400px] px-8">
          <h2
            className="text-luxury-heading mb-8 text-center text-4xl font-bold md:text-5xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Available Pens
          </h2>

          {/* Carousel Container - MAXIMUM SIZE GLASS PANE */}
          <div
            ref={pensCardsRef}
            className="relative mx-auto"
            style={{ minHeight: '750px' }}
          >
            {availablePens.map((pen, index) => (
              <Link
                key={pen.id}
                href={`/configurator/${pen.id}`}
                className="pen-card group mx-auto overflow-hidden border border-white/20 bg-black/30 p-12 shadow-2xl backdrop-blur-2xl"
                style={{
                  maxWidth: '1300px',
                  borderRadius: '1rem',
                  willChange: 'transform',
                }}
              >
                {/* Glass inner glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />

                {/* Card content */}
                <div className="relative z-10">
                  <div className="grid gap-16 md:grid-cols-2">
                    {/* Pen image - MAXIMUM SIZE */}
                    <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white/5 p-12 backdrop-blur-sm">
                      <Image
                        src={pen.image}
                        alt={pen.name}
                        width={500}
                        height={500}
                        className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-110"
                        priority={index === 0}
                      />
                    </div>

                    {/* Pen details - BIGGER TEXT */}
                    <div className="flex flex-col justify-center space-y-10">
                      <div>
                        <span className="badge-luxury mb-4 inline-block text-sm">
                          {pen.tagline}
                        </span>
                        <h3
                          className="text-6xl font-bold text-luxury-gold"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {pen.name}
                        </h3>
                      </div>

                      <p className="text-xl leading-relaxed text-luxury-gray-200">
                        {pen.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-luxury-gold/20 pt-8">
                        <span
                          className="text-5xl font-bold text-luxury-gold"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {pen.price}
                        </span>
                        <div className="flex items-center gap-3 text-luxury-gold">
                          <span className="text-lg font-semibold">
                            Explore
                          </span>
                          <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="mt-10 flex items-center justify-center gap-3">
            {availablePens.map((pen, index) => (
              <button
                key={pen.id}
                className={`h-2 rounded-full transition-all ${
                  index === currentPenIndex
                    ? "w-8 bg-luxury-gold"
                    : "w-2 bg-luxury-gold/30 hover:bg-luxury-gold/50"
                }`}
                onClick={() => {
                  const scrollTarget = pensContainerRef.current;
                  if (scrollTarget) {
                    const progress = index / (availablePens.length - 1);
                    window.scrollTo({
                      top:
                        scrollTarget.offsetTop +
                        progress * window.innerHeight * (availablePens.length * 1.5),
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label={`Go to ${pen.name}`}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <p className="mt-8 text-center text-sm text-luxury-gold-muted">
            Scroll down to explore all models ↓
          </p>
        </div>
      </section>

      {/* Configure CTA Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div ref={ctaRef}>
          <h2
            className="text-luxury-heading mb-6 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Create Your Masterpiece
          </h2>
          <p className="mb-8 text-lg text-luxury-gray-600">
            Design a pen as unique as your signature with our interactive configurator
          </p>
          <Link href="/configurator/athena">
            <button className="btn-luxury-primary group inline-flex items-center gap-3">
              <span>Configure Your Own Pen</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
