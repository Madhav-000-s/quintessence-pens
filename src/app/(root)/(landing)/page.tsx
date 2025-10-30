"use client"
import HeroSection from '@/components/landing-page/sections/hero'
import { Catalog } from '@/components/landing-page/sections/catalog'
import { Production } from '@/components/landing-page/sections/production'
import React from 'react'
import { TestimonialsWall } from '@/components/landing-page/sections/testimonials'
import { Footer } from '@/components/landing-page/sections/footer'
import { CTA } from '@/components/landing-page/sections/cta'

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <Catalog />
      <Production />
      <TestimonialsWall />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage