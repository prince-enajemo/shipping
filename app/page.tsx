export default function Home() {
  return (
    <main className="bg-[#EDEDCE] text-[#0C2C55]">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C2C55] to-[#296374] text-white px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              SwiftTrack Logistics
            </h1>
            <p className="text-lg text-[#EDEDCE] mb-8">
              Fast. Secure. Reliable Shipping & Package Tracking.
            </p>
            <div className="flex gap-4">
              <a
                href="/track"
                className="bg-[#629FAD] text-[#0C2C55] px-6 py-3 rounded-xl font-semibold hover:bg-[#EDEDCE] transition"
              >
                Track a Package
              </a>
              <a
                href="/admin/login"
                className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#0C2C55] transition"
              >
                Admin Login
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="/delivery.svg"
              alt="Delivery Illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Why Choose SwiftTrack?</h2>
          <p className="text-lg text-[#296374] max-w-3xl mx-auto">
            We simplify logistics by combining technology, transparency, and trust.
            With SwiftTrack, every shipment is visible, secure, and delivered with confidence.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 mt-16">
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
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-[#629FAD]"
            >
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-[#296374]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#0C2C55] text-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
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
            <div
              key={index}
              className="bg-[#296374] rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="text-3xl font-bold text-[#EDEDCE] mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-[#EDEDCE]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">What You Can Track</h2>
          <p className="text-[#296374] max-w-3xl mx-auto">
            With SwiftTrack, you get full transparency — not just “In Transit.”
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Current Location",
            "Last Update Time",
            "Delivery Status",
            "Shipment History",
            "Receiver Details",
            "Package Information",
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4 border-l-4 border-[#629FAD]"
            >
              <div className="w-3 h-3 bg-[#296374] rounded-full" />
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business & Individual Section */}
      <section className="py-24 bg-[#629FAD] text-[#0C2C55] px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">For Businesses</h3>
            <ul className="space-y-4 text-lg">
              <li>✔ Manage bulk shipments easily</li>
              <li>✔ Reduce delivery disputes</li>
              <li>✔ Improve customer satisfaction</li>
              <li>✔ Centralized shipment dashboard</li>
            </ul>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-6">For Individuals</h3>
            <ul className="space-y-4 text-lg">
              <li>✔ Track personal packages easily</li>
              <li>✔ Send important documents safely</li>
              <li>✔ Get delivery updates without stress</li>
              <li>✔ Enjoy peace of mind</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Security & Reliability</h2>
          <p className="text-[#296374] max-w-3xl mx-auto">
            We take your data and packages seriously. Our platform is built with
            enterprise-grade security and reliability.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            "Secure Admin Access",
            "Encrypted Data Storage",
            "Verified Package Handling",
            "System Monitoring",
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#296374]"
            >
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0C2C55] text-white px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">What Our Customers Say</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            "SwiftTrack made it easy for my customers to track their orders without calling me every time.",
            "I sent important documents across states and tracked every step. Very reliable service.",
            "Their admin dashboard is clean, fast, and easy to use. Perfect for logistics operations.",
          ].map((text, index) => (
            <div
              key={index}
              className="bg-[#296374] rounded-2xl p-8 shadow-lg"
            >
              <p className="text-[#EDEDCE] mb-4">“{text}”</p>
              <p className="font-semibold">— Verified Customer</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-[#629FAD] text-[#0C2C55] px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Track Your Shipment?</h2>
          <p className="text-lg mb-10">
            Enter your tracking ID and see where your package is right now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/track"
              className="bg-[#0C2C55] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#296374] transition"
            >
              Track My Package
            </a>
            <a
              href="/admin/new-shipment"
              className="bg-white text-[#0C2C55] px-8 py-4 rounded-xl font-semibold hover:bg-[#EDEDCE] transition"
            >
              Create a Shipment
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C2C55] text-[#EDEDCE] py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">SwiftTrack Logistics</h3>
            <p className="text-sm">
              Fast. Secure. Reliable Shipping & Package Tracking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p>Email: support@swifttracklogistics.com</p>
            <p>Phone: +234 XXX XXX XXXX</p>
            <p>Mon – Sat: 8am – 8pm</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/track" className="hover:underline">Track Package</a></li>
              <li><a href="/admin/login" className="hover:underline">Admin Login</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm mt-10 opacity-70">
          © {new Date().getFullYear()} SwiftTrack Logistics. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
