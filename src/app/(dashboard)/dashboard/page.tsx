"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DashboardPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="viewer-luxury-bg relative flex min-h-[600px] items-center justify-center overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-luxury-gold blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-luxury-gold-dark blur-3xl" style={{ animationDelay: '1s' }} />
        </div>

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
            }}
          >
            QUINTESSENCE
          </h1>
          <p className="text-luxury-gold-muted text-xl font-light tracking-wide md:text-2xl">
            Where Artistry Meets Precision
          </p>
        </div>

        {/* Gold divider line */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="divider-luxury" />
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
