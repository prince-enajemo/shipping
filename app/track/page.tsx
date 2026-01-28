"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";

type PackageType = {
  trackingId: string;
  packageType: string;
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;
  shipmentWeight: string;
  shipmentType: string;
  dateShipped: string;
  status: string;
  progress: number;
};

const TrackPackagePage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPackage = async () => {
    setLoading(true);
    setError("");
    setPkg(null);
    try {
      const q = query(
        collection(db, "packages"),
        where("trackingId", "==", trackingId)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setError("No package found with this tracking ID.");
      } else {
        setPkg(snapshot.docs[0].data() as PackageType);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch package.");
    }
    setLoading(false);
  };

  const printPackage = () => window.print();

  const downloadPDF = () => {
    if (!pkg) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Package Details", 20, 20);
    let y = 30;
    Object.entries(pkg).forEach(([key, value]) => {
      doc.setFontSize(12);
      doc.text(`${key.replace(/([A-Z])/g, " $1")}: ${value}`, 20, y);
      y += 10;
    });
    doc.save(`Package-${pkg.trackingId}.pdf`);
  };

  // Status Steps
  const steps = ["Processing", "In Transit", "Delivered"];
  const currentStepIndex = pkg ? steps.indexOf(pkg.status) : 0;

  return (
    <div className="min-h-screen bg-[#EDEDCE] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#0C2C55] mb-6">Track Your Package</h1>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border border-[#629FAD] p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#296374] mb-4"
        />
        <button
          onClick={fetchPackage}
          className="w-full bg-[#296374] text-white py-3 rounded-xl hover:bg-[#0C2C55] transition"
        >
          Track Package
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-[#296374] font-medium">Loading...</p>}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Package Details */}
      {pkg && (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold text-[#0C2C55] mb-4">Package Details</h2>

          {/* Status Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index <= currentStepIndex ? "bg-[#296374]" : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm mt-2 text-gray-700">{step}</span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mt-2 ${
                      index < currentStepIndex ? "bg-[#296374]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pkg).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm text-gray-500">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-[#296374] font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={printPackage}
              className="flex-1 bg-[#629FAD] text-white py-2 rounded-xl hover:bg-[#296374] transition"
            >
              Print Package
            </button>
            <button
              onClick={downloadPDF}
              className="flex-1 bg-[#296374] text-white py-2 rounded-xl hover:bg-[#0C2C55] transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackPackagePage;
