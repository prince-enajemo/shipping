"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const TrackPackagePage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    setError("");
    setPackageDetails(null);

    if (!trackingId.trim()) {
      setError("Please enter a tracking ID.");
      return;
    }

    setSearching(true);

    // Create a real-time query for the tracking ID
    const q = query(
      collection(db, "packages"),
      where("trackingId", "==", trackingId.trim())
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setPackageDetails(snapshot.docs[0].data());
        } else {
          setError("No package found with this Tracking ID.");
          setPackageDetails(null);
        }
      },
      (err) => {
        console.error(err);
        setError("Failed to fetch package details.");
      }
    );

    // Cleanup subscription on unmount or when tracking ID changes
    return () => unsubscribe();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Track Your Package</h1>

      {/* Input */}
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mb-6">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !trackingId.trim()}
          className={`w-full py-3 rounded font-semibold text-white transition ${
            trackingId.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {searching ? "Tracking..." : "Track Package"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Package Details */}
      {packageDetails && (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Package Details</h2>
          <p><strong>Package Type:</strong> {packageDetails.packageType}</p>
          <p><strong>Sender:</strong> {packageDetails.senderName} ({packageDetails.senderAddress})</p>
          <p><strong>Receiver:</strong> {packageDetails.receiverName} ({packageDetails.receiverAddress})</p>
          <p><strong>Receiver Phone:</strong> {packageDetails.receiverPhone}</p>
          <p><strong>Receiver Email:</strong> {packageDetails.receiverEmail}</p>
          <p><strong>Shipment Weight:</strong> {packageDetails.shipmentWeight}</p>
          <p><strong>Shipment Type:</strong> {packageDetails.shipmentType}</p>
          <p><strong>Date Shipped:</strong>{" "}
            {packageDetails.dateShipped
              ? new Date(packageDetails.dateShipped.seconds * 1000).toLocaleDateString()
              : "N/A"}
          </p>
          <p><strong>Status:</strong> {packageDetails.status}</p>

          {/* Progress Bar */}
          <div className="mt-2">
            <strong>Progress:</strong>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  packageDetails.progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${packageDetails.progress}%` }}
              />
            </div>
            <p className="text-sm mt-1">{packageDetails.progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackPackagePage;
