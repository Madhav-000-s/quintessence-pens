"use client"
import HeroSection from '@/components/landing-page/sections/hero'
import { Catalog } from '@/components/landing-page/sections/catalog'
import { Production } from '@/components/landing-page/sections/production'
import React from 'react'
import { TestimonialsWall } from '@/components/landing-page/sections/testimonials'

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <Catalog />
      <Production />
      <TestimonialsWall />
    </div>
  )
}

export default LandingPage