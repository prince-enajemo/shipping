// "use client";

// import React, { useState } from "react";
// import { db } from "../firebaseConfig";
// import { collection, getDocs, query, where } from "firebase/firestore";

// const TrackPackage = () => {
//   const [trackingId, setTrackingId] = useState("");
//   const [packageDetails, setPackageDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTrackingId(e.target.value);
//   };

//   const handleSearch = async () => {
//     if (!trackingId.trim()) return;

//     setLoading(true);
//     try {
//       const q = query(
//         collection(db, "packages"),
//         where("trackingId", "==", trackingId.trim())
//       );
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const data = querySnapshot.docs[0].data();
//         setPackageDetails(data);
//       } else {
//         alert("No package found with this Tracking ID.");
//         setPackageDetails(null);
//       }
//     } catch (error) {
//       console.error("Error fetching package details: ", error);
//       alert("An error occurred while searching. Please try again.");
//       setPackageDetails(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Track Your Package</h1>

//       {/* Input & Button */}
//       <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
//         <input
//           type="text"
//           placeholder="Enter Tracking ID"
//           value={trackingId}
//           onChange={handleInputChange}
//           className="border p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleSearch}
//           disabled={loading || !trackingId.trim()}
//           className={`w-full py-3 rounded font-semibold text-white transition ${
//             trackingId.trim()
//               ? "bg-blue-500 hover:bg-blue-600"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {loading ? "Searching..." : "Track Package"}
//         </button>
//       </div>

//       {/* Package Details */}
//       {packageDetails && (
//         <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow-md">
//           <h2 className="text-2xl font-bold mb-4">Package Details</h2>
          
//           <div className="space-y-2">
//             <p><strong>Package Type:</strong> {packageDetails.packageType}</p>
//             <p><strong>Sender Name:</strong> {packageDetails.senderName}</p>
//             <p><strong>Sender Address:</strong> {packageDetails.senderAddress}</p>
//             <p><strong>Receiver Name:</strong> {packageDetails.receiverName}</p>
//             <p><strong>Receiver Address:</strong> {packageDetails.receiverAddress}</p>
//             <p><strong>Receiver Phone:</strong> {packageDetails.receiverPhone}</p>
//             <p><strong>Receiver Email:</strong> {packageDetails.receiverEmail}</p>
//             <p><strong>Shipment Weight:</strong> {packageDetails.shipmentWeight}</p>
//             <p><strong>Shipment Type:</strong> {packageDetails.shipmentType}</p>
//             <p>
//               <strong>Date Shipped:</strong>{" "}
//               {packageDetails.dateShipped
//                 ? new Date(packageDetails.dateShipped).toLocaleDateString()
//                 : "N/A"}
//             </p>
//             <p><strong>Status:</strong> {packageDetails.status}</p>

//             {/* Progress Bar */}
//             <div>
//               <strong>Progress:</strong>
//               <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
//                 <div
//                   className={`h-4 rounded-full transition-all duration-500 ${
//                     packageDetails.progress === 100 ? "bg-green-500" : "bg-blue-500"
//                   }`}
//                   style={{ width: `${packageDetails.progress}%` }}
//                 />
//               </div>
//               <p className="text-sm mt-1">{packageDetails.progress}%</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackPackage;
