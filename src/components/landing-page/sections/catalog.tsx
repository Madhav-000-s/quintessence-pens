"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Heading } from "../heading";
import { RotatingPenDisplay } from "./RotatingPenDisplay";
import type { PenModel } from "@/types/configurator";

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
  const currentPen = penModels[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? penModels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === penModels.length - 1 ? 0 : prev + 1));
  };

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
        <div className="flex w-full max-w-7xl items-center justify-between">

            <div className="relative h-[800px]">
              <RotatingPenDisplay
                model={currentPen.model}
                className="h-full w-full"
                cameraPosition={[0, -0.55, 0]}
                tiltedRotation={false}
              />
            </div>
          {/* Center pen display */}
          <div className="flex px-8 items-center gap-24">
            {/* Left navigation arrow */}
            <button
              onClick={handlePrevious}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white transition-all hover:bg-white hover:text-black"
              aria-label="Previous pen"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            {/* Product details */}
            <div>
              <div className="font-raleway mb-4 text-sm text-white/80">
                {currentPen.number}
              </div>

              <Heading as="h3" size="md" className="mb-4 text-white">
                {currentPen.name}
              </Heading>

              <div className="font-raleway mb-8 text-sm text-white/90">
                {currentPen.description}
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-4">
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
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white transition-all hover:bg-white hover:text-black"
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
