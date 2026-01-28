// // app/admin/AdminAnalytics.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { db } from "@/firebaseConfig";
// import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

// const AdminAnalytics = () => {
//   const [totalPackages, setTotalPackages] = useState(0);
//   const [inTransit, setInTransit] = useState(0);
//   const [delivered, setDelivered] = useState(0);
//   const [newUsersToday, setNewUsersToday] = useState(0);

//   useEffect(() => {
//     const fetchStats = async () => {
//       const packageSnapshot = await getDocs(collection(db, "packages"));
//       setTotalPackages(packageSnapshot.size);
//       setInTransit(packageSnapshot.docs.filter((d) => d.data().status === "In Transit").length);
//       setDelivered(packageSnapshot.docs.filter((d) => d.data().status === "Delivered").length);

//       const usersSnapshot = await getDocs(collection(db, "users"));
//       const today = new Date();
//       setNewUsersToday(
//         usersSnapshot.docs.filter(
//           (u) => u.data().createdAt?.toDate()?.toDateString() === today.toDateString()
//         ).length
//       );
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
//       <div className="p-4 border rounded">
//         <p className="text-2xl font-bold">{totalPackages}</p>
//         <p>Total Packages</p>
//       </div>
//       <div className="p-4 border rounded">
//         <p className="text-2xl font-bold">{inTransit}</p>
//         <p>In Transit</p>
//       </div>
//       <div className="p-4 border rounded">
//         <p className="text-2xl font-bold">{delivered}</p>
//         <p>Delivered</p>
//       </div>
//       <div className="p-4 border rounded">
//         <p className="text-2xl font-bold">{newUsersToday}</p>
//         <p>New Users Today</p>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalytics;
