"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
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
  };

  const PenComponent = PenModelComponents[currentModel] || ZeusPen;

  return (
    <>
      {/* Camera animations */}
      <AnimatedScene />

      {/* Studio Photography Lighting - Dramatic & Moody */}

      {/* Key light - main dramatic light */}
      <spotLight
        position={[8, 8, 8]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
        color="#ffffff"
      />

      {/* Fill light - subtle shadow softening */}
      <spotLight
        position={[-6, 5, 6]}
        angle={0.5}
        penumbra={1}
        intensity={0.7}
        color="#f0f0ff"
      />

      {/* Rim/Back light - edge highlights */}
      <spotLight
        position={[0, 6, -8]}
        angle={0.3}
        penumbra={0.7}
        intensity={1.2}
        color="#fffaf0"
      />

      {/* Minimal ambient - only lights pen, not background */}
      <ambientLight intensity={0.15} color="#fafafa" />

      {/* Environment map for reflections only - not background */}
      <Environment preset="studio" environmentIntensity={0.8} background={false} />

      {/* Camera - dramatic product photography angle */}
      <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={28} />

      {/* Orbit controls - full 3D rotation freedom with useful limits */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={15}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI / 12}  // 15° - near top view
        maxPolarAngle={(11 * Math.PI) / 12}  // 165° - near bottom view
        target={[0, 0, 0]}
        autoRotate={false}
      />

      {/* The pen with subtle float - angled at 45 degrees */}
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.3}
        floatingRange={[-0.1, 0.1]}
      >
        <PenComponent
          bodyMaterial={bodyMaterial}
          trimMaterial={trimMaterial}
          nibMaterial={nibMaterial}
          scale={0.5}
          rotation={[Math.PI / 2.5, 0, Math.PI / 8]}
        />
      </Float>

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

      {/* Instructions overlay */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-lg bg-white/10 px-4 py-2 text-center backdrop-blur-sm border border-white/20">
        <p className="text-xs text-white/90 font-medium">
          Drag to rotate 360° • Scroll to zoom • Tilt to view from any angle
        </p>
      </div>
    </div>
  );
}
