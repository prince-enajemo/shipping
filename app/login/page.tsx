"use client";

import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const email = "enajemoprince@gmail.com"; // hardcoded admin email
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError("Invalid password. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = "enajemoprince@gmail.com";
      await sendPasswordResetEmail(auth, email);
      alert("A password reset link has been sent to your email.");
    } catch (err) {
      setError("Failed to send reset email. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleForgotPassword}
          className="w-full mt-4 text-blue-500 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
