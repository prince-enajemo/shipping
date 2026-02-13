"use client";

import React from "react";

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-12">
        Payment Page
      </h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl">
        <p className="text-center text-lg text-gray-700 mb-6">
          Payment functionality will be implemented here.
        </p>
        <button
          className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;