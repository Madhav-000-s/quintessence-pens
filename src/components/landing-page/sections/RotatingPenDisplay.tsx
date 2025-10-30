"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { ZeusPen } from "@/components/configurator/models/ZeusPen";
import { PoseidonPen } from "@/components/configurator/models/PoseidonPen";
import { HeraPen } from "@/components/configurator/models/HeraPen";
import { gsap } from "gsap";
import * as THREE from "three";
import type { PenModel } from "@/types/configurator";

interface RotatingPenDisplayProps {
  model: PenModel;
  className?: string;
  cameraPosition?: [number, number, number];
  tiltedRotation?: boolean;
  scale?: number
}

// Enhanced luxury materials for hero display
const defaultBodyMaterial = {
  color: "#0a0a0a",
  metalness: 0.95,
  roughness: 0.15,
  clearcoat: 0.8,
  clearcoatRoughness: 0.05,
  emissive: "#1a1a1a",
  emissiveIntensity: 0.1,
};

const defaultTrimMaterial = {
  color: "#d4af37",
  metalness: 1,
  roughness: 0.05,
  emissive: "#d4af37",
  emissiveIntensity: 0.2,
};

const defaultNibMaterial = {
  color: "#FFD700",
  metalness: 1,
  roughness: 0.08,
  emissive: "#d4af37",
  emissiveIntensity: 0.15,
};

function RotatingPen({ model, position, tilted, scale }: { model: PenModel, position: [number, number, number], tilted: boolean, scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const penGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current && penGroupRef.current) {
      // Set initial rotation with slight tilt on the pen group
      if (tilted) {
        penGroupRef.current.rotation.z = Math.PI / 16; // Slight tilt
      }

      // Create GSAP rotation animation on the outer group
      // This rotates around the world Y-axis, which passes through the pen's center
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2, // Full 360 degree rotation
        duration: 8, // 8 seconds for full rotation
        ease: "none",
        repeat: -1, // Infinite repeat
      });
    }
  }, [tilted]);

  const PenComponent = {
    zeus: ZeusPen,
    poseidon: PoseidonPen,
    hera: HeraPen,
  }[model] || ZeusPen;

  return (
    <group ref={groupRef}>
      <group ref={penGroupRef}>
        <PenComponent
          bodyMaterial={defaultBodyMaterial}
          trimMaterial={defaultTrimMaterial}
          nibMaterial={defaultNibMaterial}
          scale={scale}
          position={position}
        />
      </group>
    </group>
  );
}

function Scene({ model, position, tiltedRotation, scale }: { model: PenModel, position: [number, number, number], tiltedRotation: boolean, scale: number }) {
  return (
    <>
      {/* Dramatic hero lighting setup */}
      {/* Key light - warm golden from top right */}
      <spotLight
        position={[6, 8, 4]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffd700"
      />

      {/* Fill light - soft from left */}
      <spotLight
        position={[-5, 4, 3]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Rim light - golden accent from behind */}
      <spotLight
        position={[0, 2, -4]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.2}
        color="#d4af37"
      />

      {/* Subtle ambient for depth */}
      <ambientLight intensity={0.15} color="#1a1a1a" />

      {/* Hemisphere light for natural feel */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#000000"
        intensity={0.3}
      />

      <Environment preset="city" environmentIntensity={0.4} background={false} />

      <PerspectiveCamera makeDefault position={[0, -0.7, 4]} fov={40} />

      <RotatingPen model={model} position={position} tilted={tiltedRotation} scale={scale} />

      {/* Soft contact shadows with golden tint */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.2}
        scale={10}
        blur={2}
        far={4}
        resolution={512}
        color="#1a1a1a"
      />
    </>
  );
}

export function RotatingPenDisplay({ model, className, cameraPosition = [0, 0, 0], tiltedRotation = false, scale = 0.20 }: RotatingPenDisplayProps) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Subtle golden glow effect behind pen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="h-[600px] w-[400px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 50%, transparent 100%)'
          }}
        />
      </div>
      
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene model={model} position={cameraPosition} tiltedRotation={tiltedRotation} scale={scale} />
        </Suspense>
      </Canvas>
      
      {/* Vignette overlay for depth */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.3) 100%)'
        }}
      />
    </div>
  );
}
