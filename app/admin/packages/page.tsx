"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import MapPicker from "@/components/MapPicker";

// 🎨 Brand Colors
const COLORS = {
  primary: "#0C2C55",
  secondary: "#296374",
  accent: "#629FAD",
  background: "#EDEDCE",
};

type LocationPoint = {
  lat: number | null;
  lng: number | null;
  address?: string;
};

type PackageType = {
  id: string;
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
  autoMove?: boolean;
  timeToComplete?: number; // in minutes
  location?: {
    origin?: LocationPoint;
    current?: LocationPoint;
    destination?: LocationPoint;
    updatedAt?: any;
  };
};

const AdminPackagesPage = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PackageType>>({});

  // 🔄 Real-time fetch
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "packages"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PackageType, "id">),
      }));
      setPackages(data);
    });

    return () => unsub();
  }, []);

  // 📍 Automatic movement logic
  const startAutoMovement = async (pkg: PackageType) => {
    if (
      !pkg.autoMove ||
      !pkg.timeToComplete ||
      !pkg.location?.origin?.lat ||
      !pkg.location?.destination?.lat
    )
      return;

    const totalTimeMs = pkg.timeToComplete * 60 * 1000;
    const startTime = Date.now();

    const interval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      let fraction = elapsed / totalTimeMs;
      if (fraction >= 1) fraction = 1;

      const newPos = {
        lat:
          pkg.location!.origin!.lat! +
          (pkg.location!.destination!.lat! - pkg.location!.origin!.lat!) *
            fraction,
        lng:
          pkg.location!.origin!.lng! +
          (pkg.location!.destination!.lng! - pkg.location!.origin!.lng!) *
            fraction,
        address: `In transit (${Math.round(fraction * 100)}%)`,
      };

      await updateDoc(doc(db, "packages", pkg.id), {
        location: {
          ...pkg.location,
          current: newPos,
          updatedAt: new Date(),
        },
        progress: Math.round(fraction * 100),
        status: fraction === 1 ? "Delivered" : "In Transit",
      });

      if (fraction === 1) clearInterval(interval);
    }, 5000); // update every 5 seconds
  };

  const startEdit = (pkg: PackageType) => {
    setEditingId(pkg.id);
    setEditData(pkg);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;

    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveChanges = async (id: string) => {
    try {
      const { trackingId, id: _, ...dataToUpdate } = editData;
      await updateDoc(doc(db, "packages", id), {
        ...dataToUpdate,
        location: {
          ...editData.location,
          updatedAt: new Date(),
        },
      });

      // Start auto movement if enabled
      const pkg = { id, ...dataToUpdate } as PackageType;
      startAutoMovement(pkg);

      setEditingId(null);
      alert("Package updated successfully!");
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Failed to update package.");
    }
  };

  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await deleteDoc(doc(db, "packages", id));
      alert("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package.");
    }
  };

  // Fix for rendering pkg[key]
  const renderPackageValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2); // Convert objects to a readable string
    }
    return value?.toString() || "N/A"; // Convert other values to string or show "N/A"
  };

  // Refine the handleLocationUpdate function to ensure compatibility
  const handleLocationUpdate = (prev: Partial<PackageType>) => {
    const updatedLocation = {
      ...prev.location,
      current: {
        address: prev.location?.current?.address || "Updated Address",
        lat: prev.location?.current?.lat ?? null, // Ensure lat is not undefined
        lng: prev.location?.current?.lng ?? null, // Ensure lng is not undefined
      },
      origin: prev.location?.origin || null,
      destination: prev.location?.destination || null,
    };

    return {
      ...prev,
      location: updatedLocation,
    };
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            Packages Management
          </h1>
          <p className="text-sm text-gray-600">
            View, update, and manage all shipments in real time.
          </p>
        </div>
        <span
          className="px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: COLORS.secondary, color: "white" }}
        >
          Total Packages: {packages.length}
        </span>
      </div>

      {/* Packages Grid */}
      <div className="space-y-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-xl p-6 border-l-8"
            style={{ borderColor: COLORS.secondary }}
          >
            {/* Card Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
                  Tracking ID
                </h2>
                <p className="text-sm font-mono" style={{ color: COLORS.secondary }}>
                  {pkg.trackingId}
                </p>
              </div>

              <div className="flex gap-2">
                {editingId === pkg.id ? (
                  <>
                    <button
                      onClick={() => saveChanges(pkg.id)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                      style={{ backgroundColor: COLORS.secondary }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(pkg)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                      style={{ backgroundColor: COLORS.accent }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePackage(pkg.id)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(
                [
                  ["packageType", "Package Type"],
                  ["senderName", "Sender Name"],
                  ["senderAddress", "Sender Address"],
                  ["receiverName", "Receiver Name"],
                  ["receiverAddress", "Receiver Address"],
                  ["receiverPhone", "Receiver Phone"],
                  ["receiverEmail", "Receiver Email"],
                  ["shipmentWeight", "Shipment Weight"],
                  ["shipmentType", "Shipment Type"],
                  ["dateShipped", "Date Shipped"],
                ] as [keyof PackageType, string][]
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">
                    {label}
                  </label>
                  {editingId === pkg.id ? (
                    <input
                      type={key === "dateShipped" ? "date" : "text"}
                      name={key}
                      value={(editData[key] as string) || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2"
                      style={{
                        outlineColor: COLORS.secondary,
                        borderColor: COLORS.accent,
                      }}
                    />
                  ) : (
                    <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-3 py-2">
                      {renderPackageValue(pkg[key])}
                    </p>
                  )}
                </div>
              ))}

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">
                  Status
                </label>
                {editingId === pkg.id ? (
                  <select
                    name="status"
                    value={editData.status || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2"
                    style={{
                      outlineColor: COLORS.secondary,
                      borderColor: COLORS.accent,
                    }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        pkg.status === "Delivered"
                          ? "#D1FAE5"
                          : pkg.status === "In Transit"
                          ? "#DBEAFE"
                          : "#FEF3C7",
                      color:
                        pkg.status === "Delivered"
                          ? "#065F46"
                          : pkg.status === "In Transit"
                          ? "#1E40AF"
                          : "#92400E",
                    }}
                  >
                    {pkg.status}
                  </span>
                )}
              </div>

              {/* Progress */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">
                  Progress (%)
                </label>
                {editingId === pkg.id ? (
                  <input
                    type="number"
                    name="progress"
                    min={0}
                    max={100}
                    value={editData.progress || 0}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2"
                    style={{
                      outlineColor: COLORS.secondary,
                      borderColor: COLORS.accent,
                    }}
                  />
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${pkg.progress}%`,
                        backgroundColor: COLORS.secondary,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Auto Movement */}
              {editingId === pkg.id && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">
                      Enable Auto Movement
                    </label>
                    <input
                      type="checkbox"
                      name="autoMove"
                      checked={editData.autoMove || false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">
                      Time to Complete (minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      name="timeToComplete"
                      value={editData.timeToComplete || 10}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2"
                      style={{
                        outlineColor: COLORS.secondary,
                        borderColor: COLORS.accent,
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* 📍 Location Section */}
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
                Location Tracking
              </h3>

              {/* Origin (Read-only) */}
              {pkg.location?.origin && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Origin (Pickup Location)
                  </p>
                  <p className="text-sm text-gray-800 bg-gray-100 rounded-xl px-3 py-2">
                    {pkg.location.origin.address || "Origin location set"}
                  </p>
                </div>
              )}

              {/* Destination (Read-only) */}
              {pkg.location?.destination && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Destination (Delivery Location)
                  </p>
                  <p className="text-sm text-gray-800 bg-gray-100 rounded-xl px-3 py-2">
                    {pkg.location.destination.address || "Destination location set"}
                  </p>
                </div>
              )}

              {/* Current Location (Editable with Map) */}
              {editingId === pkg.id && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Update Current Location
                  </p>

                  <MapPicker
                    onLocationSelect={(lat, lng) => {
                      setEditData((prev) => handleLocationUpdate(prev));
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Current location description (optional)"
                    value={editData.location?.current?.address || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          current: {
                            ...prev.location?.current,
                            address: e.target.value,
                          },
                        },
                      }))
                    }
                    className="mt-3 w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2"
                    style={{
                      outlineColor: COLORS.secondary,
                      borderColor: COLORS.accent,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No packages found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPackagesPage;
