"use client"

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import heroVideoUrl from '@/assets/hero-bg.mp4'
import { useMediaQuery } from 'react-responsive'

const HeroSection = () => {
  const containerRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useGSAP(
    () => {
      if (!containerRef.current || !videoRef.current) return

      gsap.registerPlugin(ScrollTrigger)

      const videoElement = videoRef.current
      const containerElement = containerRef.current

      const startValue = isMobile ? "top 50%" : "center 60%";
      const endValue = isMobile ? "120% top" : "bottom top";
      
      let tl = gsap.timeline({
      scrollTrigger: {
        trigger: "video",
        start: startValue,
        end: endValue,
        scrub: true,
        pin: true,
      },
      });
      
      videoRef.current.onloadedmetadata = () => {
      tl.to(videoRef.current, {
        currentTime: videoRef.current?.duration,
      });
      };
      // // Ensure initial state
      // videoElement.pause()
      // videoElement.currentTime = 0

      // const setupScrollScrub = () => {
      //   const videoDuration = Number.isFinite(videoElement.duration) && videoElement.duration > 0 ? videoElement.duration : 1

      //   // Kill any existing triggers for idempotency
      //   ScrollTrigger.getAll().forEach((t) => {
      //     if ((t as any).vars?.id === 'hero-video-scrub') t.kill()
      //   })

      //   gsap.to(videoElement, {
      //     currentTime: videoDuration,
      //     ease: 'none',
      //     scrollTrigger: {
      //       id: 'hero-video-scrub',
      //       trigger: containerElement,
      //       start: 'top top',
      //       end: '+=2000',
      //       scrub: true,
      //       pin: true,
      //       anticipatePin: 1,
      //     },
      //   })
      // }

      // if (Number.isFinite(videoElement.duration) && videoElement.duration > 0) {
      //   setupScrollScrub()
      // } else {
      //   const onLoaded = () => {
      //     setupScrollScrub()
      //   }
      //   videoElement.addEventListener('loadedmetadata', onLoaded, { once: true })
      // }
    },
    { scope: containerRef }
  )

  // Prevent autoplay on mount in some browsers when scrubbing
  useEffect(() => {
    if (videoRef.current) {
      try {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      } catch {}
    }
  }, [])

  return (
    <section ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#000' }}>
      <video
        ref={videoRef}
        src={"/videos/hero-bg.mp4"}
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100vh', objectFit: 'cover', display: 'block' }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          pointerEvents: 'none',
          padding: '0 1rem',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.35))',
        }}
      >
        <div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Experience the Flow</h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', opacity: 0.85, marginTop: '0.75rem' }}>
            Scroll to scrub through the moment.
          </p>
        </div>
      </div>

      {/* Spacer after the pinned section for continued scroll */}
      <div style={{ height: '120vh' }} />
    </section>
  )
}

export default HeroSection