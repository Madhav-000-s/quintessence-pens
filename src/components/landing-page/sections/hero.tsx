"use client"

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Heading } from "../heading";
import { LandingPagePenViewer } from "@/components/configurator/PenViewer";
import { RotatingPenDisplay } from "./RotatingPenDisplay";
import { LandingHeader } from "../landing-header";

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

      {/* <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.webm" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/80" />
      </div> */}
      {/* Pen Display with Luxury Effects */}
      <div
        ref={penRef}
        className='absolute inset-0 flex items-center justify-center'
      >
        {/* Golden spotlight effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[800px] w-[600px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.06) 40%, transparent 70%)'
            }}
          />
        </div>

        <RotatingPenDisplay model="zeus" cameraPosition={[0, -0.30, 0]} tiltedRotation />
      </div>

      <LandingHeader />

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
          <div className="relative h-40 w-32 md:h-58 md:w-109">
            <Image
              src="/images/hero/img2.png"
              alt="Person portrait"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>

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

      </div>
      {/* MODIFY Button - Bottom Center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-1000 flex items-center justify-center">
        <button
          className="rounded-lg border-2 border-yellow-400 px-8 py-4 font-serif text-lg text-yellow-400 transition-all duration-300 hover:bg-yellow-400 hover:text-black"
        >
          MODIFY
        </button>
      </div>
    </section>
  );
};

export default Hero;
