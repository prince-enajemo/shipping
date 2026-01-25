"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(12,44,85,0)", "rgba(12,44,85,0.95)"]
  );
  const blur = useTransform(scrollY, [0, 80], ["0px", "8px"]);
  const height = useTransform(scrollY, [0, 80], ["80px", "64px"]);

  return (
    <motion.nav
      style={{ background, backdropFilter: blur, height }}
      className="fixed top-0 left-0 right-0 z-50 px-6 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-white font-bold text-xl tracking-wide"
        >
          SwiftTrack
        </motion.div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#EDEDCE]">
          {[
            { name: "Home", href: "/" },
            { name: "Track", href: "/track" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
          ].map((link, index) => (
            <motion.div key={index} whileHover={{ y: -2 }}>
              <Link
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex border border-white/50 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-white hover:text-[#0C2C55] transition"
            >
              Admin Login
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/track"
              className="bg-[#629FAD] text-[#0C2C55] px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:bg-[#EDEDCE] transition"
            >
              Track Package
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
