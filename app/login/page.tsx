"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import getSupabaseClient, { getSupabaseConfig } from "../utils/supabase";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>

        {/* Supabase Auth Component */}
        <Auth
          supabaseClient={getSupabaseClient()}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          redirectTo={getSupabaseConfig().supabaseUrl}
        />

        {/* Button to Connect Another Project */}
        <button
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
          onClick={() => router.push("/connect")}
        >
          Connect With Another Project
        </button>
      </div>
    </div>
  );
}
