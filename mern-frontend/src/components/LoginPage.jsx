import React from "react";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <div className="w-full max-w-sm bg-zinc-900 border boder-zinc-800 rounded-xl shadow-lg shadow-black/40 p-6">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 tracking-widest">
          Tasked!
        </h1>
        <h1 className="text-xl font-semibold text-zinc-100 mb-6 text-center tracking-wide">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            className="
            bg-zinc-800
            border border-zinc-700
            rounded-md
            px-3 py-2
            text-sm
            placeholder-zinc-500
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="
            bg-zinc-800
            border border-zinc-700
            rounded-md
            px-3 py-2
            text-sm
            placeholder-zinc-500
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500"
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
        <p className="text-center mt-4 text-sm text-zinc-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-indigo-400 hover:text-indigo-300 transition"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;