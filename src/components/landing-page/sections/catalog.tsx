"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Heading } from "../heading";
import { RotatingPenDisplay } from "./RotatingPenDisplay";
import type { PenModel } from "@/types/configurator";
import { gsap } from "gsap";

const penModels: {
  model: PenModel;
  name: string;
  description: string;
  number: string;
  bgColor: string;
}[] = [
    {
      model: "zeus",
      name: "Zeus",
      description: "BOLD - REFRESHING - SOPHISTICATED",
      number: "01",
      bgColor: "#000",
    },
    {
      model: "poseidon",
      name: "Poseidon",
      description: "ELEGANT - FLUID - PRECISE",
      number: "02",
      bgColor: "#2C5282",
    },
    {
      model: "hera",
      name: "Hera",
      description: "GRACEFUL - REFINED - TIMELESS",
      number: "03",
      bgColor: "#33231C",
    },
  ];

export function Catalog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentPen = penModels[currentIndex];

  const detailsRef = useRef<HTMLDivElement>(null);
  const penDisplayRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Animate current details out to the right
    if (detailsRef.current && penDisplayRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex((prev) => (prev === 0 ? penModels.length - 1 : prev - 1));
          setIsAnimating(false);
        }
      });

      // Slide details to the right and fade out
      tl.to(detailsRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });

      // Rotate and fade out pen
      tl.to(penDisplayRef.current, {
        rotationY: -90,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, 0);
    }
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Animate current details out to the left
    if (detailsRef.current && penDisplayRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex((prev) => (prev === penModels.length - 1 ? 0 : prev + 1));
          setIsAnimating(false);
        }
      });

      // Slide details to the left and fade out
      tl.to(detailsRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });

      // Rotate and fade out pen
      tl.to(penDisplayRef.current, {
        rotationY: 90,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, 0);
    }
  };

  // Animate in new content when index changes
  useEffect(() => {
    if (detailsRef.current && penDisplayRef.current) {
      // Reset position and animate in from opposite direction
      gsap.set(detailsRef.current, { x: 0, opacity: 0 });
      gsap.set(penDisplayRef.current, { rotationY: 0, opacity: 0 });

      const tl = gsap.timeline();

      // Slide in details from left
      tl.fromTo(detailsRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Rotate in pen
      tl.fromTo(penDisplayRef.current,
        { rotationY: -45, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        0.1
      );
    }
  }, [currentIndex]);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: currentPen.bgColor }}
    >
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/images/catalog/bg-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Title */}
        <Heading as="h2" size="lg" className="mb-16 text-center text-white">
          Choose Your Perfect Companion
        </Heading>

        {/* Main content area */}
        <div className="flex w-full max-w-7xl items-center justify-between gap-12">
          {/* Left: Pen Display with Luxurious Frame */}
          <div className="relative flex-shrink-0">
            {/* Luxurious Frame */}
            <div className="relative">
              {/* Ornate corner decorations */}
              <div className="absolute -left-4 -top-4 h-16 w-16 border-l-2 border-t-2 border-amber-400/60" />
              <div className="absolute -right-4 -top-4 h-16 w-16 border-r-2 border-t-2 border-amber-400/60" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 border-b-2 border-l-2 border-amber-400/60" />
              <div className="absolute -bottom-4 -right-4 h-16 w-16 border-b-2 border-r-2 border-amber-400/60" />

              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/5 to-transparent" />

              {/* Pen display container */}
              <div
                ref={penDisplayRef}
                className="relative h-[600px] w-[500px] overflow-hidden rounded-lg border border-amber-400/30 bg-black/20 backdrop-blur-sm"
                style={{ perspective: "1000px" }}
              >
                <RotatingPenDisplay
                  model={currentPen.model}
                  className="h-full w-full"
                  cameraPosition={[0, -0.55, 0]}
                  tiltedRotation={false}
                />
              </div>

              {/* Bottom accent line */}
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            </div>
          </div>

          {/* Right: Product Details and Navigation */}
          <div className="flex flex-1 items-center gap-8">
            {/* Left navigation arrow */}
            <button
              onClick={handlePrevious}
              disabled={isAnimating}
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
              aria-label="Previous pen"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Product details */}
            <div ref={detailsRef} className="max-w-xl flex-1">
              <div className="font-raleway mb-4 text-sm text-white/80">
                {currentPen.number}
              </div>

              <Heading as="h3" size="md" className="mb-4 text-white">
                {currentPen.name}
              </Heading>

              <div className="font-raleway mb-4 text-sm tracking-wider text-white/90">
                {currentPen.description}
              </div>

              <div className="font-raleway mb-8 text-sm leading-relaxed text-white/80">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In cupiditate libero sit, quidem cumque hic omnis ea amet harum similique molestiae cum quisquam eligendi provident eos alias explicabo itaque dicta.
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button className="font-raleway rounded-lg border border-white bg-transparent px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white hover:text-black">
                  ADD TO CART
                </button>
                <button className="font-raleway rounded-lg bg-yellow-400 px-8 py-3 text-sm font-medium text-black transition-all hover:bg-yellow-300">
                  CUSTOMIZE
                </button>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
              aria-label="Next pen"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
