"use client";

import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Black Glass Pane */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <nav className="mx-auto flex h-24 items-center justify-between px-8">
          {/* Left: Logo + Brand Name */}
          <div className="flex w-1/4 items-center">
            <Link href="/dashboard" className="group flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-luxury-gradient transition-all group-hover:scale-105">
                <span
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    background: 'linear-gradient(135deg, var(--luxury-black), var(--luxury-navy))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Q
                </span>
              </div>
              <h1
                className="text-xl font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-serif)',
                  background: 'linear-gradient(135deg, var(--luxury-gold-light), var(--luxury-gold), var(--luxury-gold-dark))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Quintessence
              </h1>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex w-1/2 items-center justify-center gap-10">
            <Link
              href="/dashboard"
              className="nav-link group relative px-1 py-2 text-sm font-semibold tracking-wide text-luxury-gold-muted transition-colors hover:text-luxury-gold"
            >
              Home
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/catalog"
              className="nav-link group relative px-1 py-2 text-sm font-semibold tracking-wide text-luxury-gold-muted transition-colors hover:text-luxury-gold"
            >
              Catalog
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/about"
              className="nav-link group relative px-1 py-2 text-sm font-semibold tracking-wide text-luxury-gold-muted transition-colors hover:text-luxury-gold"
            >
              About Us
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/contact"
              className="nav-link group relative px-1 py-2 text-sm font-semibold tracking-wide text-luxury-gold-muted transition-colors hover:text-luxury-gold"
            >
              Contact
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/* Right: Login + Cart + User Menu */}
          <div className="flex w-1/4 items-center justify-end gap-4">
            <Link
              href="/login"
              className="rounded-lg border border-luxury-gold bg-transparent px-5 py-2.5 text-sm font-semibold text-luxury-gold transition-all hover:bg-luxury-gold hover:text-luxury-black"
            >
              Login/Sign Up
            </Link>

            <Link
              href="/cart"
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-luxury-gold"
            >
              <ShoppingCart className="h-5 w-5 text-luxury-gold transition-colors hover:text-luxury-black" />
              {/* Cart count badge */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-xs font-bold text-luxury-black">
                0
              </span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-luxury-gold">
                  <User className="h-5 w-5 text-luxury-gold transition-colors hover:text-luxury-black" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-black/90 text-luxury-gold backdrop-blur-xl"
              >
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-luxury-gold hover:text-luxury-black">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-luxury-gold hover:text-luxury-black">
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-luxury-gold hover:text-luxury-black">
                  <Link href="/cart">Cart</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer hover:bg-destructive hover:text-white">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
