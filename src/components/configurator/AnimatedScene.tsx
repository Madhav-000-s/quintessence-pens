"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useConfiguratorStore } from "@/lib/store/configurator";
import gsap from "gsap";
import * as THREE from "three";

export function AnimatedScene() {
  const { camera } = useThree();
  const currentSection = useConfiguratorStore((state) => state.currentSection);
  const isAnimating = useConfiguratorStore((state) => state.isAnimating);
  const setIsAnimating = useConfiguratorStore((state) => state.setIsAnimating);
  const hasAnimatedRef = useRef(false);

  // Initial camera animation on page load
  useEffect(() => {
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      setIsAnimating(true);

      // Start from far away and zoom in closer
      camera.position.set(15, 8, 15);
      camera.lookAt(0, 0, 0);

      gsap.to(camera.position, {
        x: 8,
        y: 4,
        z: 8,
        duration: 2.5,
        ease: "power2.out",
        onComplete: () => {
          setIsAnimating(false);
        },
      });
    }
  }, [camera, setIsAnimating]);

  // Camera animations based on section focus
  useEffect(() => {
    if (!currentSection || currentSection === "body") return;

    setIsAnimating(true);

    let targetPosition: THREE.Vector3;
    let lookAtTarget: THREE.Vector3;

    switch (currentSection) {
      case "nib":
        // Focus on nib (bottom of pen)
        targetPosition = new THREE.Vector3(3, -2, 3);
        lookAtTarget = new THREE.Vector3(0, -3, 0);
        break;
      case "trim":
        // Focus on cap and trim
        targetPosition = new THREE.Vector3(4, 3, 4);
        lookAtTarget = new THREE.Vector3(0, 2, 0);
        break;
      case "engraving":
        // Close-up on cap body
        targetPosition = new THREE.Vector3(2, 2, 2);
        lookAtTarget = new THREE.Vector3(0, 1.5, 0);
        break;
      case "review":
        // Full view
        targetPosition = new THREE.Vector3(6, 3, 6);
        lookAtTarget = new THREE.Vector3(0, 0, 0);
        break;
      default:
        // Default position - closer and more zoomed
        targetPosition = new THREE.Vector3(8, 4, 8);
        lookAtTarget = new THREE.Vector3(0, 0, 0);
    }

    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: "power2.inOut",
    });

    // Animate camera look-at
    const tempTarget = { x: 0, y: 0, z: 0 };
    gsap.to(tempTarget, {
      x: lookAtTarget.x,
      y: lookAtTarget.y,
      z: lookAtTarget.z,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(tempTarget.x, tempTarget.y, tempTarget.z);
      },
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  }, [currentSection, camera, setIsAnimating]);

  return null;
}
