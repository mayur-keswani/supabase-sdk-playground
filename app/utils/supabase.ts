import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient | null = null;

/**
 * Returns the Supabase configuration stored in localStorage (if any).
 */
export const getSupabaseConfig = () => {

  if (typeof window !== "undefined") {
    return {
      supabaseUrl: localStorage.getItem("supabaseUrl") ?? "",
      supabaseAnonKey: localStorage.getItem("supabaseAnonKey") ?? "",
    };
  } else {
    return {
      supabaseUrl: "",
      supabaseAnonKey: "",
    };
  }

};

/**
 * Initializes and returns a singleton Supabase client instance.
 * Credentials are retrieved from environment variables or localStorage.
 *
 * @param {string} [supabaseUrl] - Optional Supabase URL.
 * @param {string} [supabaseAnonKey] - Optional Supabase Anon Key.
 * @returns {SupabaseClient} - The Supabase client instance.
 */
export default function getSupabaseClient(
  supabaseUrl: string | null = SUPABASE_URL,
  supabaseAnonKey: string | null = SUPABASE_ANON_KEY
): SupabaseClient {
  if (supabase) {
    console.log("♻️ Reusing existing Supabase client.");
    return supabase;
  }


  // Only access localStorage in the browser  
  let storedConfig = getSupabaseConfig();

  supabaseUrl = supabaseUrl || storedConfig.supabaseUrl;
  supabaseAnonKey = supabaseAnonKey || storedConfig.supabaseAnonKey;

  // Validate credentials
  if ((!supabaseUrl || !supabaseAnonKey)) {
    console.log("🚨 Supabase URL and Anon Key missing.");
    return null as any; // Prevent crashing
  }

  // Create Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("✅ Supabase client initialized.");

  if (typeof window !== "undefined") {    // Store credentials in localStorage for reuse
    localStorage.setItem("supabaseUrl", supabaseUrl);
    localStorage.setItem("supabaseAnonKey", supabaseAnonKey);
  }




  return supabase!;
}
