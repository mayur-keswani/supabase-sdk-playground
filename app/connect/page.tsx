"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import getSupabaseClient from "../utils/supabase";
import { useNotification } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";

export default function ConnectPage() {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [loading, setLoading] = useState(false);
  const {updateSupabaseConnected} = useContext(AuthContext)!;
  const { notify } = useNotification();
  const router = useRouter();

  const handleInitialize = async () => {
   
    if(typeof window === undefined){
      return;
    }
    localStorage.clear();
    
    if (!!!supabaseAnonKey || !!!supabaseUrl) {
      notify("Please, provide Supabase Anon key and URL", "warning");
      return;
    }
    setLoading(true);

    try {
      getSupabaseClient(supabaseUrl, supabaseAnonKey);
      updateSupabaseConnected(true)
      notify("Supabase client initialized!", "success");
      router.push("/login"); // Redirect after successful connection
    } catch (err) {
      notify(
        "Invalid Supabase credentials. Please check and try again!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Connect to Supabase
        </h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Enter your Supabase credentials to continue
        </p>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">
            Supabase URL
          </label>
          <input
            type="text"
            placeholder="https://xyz.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">
            Supabase Anon Key
          </label>
          <input
            type="text"
            placeholder="Enter your Anon Key"
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          onClick={handleInitialize}
          disabled={loading}
          className={`w-full py-2 text-white font-medium rounded-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Connecting..." : "Connect with Supabase"}
        </button>
      </div>
    </div>
  );
}
