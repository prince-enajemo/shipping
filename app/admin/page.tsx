"use client";

import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { FiPackage, FiTruck, FiCheckCircle, FiActivity } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ------------------- COLORS ------------------- */
const COLORS = {
  primary: "#0C2C55",
  secondary: "#296374",
  accent: "#629FAD",
  background: "#F9F9F9",
  cardGradient: "bg-gradient-to-r from-[#0C2C55] to-[#296374]",
};

/* ------------------- FIX LEAFLET ICONS ------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ------------------- ADDRESS MAP PICKER ------------------- */
const AddressMapPicker = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
}: {
  origin: { lat: number | null; lng: number | null; address: string };
  destination: { lat: number | null; lng: number | null; address: string };
  onOriginChange: (lat: number, lng: number, address: string) => void;
  onDestinationChange: (lat: number, lng: number, address: string) => void;
}) => {
  const [originInput, setOriginInput] = useState(origin.address);
  const [destInput, setDestInput] = useState(destination.address);
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOriginSuggestions([]);
        setDestSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch origin suggestions
  useEffect(() => {
    if (!originInput) return setOriginSuggestions([]);
    const timer = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          originInput
        )}`
      );
      const data = await res.json();
      setOriginSuggestions(data.slice(0, 5));
    }, 300);
    return () => clearTimeout(timer);
  }, [originInput]);

  // Fetch destination suggestions
  useEffect(() => {
    if (!destInput) return setDestSuggestions([]);
    const timer = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          destInput
        )}`
      );
      const data = await res.json();
      setDestSuggestions(data.slice(0, 5));
    }, 300);
    return () => clearTimeout(timer);
  }, [destInput]);

  // Draggable Marker Component
  const DraggableMarker = ({
    position,
    onDragEnd,
  }: {
    position: { lat: number; lng: number };
    onDragEnd: (lat: number, lng: number) => void;
  }) => {
    const [pos, setPos] = useState(position);
    const map = useMapEvents({
      click(e) {
        setPos(e.latlng);
        onDragEnd(e.latlng.lat, e.latlng.lng);
      },
    });

    return (
      <Marker
        draggable
        position={pos}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const latLng = marker.getLatLng();
            setPos(latLng);
            onDragEnd(latLng.lat, latLng.lng);
          },
        }}
      />
    );
  };

  const center = { lat: origin.lat || 6.5, lng: origin.lng || 5.5 };

  return (
    <div ref={wrapperRef} className="space-y-4">
      {/* Origin Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pickup Location"
          value={originInput}
          onChange={(e) => setOriginInput(e.target.value)}
          className="border border-[#629FAD] p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#296374]"
        />
        {originSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
            {originSuggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setOriginInput(s.display_name);
                  setOriginSuggestions([]);
                  onOriginChange(parseFloat(s.lat), parseFloat(s.lon), s.display_name);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-[#296374] hover:text-white rounded-lg"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Delivery Location"
          value={destInput}
          onChange={(e) => setDestInput(e.target.value)}
          className="border border-[#629FAD] p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#296374]"
        />
        {destSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-52 overflow-y-auto z-50 shadow-lg">
            {destSuggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setDestInput(s.display_name);
                  setDestSuggestions([]);
                  onDestinationChange(parseFloat(s.lat), parseFloat(s.lon), s.display_name);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-[#296374] hover:text-white rounded-lg"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom
        style={{ height: "350px", width: "100%", borderRadius: "1rem" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {origin.lat && origin.lng && (
          <DraggableMarker
            position={{ lat: origin.lat, lng: origin.lng }}
            onDragEnd={(lat, lng) => onOriginChange(lat, lng, origin.address)}
          />
        )}
        {destination.lat && destination.lng && (
          <DraggableMarker
            position={{ lat: destination.lat, lng: destination.lng }}
            onDragEnd={(lat, lng) => onDestinationChange(lat, lng, destination.address)}
          />
        )}
      </MapContainer>
    </div>
  );
};

/* ------------------- ADD PACKAGE FORM ------------------- */
const AddPackageForm = () => {
  const [formData, setFormData] = useState({
    packageType: "",
    senderName: "",
    senderAddress: "",
    receiverName: "",
    receiverAddress: "",
    receiverPhone: "",
    receiverEmail: "",
    shipmentWeight: "",
    shipmentType: "",
    dateShipped: "",
    status: "Processing",
    progress: 0,
    location: {
      origin: { lat: null as number | null, lng: null as number | null, address: "" },
      destination: { lat: null as number | null, lng: null as number | null, address: "" },
      current: { lat: null as number | null, lng: null as number | null, address: "" },
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trackingId = uuidv4();
    try {
      await addDoc(collection(db, "packages"), {
        ...formData,
        trackingId,
        createdAt: new Date(),
        location: {
          ...formData.location,
          updatedAt: new Date(),
        },
      });
      alert(`Package added! Tracking ID: ${trackingId}`);
      setFormData({
        packageType: "",
        senderName: "",
        senderAddress: "",
        receiverName: "",
        receiverAddress: "",
        receiverPhone: "",
        receiverEmail: "",
        shipmentWeight: "",
        shipmentType: "",
        dateShipped: "",
        status: "Processing",
        progress: 0,
        location: {
          origin: { lat: null, lng: null, address: "" },
          destination: { lat: null, lng: null, address: "" },
          current: { lat: null, lng: null, address: "" },
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add package.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#0C2C55] mb-6">Add New Package</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Text Inputs */}
        {Object.entries(formData).map(([key, value]) => {
          if (key === "status" || key === "location") return null;
          return (
            <input
              key={key}
              type={key === "progress" ? "number" : key === "dateShipped" ? "date" : "text"}
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={value as any}
              onChange={handleInputChange}
              className="border border-[#629FAD] p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#296374] placeholder:text-[#0C2C55] placeholder:opacity-70 shadow-sm transition-all duration-200 hover:shadow-md"
            />
          );
        })}

        {/* Status Selector */}
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="border border-[#629FAD] p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#296374] shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <option value="Processing">Processing</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>

        {/* Address Map Picker */}
        <div className="col-span-full mt-6">
          <AddressMapPicker
            origin={formData.location.origin}
            destination={formData.location.destination}
            onOriginChange={(lat, lng, address) =>
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  origin: { lat, lng, address },
                  current: { lat, lng, address },
                  destination: prev.location.destination,
                },
              }))
            }
            onDestinationChange={(lat, lng, address) =>
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  destination: { lat, lng, address },
                  origin: prev.location.origin,
                  current: prev.location.current,
                },
              }))
            }
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="col-span-full bg-[#296374] text-white py-3 rounded-xl hover:bg-[#0C2C55] transition duration-300 font-semibold shadow-lg hover:shadow-xl mt-6"
        >
          Add Package
        </button>
      </form>
    </div>
  );
};

