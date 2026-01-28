"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

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
      });
      alert("Package added! Tracking ID: " + trackingId);
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
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add package.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-[#0C2C55] mb-6">
        Add New Package
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData).map(([key, value]) => {
          if (key === "status") return null;
          return (
            <input
              key={key}
              type={key === "progress" ? "number" : "text"}
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={value}
              onChange={handleInputChange}
              className="border border-[#629FAD] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#296374] placeholder:text-[#0C2C55] placeholder:opacity-70"
            />
          );
        })}

        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="border border-[#629FAD] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#296374]"
        >
          <option value="Processing">Processing</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>

        <button
          type="submit"
          className="col-span-full bg-[#296374] text-white py-3 rounded-xl hover:bg-[#0C2C55] transition"
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: "Total Packages", value: stats.totalPackages },
        { title: "In Transit", value: stats.inTransit },
        { title: "Delivered", value: stats.delivered },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-[#296374]"
        >
          <h3 className="text-sm text-gray-500">{item.title}</h3>
          <p className="text-3xl font-bold text-[#0C2C55]">{item.value}</p>
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
      const packages = snap.docs
        .map((doc) => doc.data())
        .slice(0, 5);
      setRecentPackages(packages);
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-[#0C2C55] mb-4">
        Recent Packages
      </h3>
      <ul className="space-y-3">
        {recentPackages.map((pkg, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b pb-2"
          >
            <span className="font-medium">{pkg.trackingId}</span>
            <span className="text-sm text-[#296374]">{pkg.status}</span>
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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-[#0C2C55] mb-4">Security</h3>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border border-[#629FAD] p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#296374] placeholder:text-[#0C2C55] placeholder:opacity-70"
      />
      <button
        onClick={handleChangePassword}
        className="w-full bg-[#296374] text-white py-2 rounded-xl hover:bg-[#0C2C55] transition"
      >
        Update Password
      </button>
    </div>
  );
};

/* ------------------- DASHBOARD LAYOUT ------------------- */
const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-[#EDEDCE]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0C2C55] text-white flex flex-col p-6 space-y-6">
        <h2 className="text-2xl font-bold">Shipping Admin</h2>
        <nav className="flex flex-col space-y-3">
          <button className="text-left px-4 py-2 rounded-xl bg-[#296374]">
            Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/packages")}
            className="text-left px-4 py-2 rounded-xl hover:bg-[#296374]"
          >
            Packages
          </button>
          <button className="text-left px-4 py-2 rounded-xl hover:bg-[#296374]">
            Analytics
          </button>
          <button className="text-left px-4 py-2 rounded-xl hover:bg-[#296374]">
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#0C2C55]">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-[#296374] font-medium">
              Welcome, Admin
            </span>
            <div className="w-10 h-10 rounded-full bg-[#629FAD]" />
          </div>
        </div>

        {/* Analytics */}
        <AdminAnalytics />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <AddPackageForm />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-[#0C2C55] mb-4">
                Quick Actions
              </h3>
              <button
                onClick={() => router.push("/admin/packages")}
                className="w-full mb-3 bg-[#296374] text-white py-2 rounded-xl hover:bg-[#0C2C55]"
              >
                View All Packages
              </button>
              <button className="w-full bg-[#629FAD] text-white py-2 rounded-xl hover:bg-[#296374]">
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
