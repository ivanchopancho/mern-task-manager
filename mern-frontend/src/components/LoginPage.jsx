import React, { use } from "react";
import { useState } from "react";

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isSignup, setIsSignup] = useState(false);


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const endpoint = isSignup ? "register" : "login";
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || `${isSignup ? "Signup" : "Login"} failed`);
    }

    const data = await res.json();

    // Save token and update app state only if logging in or after signup
    localStorage.setItem("token", data.token);
    setToken(data.token);

  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>

        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;