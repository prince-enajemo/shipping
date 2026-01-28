// "use client";

// import React, { useState, useEffect } from "react";
// import { db, auth } from "../firebaseConfig";
// import { collection, addDoc, onSnapshot } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";
// import { useRouter } from "next/navigation";

// const AddPackageForm = () => {
//   const [formData, setFormData] = useState({
//     packageType: "",
//     senderName: "",
//     senderAddress: "",
//     receiverName: "",
//     receiverAddress: "",
//     receiverPhone: "",
//     receiverEmail: "",
//     shipmentWeight: "",
//     shipmentType: "",
//     dateShipped: "",
//     status: "Processing",
//     progress: 0,
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const trackingId = uuidv4();

//     try {
//       await addDoc(collection(db, "packages"), {
//         ...formData,
//         trackingId,
//       });
//       alert("Package added successfully! Tracking ID: " + trackingId);
//       setFormData({
//         packageType: "",
//         senderName: "",
//         senderAddress: "",
//         receiverName: "",
//         receiverAddress: "",
//         receiverPhone: "",
//         receiverEmail: "",
//         shipmentWeight: "",
//         shipmentType: "",
//         dateShipped: "",
//         status: "Processing",
//         progress: 0,
//       });
//     } catch (error) {
//       console.error("Error adding package:", error);
//       alert("Failed to add package. Please try again.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input
//           type="text"
//           name="packageType"
//           placeholder="Package Type"
//           value={formData.packageType}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="senderName"
//           placeholder="Sender's Name"
//           value={formData.senderName}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="senderAddress"
//           placeholder="Sender's Address"
//           value={formData.senderAddress}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="receiverName"
//           placeholder="Receiver's Name"
//           value={formData.receiverName}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="receiverAddress"
//           placeholder="Receiver's Address"
//           value={formData.receiverAddress}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="receiverPhone"
//           placeholder="Receiver's Phone"
//           value={formData.receiverPhone}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="email"
//           name="receiverEmail"
//           placeholder="Receiver's Email"
//           value={formData.receiverEmail}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="shipmentWeight"
//           placeholder="Shipment Weight"
//           value={formData.shipmentWeight}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="shipmentType"
//           placeholder="Shipment Type"
//           value={formData.shipmentType}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           name="dateShipped"
//           value={formData.dateShipped}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//         <select
//           name="status"
//           value={formData.status}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         >
//           <option value="Processing">Processing</option>
//           <option value="In Transit">In Transit</option>
//           <option value="Delivered">Delivered</option>
//         </select>
//         <input
//           type="number"
//           name="progress"
//           placeholder="Progress (%)"
//           value={formData.progress}
//           onChange={handleInputChange}
//           className="border p-2 rounded"
//         />
//       </div>
//       <button
//         type="submit"
//         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Add Package
//       </button>
//     </form>
//   );
// };

// const AdminAnalytics = () => {
//   const [stats, setStats] = useState({
//     totalPackages: 0,
//     inTransit: 0,
//     delivered: 0,
//     newUsers: 0,
//   });

//   useEffect(() => {
//     const packagesUnsub = onSnapshot(collection(db, "packages"), (snapshot) => {
//       const packagesData = snapshot.docs.map((doc) => doc.data());
//       setStats({
//         totalPackages: packagesData.length,
//         inTransit: packagesData.filter((p) => p.status === "In Transit").length,
//         delivered: packagesData.filter((p) => p.status === "Delivered").length,
//         newUsers: stats.newUsers,
//       });
//     });

//     return () => packagesUnsub();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//       <div className="bg-white p-6 rounded shadow-md text-center">
//         <h3 className="font-semibold text-lg">Total Packages</h3>
//         <p className="text-2xl font-bold">{stats.totalPackages}</p>
//       </div>
//       <div className="bg-white p-6 rounded shadow-md text-center">
//         <h3 className="font-semibold text-lg">In Transit</h3>
//         <p className="text-2xl font-bold">{stats.inTransit}</p>
//       </div>
//       <div className="bg-white p-6 rounded shadow-md text-center">
//         <h3 className="font-semibold text-lg">Delivered</h3>
//         <p className="text-2xl font-bold">{stats.delivered}</p>
//       </div>
//       <div className="bg-white p-6 rounded shadow-md text-center">
//         <h3 className="font-semibold text-lg">New Users Today</h3>
//         <p className="text-2xl font-bold">{stats.newUsers}</p>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (!user) {
//         router.push("/login"); // Redirect to login if not authenticated
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
//       <AdminAnalytics />
//       <AddPackageForm />
//     </div>
//   );
// };

// export default AdminDashboard;
