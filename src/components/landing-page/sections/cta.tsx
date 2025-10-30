"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heading } from "../heading";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        }
      });

      tl.fromTo(headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Golden Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-8 py-20">
        <div className="grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Content */}
          <div className="flex flex-col justify-center">
            <div ref={headingRef}>
              <Heading
                as="h2"
                size="lg"
                className="mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent"
              >
                Craft Your Legacy
              </Heading>
            </div>

            <div ref={descriptionRef}>
              <p className="font-raleway mb-4 text-lg leading-relaxed text-white/90">
                Every masterpiece begins with a vision. Design a pen that reflects your unique style and sophistication.
              </p>
              <p className="font-raleway mb-8 text-base leading-relaxed text-white/70">
                Choose from premium materials, exquisite finishes, and personalized engravings. Create an heirloom that will be treasured for generations.
              </p>
            </div>

            <div ref={buttonsRef} className="flex flex-wrap gap-4">
              <button className="font-raleway group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-10 py-4 text-base font-semibold text-black transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/50">
                <span className="relative z-10">START CUSTOMIZING</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
              
              <button className="font-raleway rounded-lg border-2 border-amber-400/50 bg-transparent px-10 py-4 text-base font-semibold text-amber-400 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10">
                VIEW GALLERY
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-amber-400/20 pt-8">
              <div>
                <div className="font-abril text-3xl font-bold text-amber-400">500+</div>
                <div className="font-raleway text-sm text-white/60">Unique Designs</div>
              </div>
              <div>
                <div className="font-abril text-3xl font-bold text-amber-400">50K+</div>
                <div className="font-raleway text-sm text-white/60">Happy Customers</div>
              </div>
              <div>
                <div className="font-abril text-3xl font-bold text-amber-400">25+</div>
                <div className="font-raleway text-sm text-white/60">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right: Featured Image */}
          <div ref={imageRef} className="relative flex items-center justify-center">
            <div className="relative">
              {/* Decorative Frame */}
              <div className="absolute -inset-8">
                <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-amber-400/60" />
                <div className="absolute right-0 top-0 h-20 w-20 border-r-2 border-t-2 border-amber-400/60" />
                <div className="absolute bottom-0 left-0 h-20 w-20 border-b-2 border-l-2 border-amber-400/60" />
                <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-amber-400/60" />
              </div>

              {/* Image Container */}
              <div className="relative h-[500px] w-[400px] overflow-hidden rounded-lg border border-amber-400/30 bg-gradient-to-br from-amber-400/5 to-transparent backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-full w-full">
                    <Image
                      src="/images/hero/img2.png"
                      alt="Luxury pen craftsmanship"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-transparent backdrop-blur-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