/* ------------------- ANALYTICS CARDS ------------------- */
const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    inTransit: 0,
    delivered: 0,
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "packages"), (snap) => {
      const packages = snap.docs.map((doc) => doc.data());
      setStats({
        totalPackages: packages.length,
        inTransit: packages.filter((p: any) => p.status === "In Transit").length,
        delivered: packages.filter((p: any) => p.status === "Delivered").length,
      });
    });
    return () => unsub();
  }, []);

  const cards = [
    { title: "Total Packages", value: stats.totalPackages, icon: <FiPackage size={24} /> },
    { title: "In Transit", value: stats.inTransit, icon: <FiTruck size={24} /> },
    { title: "Delivered", value: stats.delivered, icon: <FiCheckCircle size={24} /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((item, i) => (
        <div
          key={i}
          className="bg-gradient-to-r from-[#0C2C55] to-[#296374] text-white rounded-3xl shadow-xl p-6 flex items-center gap-4 hover:scale-105 transform transition duration-300"
        >
          <div className="p-3 bg-white rounded-full text-[#296374]">{item.icon}</div>
          <div>
            <p className="text-sm opacity-80">{item.title}</p>
            <p className="text-2xl sm:text-3xl font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------- RECENT ACTIVITY ------------------- */
const RecentActivity = () => {
  const [recentPackages, setRecentPackages] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "packages"), (snap) => {
      const packages = snap.docs.map((doc) => doc.data()).slice(0, 5);
      setRecentPackages(packages);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6">
      <h3 className="text-lg font-bold text-[#0C2C55] mb-4 flex items-center gap-2">
        <FiActivity /> Recent Packages
      </h3>
      <ul className="divide-y divide-gray-200">
        {recentPackages.map((pkg, index) => (
          <li key={index} className="flex justify-between items-center py-2">
            <span className="font-medium text-sm sm:text-base">{pkg.trackingId}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                pkg.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : pkg.status === "In Transit"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {pkg.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------- SECURITY SECTION ------------------- */
const SecuritySection = () => {
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Not logged in.");
      await updatePassword(user, newPassword);
      alert("Password updated successfully.");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to update password.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6">
      <h3 className="text-lg font-bold text-[#0C2C55] mb-4">Security</h3>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border border-[#629FAD] p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#296374] placeholder:text-[#0C2C55] placeholder:opacity-70 shadow-sm hover:shadow-md transition duration-200"
      />
      <button
        onClick={handleChangePassword}
        className="w-full bg-[#296374] text-white py-2 rounded-xl hover:bg-[#0C2C55] transition duration-300 font-semibold shadow-lg hover:shadow-xl"
      >
        Update Password
      </button>
    </div>
  );
};

/* ------------------- DASHBOARD ------------------- */
const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9F9F9]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0C2C55] text-white flex flex-col p-4 md:p-6 space-y-4 md:space-y-6">
        <h2 className="text-2xl font-bold">Shipping Admin</h2>
        <nav className="flex flex-col space-y-2 md:space-y-3">
          <button className="text-left px-3 py-2 rounded-xl bg-[#296374] w-full font-semibold shadow hover:shadow-lg transition">
            Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/packages")}
            className="text-left px-3 py-2 rounded-xl hover:bg-[#296374] w-full font-semibold shadow hover:shadow-lg transition"
          >
            Packages
          </button>
          <button className="text-left px-3 py-2 rounded-xl hover:bg-[#296374] w-full font-semibold shadow hover:shadow-lg transition">
            Analytics
          </button>
          <button className="text-left px-3 py-2 rounded-xl hover:bg-[#296374] w-full font-semibold shadow hover:shadow-lg transition">
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0C2C55]">Admin Dashboard</h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-[#296374] font-medium text-sm sm:text-base">Welcome, Admin</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#629FAD]" />
          </div>
        </div>

        {/* Analytics */}
        <AdminAnalytics />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <AddPackageForm />
            <RecentActivity />
          </div>

          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-[#0C2C55] mb-2">Quick Actions</h3>
              <button
                onClick={() => router.push("/admin/packages")}
                className="w-full py-2 bg-[#296374] text-white rounded-xl hover:bg-[#0C2C55] transition duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                View All Packages
              </button>
              <button className="w-full py-2 bg-[#629FAD] text-white rounded-xl hover:bg-[#296374] transition duration-300 font-semibold shadow-lg hover:shadow-xl">
                Export Reports
              </button>
            </div>

            <SecuritySection />
          </div>
        </div>
      </main>
    </div>
  );
};

/* ------------------- AUTH GUARD ------------------- */
const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });

    return () => unsubscribe();
  }, [router]);

  return <AdminDashboard />;
};

export default AdminPage;
