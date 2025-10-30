import Image from 'next/image'
import React from 'react'

type Props = {}

export const LandingHeader = (props: Props) => {
  return (
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-40 py-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative h-24 w-24">
            <Image
              src="/images/hero/icon.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-12">
          <a
            href="#home"
            className="font-raleway tracking-wider font-medium text-amber-400 transition-colors duration-300 hover:text-amber-300"
          >
            HOME
          </a>
          <a
            href="#catalog"
            className="font-raleway tracking-wider text-white transition-colors duration-300 hover:text-amber-400"
          >
            CATALOG
          </a>
          <a
            href="#build"
            className="font-raleway tracking-wider text-white transition-colors duration-300 hover:text-amber-400"
          >
            BUILD
          </a>
          <a
            href="/login"
            className="font-raleway tracking-wider text-white transition-colors duration-300 hover:text-amber-400"
          >
            LOGIN
          </a>
        </div>
      </nav>
  )
}