"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  ContactShadows,
  Float,
} from "@react-three/drei";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";
import { ZeusPen } from "./models/ZeusPen";
import { PoseidonPen } from "./models/PoseidonPen";
import { HeraPen } from "./models/HeraPen";
import { AthenaPen } from "./models/AthenaPen";
import { AnimatedScene } from "./AnimatedScene";
import { useConfiguratorStore } from "@/lib/store/configurator";
import {
  getMaterialProperties,
  getTrimProperties,
} from "@/lib/configurator-utils";
import * as THREE from "three";
import { Skeleton } from "@/components/ui/skeleton";
import type { PenModel } from "@/types/configurator";

function Scene() {
  const config = useConfiguratorStore((state) => state.config);
  const currentModel = useConfiguratorStore((state) => state.currentModel);
  const penGroupRef = useRef<THREE.Group>(null);

  // Continuous rotation animation around vertical axis
  useFrame((state, delta) => {
    if (penGroupRef.current) {
      penGroupRef.current.rotation.y += delta * 0.3; // Slow rotation speed around vertical axis
    }
  });

  // Get material properties based on configuration
  const bodyMaterial = getMaterialProperties(
    config.bodyMaterial,
    config.bodyColor,
    config.bodyFinish
  );

  const trimMaterial = getTrimProperties(config.trimFinish);

  // Nib material (simplified - uses trim properties as base)
  const nibMaterial = {
    color: config.nibMaterial === "steel" ? "#D3D3D3" : "#FFD700",
    metalness: 1,
    roughness: config.nibMaterial === "steel" ? 0.3 : 0.15,
  };

  // Select the appropriate pen model component
  const PenModelComponents: Record<PenModel, React.ComponentType<any>> = {
    zeus: ZeusPen,
    poseidon: PoseidonPen,
    hera: HeraPen,
    athena: AthenaPen,
  };

  const PenComponent = PenModelComponents[currentModel] || ZeusPen;

  return (
    <>
      {/* Camera animations */}
      <AnimatedScene />

      {/* Museum-Quality Product Lighting - Soft & Elegant */}

      {/* Main directional light - soft and warm */}
      <directionalLight
        position={[8, 12, 8]}
        intensity={0.5}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Fill light - cool and gentle */}
      <directionalLight
        position={[-10, 8, 8]}
        intensity={0.35}
        color="#f5f5ff"
      />

      {/* Back accent light - subtle golden rim */}
      <directionalLight
        position={[0, 10, -10]}
        intensity={0.4}
        color="#fff9e6"
      />

      {/* Soft point lights for gentle fill */}
      <pointLight
        position={[4, 6, 10]}
        intensity={0.3}
        color="#ffe8d0"
        distance={20}
        decay={2}
      />

      <pointLight
        position={[-4, 6, 10]}
        intensity={0.25}
        color="#ffffff"
        distance={20}
        decay={2}
      />

      {/* Hemisphere ambient - natural sky/ground lighting */}
      <hemisphereLight
        intensity={0.25}
        color="#ffffff"
        groundColor="#444444"
      />

      {/* Environment map for reflections - very subtle */}
      <Environment preset="studio" environmentIntensity={0.3} background={false} />

      {/* Camera - dramatic product photography angle */}
      <PerspectiveCamera makeDefault position={[9.6, 6, 9.6]} fov={28} />

      {/* Orbit controls - full 3D rotation freedom with useful limits */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI / 12}  // 15° - near top view
        maxPolarAngle={(11 * Math.PI) / 12}  // 165° - near bottom view
        target={[0, 0, 0]}
        autoRotate={false}
      />

      {/* Rotating group for continuous pen rotation */}
      <group ref={penGroupRef}>
        {/* The pen standing upright */}
        <Float
          speed={2}
          rotationIntensity={0}
          floatIntensity={0}
          floatingRange={[-0.1, 0.1]}
        >
          <PenComponent
            bodyMaterial={bodyMaterial}
            trimMaterial={trimMaterial}
            nibMaterial={nibMaterial}
            scale={0.5}
            rotation={[-Math.PI / 2, -5*Math.PI/6, 0]}
          />
        </Float>
      </group>

      {/* Dramatic shadow - crisp and defined */}
      <ContactShadows
        position={[0, -4.0, 0]}
        opacity={0.45}
        scale={12}
        blur={1.8}
        far={5}
        resolution={1024}
        color="#000000"
      />

      {/* Photo-realistic post-processing */}
      <EffectComposer enableNormalPass>
        {/* Minimal bloom - only brightest metallic highlights */}
        <Bloom
          intensity={0.25}
          luminanceThreshold={0.92}
          luminanceSmoothing={0.95}
          mipmapBlur
        />
        {/* Deep SSAO for dramatic shadows and depth */}
        <SSAO
          intensity={40}
          radius={8}
          luminanceInfluence={0.12}
          color={new THREE.Color(0x000000)}
          samples={32}
          rings={5}
        />
      </EffectComposer>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-64 w-64 rounded-lg" />
        <p className="text-sm text-neutral-500">Loading 3D viewer...</p>
      </div>
    </div>
  );
}

export function PenViewer() {
  return (
    <div className="relative h-full w-full bg-black">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Golden Center Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 30%, transparent 60%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 3D Model Visualization Label */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 transform">
        <p className="text-sm font-medium" style={{ color: 'var(--luxury-gold)', opacity: 0.7 }}>
          3D Model Visualization
        </p>
      </div>
    </div>
  );
}
