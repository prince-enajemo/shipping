// // app/admin/AddPackageForm.tsx
// "use client";

// import { useState } from "react";
// import { db } from "@/firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const trackingId = uuidv4();

//     try {
//       await addDoc(collection(db, "packages"), {
//         ...formData,
//         trackingId,
//       });
//       alert("Package added! Tracking ID: " + trackingId);
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
//     } catch (err) {
//       console.error(err);
//       alert("Error adding package");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
//       <h2 className="text-2xl font-bold mb-4">Add New Package</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input name="packageType" placeholder="Package Type" value={formData.packageType} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="senderName" placeholder="Sender Name" value={formData.senderName} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="senderAddress" placeholder="Sender Address" value={formData.senderAddress} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="receiverName" placeholder="Receiver Name" value={formData.receiverName} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="receiverAddress" placeholder="Receiver Address" value={formData.receiverAddress} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="receiverPhone" placeholder="Receiver Phone" value={formData.receiverPhone} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="receiverEmail" placeholder="Receiver Email" value={formData.receiverEmail} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="shipmentWeight" placeholder="Shipment Weight" value={formData.shipmentWeight} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="shipmentType" placeholder="Shipment Type" value={formData.shipmentType} onChange={handleChange} className="border p-2 rounded"/>
//         <input name="dateShipped" type="date" value={formData.dateShipped} onChange={handleChange} className="border p-2 rounded"/>
//         <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
//           <option>Processing</option>
//           <option>In Transit</option>
//           <option>Delivered</option>
//         </select>
//         <input name="progress" type="number" placeholder="Progress (%)" value={formData.progress} onChange={handleChange} className="border p-2 rounded"/>
//       </div>
//       <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Package</button>
//     </form>
//   );
// };

// export default AddPackageForm;
