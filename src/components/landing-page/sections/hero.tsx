"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Heading } from "../heading";
import { LandingPagePenViewer } from "@/components/configurator/PenViewer";
import { RotatingPenDisplay } from "./RotatingPenDisplay";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const craftingRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const excellenceRef = useRef<HTMLDivElement>(null);
  const personImageRef = useRef<HTMLDivElement>(null);
  const abstractImageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // create normal timeline
    const tlLoad = gsap.timeline({});
    // Create scrolltriggertimeline for animations
    const tlScroll = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom+=100%",
        scrub: 1,
        pin: true,
      },
    });

    tlLoad
      .fromTo(
        craftingRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
      )
      .fromTo(
        excellenceRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8",
      );

    // Animate elements from bottom with opacity
    tlScroll
      .fromTo(
        personImageRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6",
      )
      .fromTo(
        abstractImageRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6",
      )
      .fromTo(
        buttonRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.4",
      );

    return () => {
      tlLoad.kill();
      tlScroll.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-dvh w-full overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="/images/hero/hero-bg.png"
        alt="Hero background"
        fill
        className="absolute inset-0 -z-10 object-cover"
        priority
      />
        <div 
          ref={penRef}
          className='absolute inset-0 items-center justify-center'
        >
          <RotatingPenDisplay model="zeus" cameraPosition={[0, 0, 0]} tiltedRotation/>
        </div>

      {/* Grid Container */}
      <div className="relative z-10 grid min-h-screen grid-cols-12 grid-rows-12 gap-4 p-8">
        {/* Crafting Text - Left Side */}
        <div
          ref={craftingRef}
          className="absolute col-start-2 row-start-4 flex items-center justify-start"
        >
          <Heading className="tracking-wide text-white" size="xl">
            Crafting
          </Heading>
        </div>

        {/* Person Image - Below Crafting */}
        <div
          ref={personImageRef}
          className="absolute col-start-2 row-start-8 flex items-center justify-start"
        >
          <div className="relative h-40 w-32 md:h-48 md:w-109">
            <Image
              src="/images/hero/img2.png"
              alt="Person portrait"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Pen Image - Center */}

        {/* Abstract Image - Above Excellence */}
        <div
          ref={abstractImageRef}
          className="absolute col-start-9 col-span-3 row-start-3 flex items-center justify-end"
        >
          <div className="relative h-32 w-32 md:h-84 md:w-57">
            <Image
              src="/images/hero/img1.png"
              alt="Abstract image"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Excellence Text - Right Side with Mask */}
        <div
          ref={excellenceRef}
          className="absolute col-start-9 col-span-3 row-start-9 flex items-center justify-end"
        >
            <Heading
              className="bg-cover bg-clip-text bg-center tracking-wide text-transparent"
              size="xl"
              style={{
                backgroundImage: "url('/images/hero/text-mask.png')",
              }}
            >
              Excellence
            </Heading>
        </div>

        {/* MODIFY Button - Bottom Center */}
        <div className="absolute col-span-12 row-span-2 flex items-center justify-center">
          <button
            ref={buttonRef}
            className="rounded-lg border-2 border-yellow-400 px-8 py-4 font-serif text-lg text-yellow-400 transition-all duration-300 hover:bg-yellow-400 hover:text-black"
          >
            MODIFY
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
