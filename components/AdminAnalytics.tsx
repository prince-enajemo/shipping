// "use client";

// import React, { useEffect, useState } from "react";
// import { db } from "../firebaseConfig";
// import { collection, onSnapshot } from "firebase/firestore";

// const AdminAnalytics = () => {
//   const [stats, setStats] = useState({
//     totalPackages: 0,
//     inTransit: 0,
//     delivered: 0,
//     newUsers: 0,
//   });

//   useEffect(() => {
//     // Real-time listener for packages
//     const packagesUnsub = onSnapshot(collection(db, "packages"), (snapshot) => {
//       const packagesData = snapshot.docs.map((doc) => doc.data());
//       const totalPackages = packagesData.length;
//       const inTransit = packagesData.filter((p: any) => p.status === "In Transit")
//         .length;
//       const delivered = packagesData.filter((p: any) => p.status === "Delivered")
//         .length;

//       setStats((prev) => ({ ...prev, totalPackages, inTransit, delivered }));
//     });

//     // Real-time listener for users
//     const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
//       const today = new Date();
//       const newUsers = snapshot.docs.filter((doc) => {
//         const data = doc.data();
//         // Firestore Timestamp
//         const createdAt = data.createdAt?.toDate
//           ? data.createdAt.toDate()
//           : new Date(data.createdAt);
//         return createdAt.toDateString() === today.toDateString();
//       }).length;

//       setStats((prev) => ({ ...prev, newUsers }));
//     });

//     // Cleanup listeners on unmount
//     return () => {
//       packagesUnsub();
//       usersUnsub();
//     };
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

// export default AdminAnalytics;
