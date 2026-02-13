"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

/* Fix default marker icon */
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  address?: string; // Optional: typed address
  initialLat?: number;
  initialLng?: number;
  zoom?: number;
}

const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  address,
  initialLat = 6.5244,
  initialLng = 3.3792,
  zoom = 6,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    [initialLat, initialLng]
  );

  /* Click on map to set marker */
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  /* Move marker when address changes */
  useEffect(() => {
    if (!address) return;

    const fetchCoordinates = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
          setPosition(coords);
          onLocationSelect(coords[0], coords[1]);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };

    fetchCoordinates();
  }, [address, onLocationSelect]);

  return (
    <MapContainer
      center={position || [initialLat, initialLng]}
      zoom={zoom}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      {position && <Marker position={position}></Marker>}
    </MapContainer>
  );
};

export default MapPicker;
