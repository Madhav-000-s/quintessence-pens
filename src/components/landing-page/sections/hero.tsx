import React from 'react'
import { Heading } from '../heading'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className='w-full min-h-screen'>
      <Image src="/images/hero/hero-bg.png" alt="" fill className='absolute -z-10'/>
      <Heading size="xl">
        Crafting
      </Heading>
      <Heading size="xl">
        Excellence
      </Heading>
    </section>
  )
}

export default Hero