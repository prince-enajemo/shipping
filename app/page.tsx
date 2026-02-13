"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const slides = [
  {
    image:
      "https://i.pinimg.com/1200x/aa/db/2c/aadb2ca2884fed03e459a9a08a89a1d7.jpg",
    badge: "Smart Logistics Platform",
    title: "Fast, Reliable & Transparent Shipping",
    subtitle:
      "Track your shipments in real-time, manage deliveries, and build trust with your customers using SwiftTrack.",
    cta: "Track Your Package",
    link: "/track",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmK9Swhv6T6Zi2y-wEpcuh4R8PnhoSBNe2lw&s",
    badge: "Real-Time Monitoring",
    title: "Know Where Your Package Is Always",
    subtitle:
      "Get full visibility into your shipment’s journey with live location updates and delivery status.",
    cta: "Check Tracking",
    link: "/track",
  },
  {
    image:
      "https://img.freepik.com/free-photo/front-view-delivery-men-job-concept_23-2148684731.jpg?semt=ais_hybrid&w=740&q=80",
    badge: "Nationwide Delivery",
    title: "Trusted Delivery Across The Globe",
    subtitle:
      "From pickup to final delivery, we handle your shipments with speed, care, and professionalism.",
    cta: "Check Shipment",
    link: "/track",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#EDEDCE] text-[#0C2C55] overflow-x-hidden">
      <Navbar />

      <section className="pt-14 md:pt-18" />

      {/* ================= HERO SLIDESHOW ================= */}
      <section className="relative h-screen w-full overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(12,44,85,0.78), rgba(12,44,85,0.78)), url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-full flex items-center px-6">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{
                    opacity: index === current ? 1 : 0,
                    y: index === current ? 0 : 40,
                  }}
                  transition={{ duration: 0.8 }}
                  className="text-white"
                >
                  <span className="inline-block bg-[#629FAD]/20 text-[#EDEDCE] px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {slide.badge}
                  </span>

                  <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mt-14 md:mt-0 mb-6">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-[#EDEDCE]/90 max-w-xl mb-10">
                    {slide.subtitle}
                  </p>

                  {/* CTA Row */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      href="/track"
                      className="bg-[#629FAD] text-[#0C2C55] px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-[#EDEDCE] transition"
                    >
                      {slide.cta}
                    </motion.a>

                    <div className="flex items-center gap-3 text-sm text-[#EDEDCE]/90">
                      <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      Live tracking enabled
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
                    {[
                      { value: "10K+", label: "Packages Delivered" },
                      { value: "98%", label: "Delivery Success" },
                      { value: "24/7", label: "Support" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center"
                      >
                        <p className="text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-[#EDEDCE]/80">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right Side Floating Card */}
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={{
                    opacity: index === current ? 1 : 0,
                    x: index === current ? 0 : 60,
                  }}
                  transition={{ duration: 0.9 }}
                  className="hidden lg:block"
                >
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 max-w-md ml-auto"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      Track Your Shipment
                    </h3>
                    <p className="text-[#296374] mb-6">
                      Enter your tracking ID to get live delivery updates.
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter Tracking ID"
                        className="flex-1 px-4 py-3 rounded-lg border border-[#629FAD]/40 focus:outline-none focus:ring-2 focus:ring-[#629FAD]"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#0C2C55] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#296374] transition"
                      >
                        Track
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent(index)}
              whileHover={{ scale: 1.3 }}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? "bg-[#629FAD]" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-28 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Why Choose SwiftTrack?</h2>
          <p className="text-lg text-[#296374] max-w-3xl mx-auto">
            We simplify logistics by combining technology, transparency, and trust.
            With SwiftTrack, every shipment is visible, secure, and delivered with
            confidence.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 mt-20">
          {[
            {
              title: "Real-Time Tracking",
              desc: "Monitor your shipment’s location, status, and history instantly.",
            },
            {
              title: "Secure Handling",
              desc: "Your packages are handled with strict safety and care standards.",
            },
            {
              title: "Fast Delivery",
              desc: "Choose standard or express delivery based on your needs.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-[#629FAD] flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="h-40 w-full rounded-xl bg-gradient-to-br from-[#629FAD]/30 to-[#296374]/30 mb-6 flex items-center justify-center text-[#296374] font-semibold">
                Image Placeholder
              </div>

              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-[#296374]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= HOW IT WORKS ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-28 bg-[#0C2C55] text-white px-6"
      >
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold">How It Works</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {[
            {
              step: "01",
              title: "Create Shipment",
              desc: "Admin enters sender, receiver, and package details.",
            },
            {
              step: "02",
              title: "Get Tracking ID",
              desc: "A unique tracking number is generated instantly.",
            },
            {
              step: "03",
              title: "Track Package",
              desc: "Receiver enters the ID to view real-time status.",
            },
            {
              step: "04",
              title: "Receive Delivery",
              desc: "Package is delivered and confirmed successfully.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-[#296374] rounded-2xl p-6 shadow-lg text-center flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="h-32 w-full rounded-xl bg-[#0C2C55]/40 mb-6 flex items-center justify-center text-[#EDEDCE]/80 text-sm">
                Step Image
              </div>

              <div className="text-3xl font-bold text-[#EDEDCE] mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-[#EDEDCE]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-28 px-6"
      >
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">What You Can Track</h2>
          <p className="text-[#296374] max-w-3xl mx-auto">
            With SwiftTrack, you get full transparency — not just “In Transit.”
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            "Current Location",
            "Last Update Time",
            "Delivery Status",
            "Shipment History",
            "Receiver Details",
            "Package Information",
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -6 }}
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#629FAD] flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="h-28 w-full rounded-lg bg-gradient-to-br from-[#EDEDCE] to-[#629FAD]/40 mb-5 flex items-center justify-center text-[#296374] text-sm font-medium">
                Feature Image
              </div>

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-[#296374] rounded-full" />
                <p className="font-medium">{item}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= BUSINESS & INDIVIDUALS ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-28 bg-[#629FAD] text-[#0C2C55] px-6"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div whileHover={{ y: -8 }}>
            {/* Image Placeholder */}
            <div className="h-56 w-full rounded-2xl bg-[#EDEDCE]/70 mb-8 flex items-center justify-center font-semibold text-[#296374]">
              Business Image
            </div>

            <h3 className="text-3xl font-bold mb-6">For Businesses</h3>
            <ul className="space-y-4 text-lg">
              <li>✔ Manage bulk shipments easily</li>
              <li>✔ Reduce delivery disputes</li>
              <li>✔ Improve customer satisfaction</li>
              <li>✔ Centralized shipment dashboard</li>
            </ul>
          </motion.div>

          <motion.div whileHover={{ y: -8 }}>
            {/* Image Placeholder */}
            <div className="h-56 w-full rounded-2xl bg-[#EDEDCE]/70 mb-8 flex items-center justify-center font-semibold text-[#296374]">
              Individual Image
            </div>

            <h3 className="text-3xl font-bold mb-6">For Individuals</h3>
            <ul className="space-y-4 text-lg">
              <li>✔ Track personal packages easily</li>
              <li>✔ Send important documents safely</li>
              <li>✔ Get delivery updates without stress</li>
              <li>✔ Enjoy peace of mind</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= SECURITY SECTION ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-28 px-6"
      >
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">Security & Reliability</h2>
          <p className="text-[#296374] max-w-3xl mx-auto">
            We take your data and packages seriously. Our platform is built with
            enterprise-grade security and reliability.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {[
            "Secure Admin Access",
            "Encrypted Data Storage",
            "Verified Package Handling",
            "System Monitoring",
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center border-b-4 border-[#296374] flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="h-28 w-full rounded-lg bg-[#629FAD]/30 mb-6 flex items-center justify-center text-[#296374] font-medium">
                Security Image
              </div>

              <p className="font-semibold">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= TESTIMONIALS ================= */}
      <TestimonialsCarousel />


      {/* ================= CALL TO ACTION ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-28 bg-[#629FAD] text-[#0C2C55] px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Track Your Shipment?
          </h2>
          <p className="text-lg mb-12">
            Enter your tracking ID and see where your package is right now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.98 }}
              href="/track"
              className="bg-[#0C2C55] text-white px-10 py-5 rounded-xl font-semibold shadow-lg hover:bg-[#296374] transition"
            >
              Track My Package
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.98 }}
              href="/track"
              className="bg-white text-[#0C2C55] px-10 py-5 rounded-xl font-semibold shadow-lg hover:bg-[#EDEDCE] transition"
            >
              Shipment
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#0C2C55] text-[#EDEDCE] py-14 px-6"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">SwiftTrack Logistics</h3>
            <p className="text-sm">
              Fast. Secure. Reliable Shipping & Package Tracking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p>Email: support@swifttracklogistics.com</p>
            <p>Phone: +234 XXX XXX XXXX</p>
            <p>Mon – Sat: 8am – 8pm</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/track" className="hover:underline">
                  Track Package
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Admin Login
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm mt-12 opacity-70">
          © {new Date().getFullYear()} SwiftTrack Logistics. All rights reserved.
        </div>
      </motion.footer>
    </main>
  );
}
