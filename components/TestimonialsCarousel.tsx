import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Seller",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "SwiftTrack has completely transformed how we manage shipments. Fast, reliable, and easy to use!",
  },
  {
    name: "Michael Chen",
    role: "Logistics Manager",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Real-time tracking and automatic notifications have improved our customer satisfaction drastically.",
  },
  {
    name: "Amina Yusuf",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "The dashboard is clean, intuitive, and powerful. I highly recommend SwiftTrack to anyone shipping goods.",
  },
  {
    name: "David Wilson",
    role: "Warehouse Supervisor",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    quote: "Managing hundreds of packages daily is now seamless. SwiftTrack is a game changer.",
  },
  {
    name: "Grace Okafor",
    role: "Online Retailer",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    quote: "My customers love being able to track their deliveries in real time. It builds serious trust.",
  },
  {
    name: "Carlos Mendes",
    role: "Freight Coordinator",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    quote: "The automation features have saved us hours every week. Outstanding platform.",
  },
  {
    name: "Linda Park",
    role: "Dropshipping Entrepreneur",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote: "SwiftTrack makes international shipping feel local. Everything is smooth and transparent.",
  },
  {
    name: "Ahmed Bello",
    role: "Supply Chain Analyst",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    quote: "Accurate tracking and clean UI. Exactly what modern logistics needs.",
  },
  {
    name: "Natalie Brooks",
    role: "Operations Lead",
    image: "https://randomuser.me/api/portraits/women/39.jpg",
    quote: "SwiftTrack has helped us reduce delivery issues by over 30%. Highly recommended!",
  },
];

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const updateItems = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const slides = chunkArray(testimonials, itemsPerSlide);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="py-24 bg-[#EDEDCE]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-[#0C2C55] mb-12"
        >
          What Our Customers Say
        </motion.h2>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.x < -80) next();
                if (info.offset.x > 80) prev();
              }}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 grid-cols-1 md:grid-cols-3"
            >
              {slides[index].map((t, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
                >
                  <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[#296374] mb-4">“{t.quote}”</p>
                  <h4 className="font-semibold text-[#0C2C55]">{t.name}</h4>
                  <span className="text-sm text-[#629FAD]">{t.role}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === index
                    ? "bg-[#0C2C55] scale-125"
                    : "bg-[#629FAD] hover:bg-[#296374]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
