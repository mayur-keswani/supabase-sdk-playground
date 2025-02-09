"use client";

import { useContext, useEffect, useState } from "react";
import QueryBuilder from "../components/query-buider";
import CustomQuery from "../components/custom-query";
import getSupabaseClient, { getSupabaseConfig } from "../utils/supabase";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useNotification } from "../context/NotificationContext";
import { DatabaseSchemaContext } from "../context/DatabaseSchemaContext";

export default function Dashboard() {
  const router = useRouter();
  const [mode, setMode] = useState("query-builder");
  const { clearUserSession, userSession } = useContext(AuthContext)!;
  const { notify } = useNotification();
  const { setSchema } = useContext(DatabaseSchemaContext)!;
  const [loading,setLoading] = useState(false)

  async function fetchSchema() {
    try {
      const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
      const response = await fetch(
        `${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`,
        {
          headers: {
            "Content-Type": "application/openapi+json",
          },
        }
      );
      const schemaResult = await response.json();

      setSchema(schemaResult?.definitions!, schemaResult.paths);
    } catch (error) {
      notify("Failed to fetch Database schema!", "error");
    }
  }
  async function onLogout() {
    try {
      setLoading(true)
      clearUserSession();
      setTimeout(()=>{
        router.push("/login"); // Redirect to login page
        setLoading(false)
      },1000)
    } catch (error) {
      setLoading(false)
      notify("Something went wrong!", "error");
    }
  }

  useEffect(() => {
    fetchSchema();
  }, []);

  return (
    <div className="p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 pb-1">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
          Welcome, {userSession?.user.user_metadata.first_name || ""}{" "}
          {userSession?.user.user_metadata.last_name || ""} 👋
        </h3>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => onLogout()}
        >
          {loading ? "Loging Out...":"Logout"}
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex space-x-4 my-4">
        {["query-builder", "custom-query"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded ${
              mode === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode(tab)}
          >
            {tab.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Render Selected Component */}
      {mode === "query-builder" ? <QueryBuilder /> : <CustomQuery />}
    </div>
  );
}
