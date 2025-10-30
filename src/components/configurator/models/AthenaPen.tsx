"use client";

import { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import type { MaterialProperties } from "@/types/configurator";

interface ProceduralPenProps {
  bodyMaterial: MaterialProperties;
  trimMaterial: MaterialProperties;
  nibMaterial: MaterialProperties;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

export function AthenaPen({
  bodyMaterial,
  trimMaterial,
  nibMaterial,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: ProceduralPenProps) {
  const penGroupRef = useRef<THREE.Group>(null);

  // Load FBX model
  const fbxModel = useLoader(FBXLoader, "/penmodel/base_basic_pbr.fbx");

  // Load PBR textures
  const [diffuseMap, metallicMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    "/penmodel/texture_diffuse.png",
    "/penmodel/texture_metallic.png",
    "/penmodel/texture_normal.png",
    "/penmodel/texture_roughness.png",
  ]);

  // Clone the model for customization
  const clonedModel = useMemo(() => {
    if (!fbxModel) return null;

    const clone = fbxModel.clone();

    // Traverse and apply materials
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Create PBR material with textures and customization
        const material = new THREE.MeshPhysicalMaterial({
          map: diffuseMap,
          metalnessMap: metallicMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          color: bodyMaterial.color,
          metalness: bodyMaterial.metalness,
          roughness: bodyMaterial.roughness,
          clearcoat: bodyMaterial.clearcoat || 0.5,
          clearcoatRoughness: bodyMaterial.clearcoatRoughness || 0.1,
          emissive: bodyMaterial.emissive || bodyMaterial.color,
          emissiveIntensity: bodyMaterial.emissiveIntensity || 0,
          envMapIntensity: 1.5,
        });

        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [fbxModel, bodyMaterial, trimMaterial, nibMaterial, diffuseMap, metallicMap, normalMap, roughnessMap]);

  if (!clonedModel) return null;

  return (
    <group
      ref={penGroupRef}
      scale={scale * 0.05}
      rotation={rotation}
      position={position}
    >
      <primitive object={clonedModel} />
    </group>
  );
}
