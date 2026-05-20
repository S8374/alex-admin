"use client";

import { AuthSlide } from "@/app/data/authConfig";
import { inter } from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthShellProps {
  slide: AuthSlide;
  children: React.ReactNode;
}

export function AuthShell({ slide, children }: AuthShellProps) {
  return (
    <div className={`min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-4 md:p-8 ${inter.className}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden border border-gray-100"
      >
        {/* Left: Branding & Visuals */}
        <div className="relative md:w-[48%] min-h-[300px] md:min-h-[700px] overflow-hidden group">
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#85A1D1]/90 via-[#85A1D1]/40 to-transparent" />
          
          <div className="absolute top-10 left-10 z-10">
            <Link href="/" className="flex items-center gap-2 group/logo">
              <Image
                src="/logo/encore.png"
                alt="Encore Logo"
                width={140}
                height={40}
              />
            </Link>
          </div>

          <div className="absolute bottom-12 left-10 right-10 z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/30">
                Premium Dashboard
              </span>
              <h2 className="text-white font-bold text-3xl lg:text-4xl leading-tight drop-shadow-xl">
                {slide.quote}
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Right: Interaction Panel */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-16 lg:px-20 relative bg-white">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
          
          {/* Subtle footer in form panel */}
          <div className="absolute bottom-8 text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide">
              &copy; 2026 ALEX GARRETT ENTERPRISES. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
