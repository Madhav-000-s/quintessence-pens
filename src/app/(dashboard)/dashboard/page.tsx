"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowRight } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
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
  const [isNavigating, setIsNavigating] = useState(false);

  const stRef = useRef<globalThis.ScrollTrigger | null>(null);

  useEffect(() => {
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
    if (isNavigating) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isNavigating]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 50,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      if (pensContainerRef.current && pensCardsRef.current) {
        const cards = pensCardsRef.current.querySelectorAll(".pen-card");
        const totalPens = cards.length;

        cards.forEach((card, index) => {
          gsap.set(card, {
            x: index === 0 ? 0 : 100,
            opacity: index === 0 ? 1 : 0,
            visibility: index === 0 ? "visible" : "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pensContainerRef.current,
            start: "top top",
            end: `+=${window.innerHeight * (totalPens * 1.5)}`,
            pin: true,
            scrub: 0.3,
            snap: {
              snapTo: 1 / (totalPens - 1),
              duration: { min: 0.2, max: 0.4 },
              ease: "power3.inOut",
            },
            onSnapStart: () => setIsNavigating(true),
            onSnapComplete: () => setIsNavigating(false),
            invalidateOnRefresh: false,
            onUpdate: (self) => {
              const newIndex = Math.min(
                Math.round(self.progress * (totalPens - 1)),
                totalPens - 1
              );
              setCurrentPenIndex(newIndex);
              cards.forEach((card, idx) => {
                gsap.set(card, { zIndex: idx === newIndex ? 10 : 5 });
              });
            },
          },
        });

        stRef.current = tl.scrollTrigger || null;

        cards.forEach((card, index) => {
          if (index > 0) {
            const prevCard = cards[index - 1];
            tl.to(
              prevCard,
              {
                x: -50,
                opacity: 0,
                visibility: "hidden",
                duration: 0.4,
                ease: "power3.inOut",
              },
              index - 0.5
            );
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
              index - 0.5
            );
          }
        });
      }

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
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[600px] items-center justify-center overflow-hidden"
      >
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
        {videoError && <div className="viewer-luxury-bg absolute inset-0" />}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/50 to-luxury-black/70" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-luxury-black/80" />
        <div className="relative z-10 text-center">
          <h1
            ref={headingRef}
            className="text-luxury-heading mb-6 text-6xl font-bold md:text-8xl"
            style={{
              fontFamily: "var(--font-serif)",
              background:
                "linear-gradient(135deg, var(--luxury-gold-light), var(--luxury-gold), var(--luxury-gold-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 20px rgba(212, 175, 55, 0.3)",
            }}
          >
            QUINTESSENCE
          </h1>
          <p className="text-luxury-gold-muted text-xl font-light tracking-wide md:text-2xl">
            Where Artistry Meets Precision
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="divider-luxury" />
        </div>
      </section>

      {/* Available Pens Vertical-Controlled Carousel */}
      <section
        ref={pensContainerRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden py-6"
      >
        <div className="relative mx-auto w-full max-w-[1400px] px-8">
          <h2
            className="text-luxury-heading mb-8 text-center text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Available Pens
          </h2>
          <div
            ref={pensCardsRef}
            className="relative mx-auto"
            style={{ minHeight: "750px" }}
          >
            {availablePens.map((pen, index) => (
              <Link
                key={pen.id}
                href={`/configurator/${pen.id}`}
                className="pen-card group mx-auto overflow-hidden border border-white/20 bg-black/30 p-12 shadow-2xl backdrop-blur-2xl"
                style={{
                  maxWidth: "1300px",
                  borderRadius: "1rem",
                  willChange: "transform",
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative z-10">
                  <div className="grid gap-16 md:grid-cols-2">
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
                    <div className="flex flex-col justify-center space-y-10">
                      <div>
                        <span className="badge-luxury mb-4 inline-block text-sm">
                          {pen.tagline}
                        </span>
                        <h3
                          className="text-6xl font-bold text-luxury-gold"
                          style={{ fontFamily: "var(--font-serif)" }}
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
                          style={{ fontFamily: "var(--font-serif)" }}
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

          {/* MODIFICATION: Used arbitrary negative 'right' value to push dots outside */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[-1.5rem] z-20 flex flex-col items-center justify-center gap-4">
            {availablePens.map((pen, index) => (
              <button
                key={pen.id}
                className={`w-2 rounded-full transition-all ${
                  index === currentPenIndex
                    ? "h-8 bg-luxury-gold"
                    : "h-2 bg-luxury-gold/30 hover:bg-luxury-gold/50"
                }`}
                onClick={() => {
                  if (!stRef.current) return;
                  const st = stRef.current;
                  const progress = index / (availablePens.length - 1);
                  const scrollPos = st.start + (st.end - st.start) * progress;
                  gsap.to(window, {
                    scrollTo: { y: scrollPos, autoKill: false },
                    duration: 0.8,
                    ease: "power3.inOut",
                  });
                }}
                aria-label={`Go to ${pen.name}`}
              />
            ))}
          </div>

          {/* NOTE: I am also removing the "Scroll down..." text as requested in
            the previous turn, as one of your screenshots still showed it.
          */}
        </div>
      </section>

      {/* Configure CTA Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div ref={ctaRef}>
          <h2
            className="text-luxury-heading mb-6 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Create Your Masterpiece
          </h2>
          <p className="mb-8 text-lg text-luxury-gray-600">
            Design a pen as unique as your signature with our interactive
            configurator
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