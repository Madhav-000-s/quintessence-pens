"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { ZeusPen } from "./models/ZeusPen";
import { PoseidonPen } from "./models/PoseidonPen";
import { HeraPen } from "./models/HeraPen";
import { AthenaPen } from "./models/AthenaPen";
import * as THREE from "three";
import type { PenModel } from "@/types/configurator";

interface PenConfiguration {
    model: PenModel;
    bodyColor: string;
    bodyMaterial: string;
    bodyFinish: string;
    trimFinish: string;
    nibMaterial: string;
    engraving?: {
        text: string;
        font: string;
        location: string;
    };
}

interface PenPreviewProps {
    config: PenConfiguration;
    className?: string;
    size?: "sm" | "md" | "lg";
}

function StaticPenScene({ config }: { config: PenConfiguration }) {
    // Memoize material properties for performance
    const bodyMaterial = useMemo(() => {
        const baseProps = {
            color: config.bodyColor || "#1a1a1a",
            metalness: 0.9,
            roughness: 0.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.1,
            emissive: config.bodyColor || "#1a1a1a",
            emissiveIntensity: 0.05,
        };

        // Adjust based on finish
        if (config.bodyFinish === "matte") {
            return { ...baseProps, roughness: 0.8, clearcoat: 0 };
        } else if (config.bodyFinish === "glossy") {
            return { ...baseProps, roughness: 0.1, clearcoat: 0.9 };
        }

        return baseProps;
    }, [config.bodyColor, config.bodyFinish]);

    const trimMaterial = useMemo(() => ({
        color: config.trimFinish === "gold" ? "#d4af37" : "#C0C0C0",
        metalness: 1,
        roughness: 0.1,
        emissive: config.trimFinish === "gold" ? "#d4af37" : "#C0C0C0",
        emissiveIntensity: 0.2,
    }), [config.trimFinish]);

    const nibMaterial = useMemo(() => ({
        color: config.nibMaterial === "steel" ? "#D3D3D3" : "#FFD700",
        metalness: 1,
        roughness: config.nibMaterial === "steel" ? 0.3 : 0.15,
    }), [config.nibMaterial]);

    const PenModelComponents: Record<PenModel, React.ComponentType<any>> = {
        zeus: ZeusPen,
        poseidon: PoseidonPen,
        hera: HeraPen,
        athena: AthenaPen,
    };

    const PenComponent = PenModelComponents[config.model] || ZeusPen;

    return (
        <>
            {/* Simplified lighting for performance */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={0.6}
                color="#ffffff"
            />
            <directionalLight
                position={[-5, 5, 5]}
                intensity={0.3}
                color="#f5f5ff"
            />
            <ambientLight intensity={0.3} color="#ffffff" />

            {/* Minimal environment for reflections */}
            <Environment preset="studio" environmentIntensity={0.4} background={false} />

            {/* Static camera position */}
            <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={30} />

            {/* The pen - static, no animations */}
            <PenComponent
                bodyMaterial={bodyMaterial}
                trimMaterial={trimMaterial}
                nibMaterial={nibMaterial}
                scale={0.45}
                rotation={[-Math.PI / 2, -5 * Math.PI / 6, 0]}
                engraving={config.engraving}
            />

            {/* Simple shadow */}
            <ContactShadows
                position={[0, -3.5, 0]}
                opacity={0.3}
                scale={8}
                blur={1.5}
                far={4}
                resolution={256}
                color="#000000"
            />
        </>
    );
}

function LoadingFallback({ size }: { size: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "h-32 w-32",
        md: "h-48 w-48",
        lg: "h-64 w-64",
    };

    return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black ${sizeClasses[size]}`}>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400/30 border-t-amber-400" />
        </div>
    );
}

export function PenPreview({ config, className = "", size = "md" }: PenPreviewProps) {
    const sizeClasses = {
        sm: "h-32 w-32",
        md: "h-48 w-48",
        lg: "h-64 w-64",
    };

    return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            <Canvas
                shadows={false}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.0,
                    outputColorSpace: THREE.SRGBColorSpace,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
            >
                <Suspense fallback={null}>
                    <StaticPenScene config={config} />
                </Suspense>
            </Canvas>

            {/* Subtle glow effect */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}
