"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MaterialProperties } from "@/types/configurator";

interface ProceduralPenProps {
  bodyMaterial: MaterialProperties;
  trimMaterial: MaterialProperties;
  nibMaterial: MaterialProperties;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

export function PoseidonPen({
  bodyMaterial,
  trimMaterial,
  nibMaterial,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: ProceduralPenProps) {
  const penGroupRef = useRef<THREE.Group>(null);

  // POSEIDON - Streamlined, balanced, flowing design
  const capLength = 3.7;  // Standard length
  const barrelLength = 3.6; // Balanced proportions

  // Radius at different points - TORPEDO shape, balanced
  const capTopRadius = 0.34;
  const capMaxRadius = 0.43; // Balanced width
  const capBottomRadius = 0.40;
  const barrelTopRadius = 0.39;
  const barrelMaxRadius = 0.42; // Smooth flow
  const barrelBottomRadius = 0.33;
  const gripTopRadius = 0.32;
  const gripBottomRadius = 0.28;
  const nibLength = 0.92; // Standard nib

  // Create cigar-shaped lathe geometry
  const createCigarShape = (
    topRadius: number,
    maxRadius: number,
    bottomRadius: number,
    length: number,
    segments: number = 64
  ) => {
    const points: THREE.Vector2[] = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = (t - 0.5) * length;

      // Smooth cigar curve using bezier-like interpolation
      let radius: number;
      if (t < 0.5) {
        // Top half
        const localT = t * 2;
        radius = topRadius + (maxRadius - topRadius) * (1 - Math.pow(1 - localT, 2));
      } else {
        // Bottom half
        const localT = (t - 0.5) * 2;
        radius = maxRadius + (bottomRadius - maxRadius) * Math.pow(localT, 1.5);
      }

      points.push(new THREE.Vector2(radius, y));
    }

    return new THREE.LatheGeometry(points, segments);
  };

  const capGeometry = useMemo(
    () => createCigarShape(capTopRadius, capMaxRadius, capBottomRadius, capLength, 64),
    []
  );

  const barrelGeometry = useMemo(
    () => createCigarShape(barrelTopRadius, barrelMaxRadius, barrelBottomRadius, barrelLength, 64),
    []
  );

  return (
    <group
      ref={penGroupRef}
      scale={scale}
      rotation={rotation}
      position={position}
    >
      {/* ========== CAP ========== */}
      <group position={[0, capLength / 2, 0]}>
        {/* Cap body - cigar shaped */}
        <mesh castShadow receiveShadow geometry={capGeometry}>
          <meshPhysicalMaterial
            color={bodyMaterial.color}
            metalness={bodyMaterial.metalness}
            roughness={bodyMaterial.roughness}
            clearcoat={bodyMaterial.clearcoat || 0}
            clearcoatRoughness={bodyMaterial.clearcoatRoughness || 0.1}
            emissive={bodyMaterial.emissive || bodyMaterial.color}
            emissiveIntensity={bodyMaterial.emissiveIntensity || 0}
            envMapIntensity={1.5}
            reflectivity={0.8}
          />
        </mesh>

        {/* Cap top finial (faceted dome) */}
        <mesh castShadow position={[0, capLength / 2 + 0.1, 0]}>
          <sphereGeometry args={[capTopRadius * 0.85, 16, 16]} />
          <meshPhysicalMaterial
            color={trimMaterial.color}
            metalness={trimMaterial.metalness}
            roughness={trimMaterial.roughness}
            emissive={trimMaterial.emissive || trimMaterial.color}
            emissiveIntensity={trimMaterial.emissiveIntensity || 0}
            envMapIntensity={2}
          />
        </mesh>

        {/* Decorative jewel on cap top */}
        <mesh castShadow position={[0, capLength / 2 + 0.35, 0]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshPhysicalMaterial
            color="#8B0000"
            metalness={0}
            roughness={0.05}
            transmission={0.9}
            thickness={0.5}
            ior={1.8}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>

        {/* Cap band with guilloche pattern simulation */}
        <group position={[0, -capLength / 2 + 0.4, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[capBottomRadius * 1.03, capBottomRadius * 1.03, 0.25, 64]} />
            <meshPhysicalMaterial
              color={trimMaterial.color}
              metalness={trimMaterial.metalness}
              roughness={trimMaterial.roughness}
              emissive={trimMaterial.emissive || trimMaterial.color}
              emissiveIntensity={trimMaterial.emissiveIntensity || 0}
              envMapIntensity={2}
            />
          </mesh>

          {/* Guilloche pattern rings */}
          {[0, 0.08, -0.08].map((offset, i) => (
            <mesh key={i} position={[0, offset, 0]}>
              <torusGeometry args={[capBottomRadius * 1.01, 0.008, 8, 64]} />
              <meshPhysicalMaterial
                color={trimMaterial.color}
                metalness={1}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>

        {/* Elegant clip */}
        <group position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          {/* Clip main body (curved) */}
          <mesh castShadow position={[0, 0, capMaxRadius * 0.95]}>
            <boxGeometry args={[0.18, 2.8, 0.06]} />
            <meshPhysicalMaterial
              color={trimMaterial.color}
              metalness={trimMaterial.metalness}
              roughness={trimMaterial.roughness * 0.8}
              emissive={trimMaterial.emissive || trimMaterial.color}
              emissiveIntensity={trimMaterial.emissiveIntensity || 0}
              envMapIntensity={2}
            />
          </mesh>

          {/* Clip ball end */}
          <mesh castShadow position={[0, 1.5, capMaxRadius * 1.0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshPhysicalMaterial
              color={trimMaterial.color}
              metalness={trimMaterial.metalness}
              roughness={trimMaterial.roughness * 0.7}
              emissive={trimMaterial.emissive || trimMaterial.color}
              emissiveIntensity={trimMaterial.emissiveIntensity || 0}
            />
          </mesh>

          {/* Clip decorative inlay */}
          <mesh position={[0, 0.5, capMaxRadius * 0.96]}>
            <boxGeometry args={[0.12, 1.5, 0.03]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={0.3}
              roughness={0.6}
            />
          </mesh>
        </group>

        {/* Cap threads (where it screws onto barrel) */}
        <group position={[0, -capLength / 2, 0]}>
          {[0, 0.05, 0.1, 0.15].map((offset, i) => (
            <mesh key={i} position={[0, -offset, 0]} rotation={[0, i * 0.3, 0]}>
              <torusGeometry args={[capBottomRadius * 0.95, 0.015, 6, 48]} />
              <meshStandardMaterial
                color={bodyMaterial.color}
                metalness={bodyMaterial.metalness * 0.5}
                roughness={bodyMaterial.roughness * 1.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========== BARREL ========== */}
      <group position={[0, -barrelLength / 2, 0]}>
        {/* Barrel body - cigar shaped */}
        <mesh castShadow receiveShadow geometry={barrelGeometry}>
          <meshPhysicalMaterial
            color={bodyMaterial.color}
            metalness={bodyMaterial.metalness}
            roughness={bodyMaterial.roughness}
            clearcoat={bodyMaterial.clearcoat || 0}
            clearcoatRoughness={bodyMaterial.clearcoatRoughness || 0.1}
            emissive={bodyMaterial.emissive || bodyMaterial.color}
            emissiveIntensity={bodyMaterial.emissiveIntensity || 0}
            envMapIntensity={1.5}
            reflectivity={0.8}
          />
        </mesh>

        {/* Center decorative band */}
        <mesh castShadow position={[0, barrelLength / 2 - 0.2, 0]}>
          <cylinderGeometry args={[barrelTopRadius * 1.02, barrelTopRadius * 1.02, 0.15, 64]} />
          <meshPhysicalMaterial
            color={trimMaterial.color}
            metalness={trimMaterial.metalness}
            roughness={trimMaterial.roughness}
            emissive={trimMaterial.emissive || trimMaterial.color}
            emissiveIntensity={trimMaterial.emissiveIntensity || 0}
            envMapIntensity={2}
          />
        </mesh>

        {/* Piston knob at barrel end */}
        <group position={[0, -barrelLength / 2 - 0.15, 0]}>
          {/* Knob base */}
          <mesh castShadow>
            <cylinderGeometry args={[barrelBottomRadius * 1.1, barrelBottomRadius * 0.95, 0.3, 64]} />
            <meshPhysicalMaterial
              color={trimMaterial.color}
              metalness={trimMaterial.metalness}
              roughness={trimMaterial.roughness}
              emissive={trimMaterial.emissive || trimMaterial.color}
              emissiveIntensity={trimMaterial.emissiveIntensity || 0}
              envMapIntensity={2}
            />
          </mesh>

          {/* Knob grip rings */}
          {[-0.1, 0, 0.1].map((offset, i) => (
            <mesh key={i} position={[0, offset, 0]}>
              <torusGeometry args={[barrelBottomRadius * 1.05, 0.012, 8, 64]} />
              <meshPhysicalMaterial
                color={trimMaterial.color}
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          ))}

          {/* Brand medallion simulation */}
          <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[barrelBottomRadius * 0.6, 32]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* ========== GRIP SECTION ========== */}
      <group position={[0, -barrelLength - 0.9, 0]}>
        {/* Main grip body with slight taper */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[gripTopRadius, gripBottomRadius, 1.4, 64]} />
          <meshPhysicalMaterial
            color={bodyMaterial.color}
            metalness={bodyMaterial.metalness * 0.4}
            roughness={Math.min(bodyMaterial.roughness + 0.15, 0.9)}
            emissive={bodyMaterial.emissive || bodyMaterial.color}
            emissiveIntensity={(bodyMaterial.emissiveIntensity || 0) * 0.5}
          />
        </mesh>

        {/* Grip threads/rings for texture */}
        {[0.5, 0.35, 0.2, 0.05, -0.1, -0.25, -0.4].map((offset, i) => (
          <mesh key={i} position={[0, offset, 0]}>
            <torusGeometry
              args={[
                gripTopRadius - (0.5 - offset) * 0.05,
                0.015,
                8,
                64,
              ]}
            />
            <meshStandardMaterial
              color={bodyMaterial.color}
              metalness={bodyMaterial.metalness * 0.3}
              roughness={Math.min(bodyMaterial.roughness + 0.2, 1)}
            />
          </mesh>
        ))}

        {/* Section threads (where grip unscrews from barrel) */}
        <group position={[0, 0.7, 0]}>
          {[0, 0.04, 0.08].map((offset, i) => (
            <mesh key={i} position={[0, offset, 0]} rotation={[0, i * 0.4, 0]}>
              <torusGeometry args={[gripTopRadius * 0.97, 0.012, 6, 48]} />
              <meshStandardMaterial
                color={bodyMaterial.color}
                metalness={bodyMaterial.metalness * 0.4}
                roughness={bodyMaterial.roughness * 1.3}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========== NIB SECTION ========== */}
      <group position={[0, -barrelLength - 2.0, 0]}>
        {/* Nib housing (section collar) */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[gripBottomRadius * 0.95, gripBottomRadius * 0.65, 0.7, 64]} />
          <meshPhysicalMaterial
            color={trimMaterial.color}
            metalness={trimMaterial.metalness}
            roughness={trimMaterial.roughness}
            emissive={trimMaterial.emissive || trimMaterial.color}
            emissiveIntensity={trimMaterial.emissiveIntensity || 0}
            envMapIntensity={2}
          />
        </mesh>

        {/* Feed (visible through nib) */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.25, 0.8, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>

        {/* Feed channels */}
        {[-0.08, 0, 0.08].map((offset, i) => (
          <mesh key={i} position={[offset, -0.5, 0.08]}>
            <boxGeometry args={[0.02, 0.8, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        ))}

        {/* Premium nib */}
        <group position={[0, -0.75, 0]}>
          {/* Nib body (wider, more detailed) */}
          <mesh castShadow>
            <boxGeometry args={[0.4, nibLength, 0.06]} />
            <meshPhysicalMaterial
              color={nibMaterial.color}
              metalness={nibMaterial.metalness}
              roughness={nibMaterial.roughness}
              envMapIntensity={2.5}
            />
          </mesh>

          {/* Nib tines (split) */}
          <group>
            {/* Left tine */}
            <mesh castShadow position={[-0.025, -nibLength / 4, 0.04]}>
              <boxGeometry args={[0.17, nibLength / 2, 0.02]} />
              <meshPhysicalMaterial
                color={nibMaterial.color}
                metalness={nibMaterial.metalness}
                roughness={nibMaterial.roughness * 0.8}
              />
            </mesh>

            {/* Right tine */}
            <mesh castShadow position={[0.025, -nibLength / 4, 0.04]}>
              <boxGeometry args={[0.17, nibLength / 2, 0.02]} />
              <meshPhysicalMaterial
                color={nibMaterial.color}
                metalness={nibMaterial.metalness}
                roughness={nibMaterial.roughness * 0.8}
              />
            </mesh>
          </group>

          {/* Center slit between tines */}
          <mesh position={[0, -nibLength / 4, 0.05]}>
            <boxGeometry args={[0.015, nibLength / 2 + 0.1, 0.01]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Tipping material (iridium point) */}
          <mesh castShadow position={[0, -nibLength / 2 - 0.05, 0.04]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshPhysicalMaterial
              color="#E8E8E8"
              metalness={1}
              roughness={0.1}
              envMapIntensity={3}
            />
          </mesh>

          {/* Breather hole */}
          <mesh position={[0, nibLength / 3, 0.035]}>
            <circleGeometry args={[0.06, 32]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Nib engraving simulation (size marking) */}
          <mesh position={[0, nibLength / 4, 0.032]}>
            <planeGeometry args={[0.15, 0.08]} />
            <meshBasicMaterial color="#1a1a1a" opacity={0.3} transparent />
          </mesh>

          {/* Decorative nib shoulders */}
          <group position={[0, nibLength / 2.5, 0]}>
            {/* Left shoulder */}
            <mesh position={[-0.15, 0, 0]}>
              <boxGeometry args={[0.08, 0.15, 0.04]} />
              <meshPhysicalMaterial
                color={nibMaterial.color}
                metalness={nibMaterial.metalness}
                roughness={nibMaterial.roughness}
              />
            </mesh>

            {/* Right shoulder */}
            <mesh position={[0.15, 0, 0]}>
              <boxGeometry args={[0.08, 0.15, 0.04]} />
              <meshPhysicalMaterial
                color={nibMaterial.color}
                metalness={nibMaterial.metalness}
                roughness={nibMaterial.roughness}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
