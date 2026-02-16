"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FiTruck, FiCheckCircle } from "react-icons/fi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATUS_STEPS = ["Processing", "In Transit", "Delivered"];

const TrackPackagePage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    setError("");
    setPackageDetails(null);
    setNetworkError(false);

    if (!trackingId.trim()) {
      setError("Please enter a tracking ID.");
      return;
    }

    setSearching(true);

    const q = query(
      collection(db, "packages"),
      where("trackingId", "==", trackingId.trim())
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setSearching(false);
        if (!snapshot.empty) {
          setPackageDetails(snapshot.docs[0].data());
        } else {
          setError("No package found with this Tracking ID.");
          setPackageDetails(null);
        }
      },
      (err) => {
        console.error(err);
        setSearching(false);
        setNetworkError(true);
      }
    );

    return () => unsubscribe();
  };

  const getTruckPosition = () => {
    if (!packageDetails) return 0;
    const index = STATUS_STEPS.indexOf(packageDetails.status);
    return (index / (STATUS_STEPS.length - 1)) * 100;
  };

  const location = packageDetails?.location;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-[#0C2C55] mb-12">
        Track Your Package
      </h1>

      {/* Tracking Input */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl mb-10">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border border-[#629FAD] p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#296374] placeholder:text-[#0C2C55] placeholder:opacity-70 shadow-sm hover:shadow-md transition duration-200"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !trackingId.trim()}
          className={`w-full py-3 rounded-xl font-semibold text-white transition duration-300 ${
            trackingId.trim()
              ? "bg-[#296374] hover:bg-[#0C2C55] shadow-lg hover:shadow-xl"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {searching ? "Tracking..." : "Track Package"}
        </button>
        {(error || networkError) && (
          <p className="text-red-600 mt-3 text-center font-medium">
            {networkError
              ? "Poor internet connection. Unable to reach the server."
              : error}
          </p>
        )}
      </div>

      {/* Notification and Register Button */}
      {packageDetails && (
        <>
          <div className="max-w-md mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Notice</p>
            <p>This package has not been registered yet.</p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/payment")}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
            >
              Register Package
            </button>
          </div>
        </>
      )}

      {/* Package Details */}
      {packageDetails && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-10">
          <h2 className="text-2xl font-bold text-[#0C2C55] mb-6">
            Package Details
          </h2>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#0C2C55]">
            <p>
              <strong>Package Type:</strong> {packageDetails.packageType}
            </p>
            <p>
              <strong>Date Shipped:</strong>{" "}
              {packageDetails.dateShipped
                ? new Date(
                    packageDetails.dateShipped.seconds * 1000
                  ).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Sender:</strong> {packageDetails.senderName} (
              {packageDetails.senderAddress})
            </p>
            <p>
              <strong>Receiver:</strong> {packageDetails.receiverName} (
              {packageDetails.receiverAddress})
            </p>
            <p>
              <strong>Receiver Phone:</strong>{" "}
              {packageDetails.receiverPhone}
            </p>
            <p>
              <strong>Receiver Email:</strong>{" "}
              {packageDetails.receiverEmail}
            </p>
            <p>
              <strong>Shipment Weight:</strong>{" "}
              {packageDetails.shipmentWeight}
            </p>
            <p>
              <strong>Shipment Type:</strong>{" "}
              {packageDetails.shipmentType}
            </p>
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {packageDetails.estimatedDelivery || "N/A"}
            </p>
            <p>
              <strong>Current Location:</strong>{" "}
              {location?.current?.address || "Not available"}
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative flex flex-col items-center sm:items-start mt-8">
            <div className="absolute left-5 sm:left-6 top-8 w-1 h-full bg-gray-300 rounded"></div>

            <div
              className="absolute left-0 sm:left-0 -translate-x-1/2 transition-all duration-1000"
              style={{ top: `${getTruckPosition()}%` }}
            >
              <FiTruck className="text-[#296374] w-8 h-8 animate-bounce" />
            </div>

            <div className="flex flex-col space-y-12 z-10">
              {STATUS_STEPS.map((step, idx) => {
                const stepIndex = STATUS_STEPS.indexOf(packageDetails.status);
                const completed = idx < stepIndex;
                const current = idx === stepIndex;
                const bgColor = completed
                  ? "bg-green-500"
                  : current
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300";
                return (
                  <div key={idx} className="flex items-center gap-4 relative">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${bgColor} border-white shadow-lg`}
                    >
                      {completed && (
                        <FiCheckCircle className="text-white w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold ${
                          completed
                            ? "text-green-700"
                            : current
                            ? "text-blue-700"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                      {current && (
                        <span className="text-sm text-gray-600">
                          Your package is here
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-10">
            <strong className="text-[#0C2C55]">Progress:</strong>
            <div className="w-full bg-gray-200 rounded-full h-5 mt-2 shadow-inner">
              <div
                className={`h-5 rounded-full transition-all duration-700 ${
                  packageDetails.progress === 100
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${packageDetails.progress}%` }}
              />
            </div>
            <p className="text-sm mt-1 text-[#0C2C55] font-medium">
              {packageDetails.progress}%
            </p>
          </div>

          {/* ROUTE MAP */}
          {location?.origin?.lat &&
            location?.destination?.lat && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-[#0C2C55] mb-4">
                  Package Delivery Route
                </h3>

                <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg">
                  <MapContainer
                    center={[
                      location.current?.lat || location.origin.lat,
                      location.current?.lng || location.origin.lng,
                    ]}
                    zoom={6}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Route Line */}
                    <Polyline
                      positions={[
                        [location.origin.lat, location.origin.lng],
                        [
                          location.destination.lat,
                          location.destination.lng,
                        ],
                      ]}
                    />

                    {/* Origin Marker */}
                    <Marker
                      position={[
                        location.origin.lat,
                        location.origin.lng,
                      ]}
                    >
                      <Popup>
                        <strong>Shipped From</strong>
                        <br />
                        {location.origin.address || "Origin"}
                      </Popup>
                    </Marker>

                    {/* Current Location Marker */}
                    {location.current?.lat && (
                      <Marker
                        position={[
                          location.current.lat,
                          location.current.lng,
                        ]}
                      >
                        <Popup>
                          <strong>Current Location</strong>
                          <br />
                          {location.current.address || "In transit"}
                        </Popup>
                      </Marker>
                    )}

                    {/* Destination Marker */}
                    <Marker
                      position={[
                        location.destination.lat,
                        location.destination.lng,
                      ]}
                    >
                      <Popup>
                        <strong>Final Destination</strong>
                        <br />
                        {location.destination.address || "Destination"}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TrackPackagePage;












// when  the details are displayed make make it a display a static area on top showing that the package is not registered 
// and add a register button at the botton of the page

// "use client";

// import React, { useState } from "react";
// import { db } from "../../firebaseConfig";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { FiTruck, FiCheckCircle } from "react-icons/fi";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
// } from "react-leaflet";
// import L from "leaflet";

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const STATUS_STEPS = ["Processing", "In Transit", "Delivered"];

// const TrackPackagePage = () => {
//   const [trackingId, setTrackingId] = useState("");
//   const [packageDetails, setPackageDetails] = useState<any>(null);
//   const [error, setError] = useState("");
//   const [searching, setSearching] = useState(false);
//   const [networkError, setNetworkError] = useState(false);

//   const handleSearch = () => {
//     setError("");
//     setPackageDetails(null);
//     setNetworkError(false);

//     if (!trackingId.trim()) {
//       setError("Please enter a tracking ID.");
//       return;
//     }

//     setSearching(true);

//     const q = query(
//       collection(db, "packages"),
//       where("trackingId", "==", trackingId.trim())
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         setSearching(false);
//         if (!snapshot.empty) {
//           setPackageDetails(snapshot.docs[0].data());
//         } else {
//           setError("No package found with this Tracking ID.");
//           setPackageDetails(null);
//         }
//       },
//       (err) => {
//         console.error(err);
//         setSearching(false);
//         setNetworkError(true);
//       }
//     );

//     return () => unsubscribe();
//   };

//   const getTruckPosition = () => {
//     if (!packageDetails) return 0;
//     const index = STATUS_STEPS.indexOf(packageDetails.status);
//     return (index / (STATUS_STEPS.length - 1)) * 100;
//   };

//   const location = packageDetails?.location;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold text-center text-[#0C2C55] mb-12">
//         Track Your Package
//       </h1>

//       {/* Tracking Input */}
//       <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl mb-10">
//         <input
//           type="text"
//           placeholder="Enter Tracking ID"
//           value={trackingId}
//           onChange={(e) => setTrackingId(e.target.value)}
//           className="border border-[#629FAD] p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#296374] placeholder:text-[#0C2C55] placeholder:opacity-70 shadow-sm hover:shadow-md transition duration-200"
//         />
//         <button
//           onClick={handleSearch}
//           disabled={searching || !trackingId.trim()}
//           className={`w-full py-3 rounded-xl font-semibold text-white transition duration-300 ${
//             trackingId.trim()
//               ? "bg-[#296374] hover:bg-[#0C2C55] shadow-lg hover:shadow-xl"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {searching ? "Tracking..." : "Track Package"}
//         </button>
//         {(error || networkError) && (
//           <p className="text-red-600 mt-3 text-center font-medium">
//             {networkError
//               ? "Poor internet connection. Unable to reach the server."
//               : error}
//           </p>
//         )}
//       </div>

//       {/* Package Details */}
//       {packageDetails && (
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-10">
//           <h2 className="text-2xl font-bold text-[#0C2C55] mb-6">
//             Package Details
//           </h2>

//           {/* Info Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#0C2C55]">
//             <p>
//               <strong>Package Type:</strong> {packageDetails.packageType}
//             </p>
//             <p>
//               <strong>Date Shipped:</strong>{" "}
//               {packageDetails.dateShipped
//                 ? new Date(
//                     packageDetails.dateShipped.seconds * 1000
//                   ).toLocaleDateString()
//                 : "N/A"}
//             </p>
//             <p>
//               <strong>Sender:</strong> {packageDetails.senderName} (
//               {packageDetails.senderAddress})
//             </p>
//             <p>
//               <strong>Receiver:</strong> {packageDetails.receiverName} (
//               {packageDetails.receiverAddress})
//             </p>
//             <p>
//               <strong>Receiver Phone:</strong>{" "}
//               {packageDetails.receiverPhone}
//             </p>
//             <p>
//               <strong>Receiver Email:</strong>{" "}
//               {packageDetails.receiverEmail}
//             </p>
//             <p>
//               <strong>Shipment Weight:</strong>{" "}
//               {packageDetails.shipmentWeight}
//             </p>
//             <p>
//               <strong>Shipment Type:</strong>{" "}
//               {packageDetails.shipmentType}
//             </p>
//             <p>
//               <strong>Estimated Delivery:</strong>{" "}
//               {packageDetails.estimatedDelivery || "N/A"}
//             </p>
//             <p>
//               <strong>Current Location:</strong>{" "}
//               {location?.current?.address || "Not available"}
//             </p>
//           </div>

//           {/* Vertical Timeline */}
//           <div className="relative flex flex-col items-center sm:items-start mt-8">
//             <div className="absolute left-5 sm:left-6 top-8 w-1 h-full bg-gray-300 rounded"></div>

//             <div
//               className="absolute left-0 sm:left-0 -translate-x-1/2 transition-all duration-1000"
//               style={{ top: `${getTruckPosition()}%` }}
//             >
//               <FiTruck className="text-[#296374] w-8 h-8 animate-bounce" />
//             </div>

//             <div className="flex flex-col space-y-12 z-10">
//               {STATUS_STEPS.map((step, idx) => {
//                 const stepIndex = STATUS_STEPS.indexOf(packageDetails.status);
//                 const completed = idx < stepIndex;
//                 const current = idx === stepIndex;
//                 const bgColor = completed
//                   ? "bg-green-500"
//                   : current
//                   ? "bg-blue-500 animate-pulse"
//                   : "bg-gray-300";
//                 return (
//                   <div key={idx} className="flex items-center gap-4 relative">
//                     <div
//                       className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${bgColor} border-white shadow-lg`}
//                     >
//                       {completed && (
//                         <FiCheckCircle className="text-white w-5 h-5" />
//                       )}
//                     </div>
//                     <div className="flex flex-col">
//                       <span
//                         className={`font-semibold ${
//                           completed
//                             ? "text-green-700"
//                             : current
//                             ? "text-blue-700"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {step}
//                       </span>
//                       {current && (
//                         <span className="text-sm text-gray-600">
//                           Your package is here
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mt-10">
//             <strong className="text-[#0C2C55]">Progress:</strong>
//             <div className="w-full bg-gray-200 rounded-full h-5 mt-2 shadow-inner">
//               <div
//                 className={`h-5 rounded-full transition-all duration-700 ${
//                   packageDetails.progress === 100
//                     ? "bg-green-500"
//                     : "bg-blue-500"
//                 }`}
//                 style={{ width: `${packageDetails.progress}%` }}
//               />
//             </div>
//             <p className="text-sm mt-1 text-[#0C2C55] font-medium">
//               {packageDetails.progress}%
//             </p>
//           </div>

//           {/* ROUTE MAP */}
//           {location?.origin?.lat &&
//             location?.destination?.lat && (
//               <div className="mt-12">
//                 <h3 className="text-xl font-bold text-[#0C2C55] mb-4">
//                   Package Delivery Route
//                 </h3>

//                 <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg">
//                   <MapContainer
//                     center={[
//                       location.current?.lat || location.origin.lat,
//                       location.current?.lng || location.origin.lng,
//                     ]}
//                     zoom={6}
//                     scrollWheelZoom={false}
//                     className="w-full h-full"
//                   >
//                     <TileLayer
//                       attribution="&copy; OpenStreetMap contributors"
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />

//                     {/* Route Line */}
//                     <Polyline
//                       positions={[
//                         [location.origin.lat, location.origin.lng],
//                         [
//                           location.destination.lat,
//                           location.destination.lng,
//                         ],
//                       ]}
//                     />

//                     {/* Origin Marker */}
//                     <Marker
//                       position={[
//                         location.origin.lat,
//                         location.origin.lng,
//                       ]}
//                     >
//                       <Popup>
//                         <strong>Shipped From</strong>
//                         <br />
//                         {location.origin.address || "Origin"}
//                       </Popup>
//                     </Marker>

//                     {/* Current Location Marker */}
//                     {location.current?.lat && (
//                       <Marker
//                         position={[
//                           location.current.lat,
//                           location.current.lng,
//                         ]}
//                       >
//                         <Popup>
//                           <strong>Current Location</strong>
//                           <br />
//                           {location.current.address || "In transit"}
//                         </Popup>
//                       </Marker>
//                     )}

//                     {/* Destination Marker */}
//                     <Marker
//                       position={[
//                         location.destination.lat,
//                         location.destination.lng,
//                       ]}
//                     >
//                       <Popup>
//                         <strong>Final Destination</strong>
//                         <br />
//                         {location.destination.address || "Destination"}
//                       </Popup>
//                     </Marker>
//                   </MapContainer>
//                 </div>
//               </div>
//             )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackPackagePage;
