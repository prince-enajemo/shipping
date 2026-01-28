// "use client";

// import React, { useState } from "react";
// import { db } from "../firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

// const AddPackage = () => {
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

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
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
//       alert("Package added successfully with Tracking ID: " + trackingId);
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
//       console.error("Error adding package: ", error);
//       alert("Failed to add package. Try again.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-6 rounded shadow-md mb-10"
//     >
//       <h2 className="text-2xl font-bold mb-6">Add Package</h2>
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

// export default AddPackage;
