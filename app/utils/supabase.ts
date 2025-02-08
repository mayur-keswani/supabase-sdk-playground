import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient | null = null;

/**
 * Returns the Supabase configuration stored in localStorage (if any).
 */
export const getSupabaseConfig = () => {
  return {
    supabaseUrl: localStorage.getItem("supabaseUrl") ?? "",
    supabaseAnonKey: localStorage.getItem("supabaseAnonKey") ?? "",
  };
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
  if (!supabase) {
    // Fallback to localStorage if env variables are not available
    const storedConfig = getSupabaseConfig();
    supabaseUrl = supabaseUrl || storedConfig.supabaseUrl;
    supabaseAnonKey = supabaseAnonKey || storedConfig.supabaseAnonKey;

    // Validate credentials
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and Anon Key are required for initialization.");
    }

    // Create Supabase client
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase client initialized.");

    // Store credentials in localStorage for reuse
    localStorage.setItem("supabaseUrl", supabaseUrl);
    localStorage.setItem("supabaseAnonKey", supabaseAnonKey);
  } else {
    console.log("♻️ Reusing existing Supabase client.");
  }

  return supabase;
}
