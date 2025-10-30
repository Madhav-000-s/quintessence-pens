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

// Default materials for catalog display
const defaultBodyMaterial = {
  color: "#1a1a1a",
  metalness: 0.8,
  roughness: 0.2,
  clearcoat: 0.1,
  clearcoatRoughness: 0.1,
  emissive: "#000000",
  emissiveIntensity: 0,
};

const defaultTrimMaterial = {
  color: "#C0C0C0",
  metalness: 0.9,
  roughness: 0.1,
  emissive: "#000000",
  emissiveIntensity: 0,
};

const defaultNibMaterial = {
  color: "#FFD700",
  metalness: 1,
  roughness: 0.15,
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
      {/* Studio lighting for catalog display */}
      <spotLight
        position={[5, 8, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffffff"
      />

      <spotLight
        position={[-4, 6, 4]}
        angle={0.5}
        penumbra={1}
        intensity={0.6}
        color="#f0f0ff"
      />

      <ambientLight intensity={0.2} color="#fafafa" />

      <Environment preset="studio" environmentIntensity={0.6} background={false} />

      <PerspectiveCamera makeDefault position={[0, -0.7, 4]} fov={40} />

      <RotatingPen model={model} position={position} tilted={tiltedRotation} scale={scale} />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={10}
        blur={1.5}
        far={4}
        resolution={512}
        color="#000000"
      />
    </>
  );
}

export function RotatingPenDisplay({ model, className, cameraPosition = [0, 0, 0], tiltedRotation = false, scale = 0.20 }: RotatingPenDisplayProps) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene model={model} position={cameraPosition} tiltedRotation={tiltedRotation} scale={scale} />
        </Suspense>
      </Canvas>
    </div>
  );
}
