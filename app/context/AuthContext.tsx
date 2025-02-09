"use client";

import { Session } from "@supabase/supabase-js";
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import getSupabaseClient from "../utils/supabase";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  userSession: Session | null;
  setAuthData: (payload: Session) => void;
  clearUserSession: () => void;
  isSupabaseConnected: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] =
    useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const initializeSupabase = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not available");

      setIsSupabaseConnected(true);

    } catch (error) {
      console.error("Supabase connection failed:", error);
      setIsSupabaseConnected(false);
      if (pathname !== "/") router.replace("/connect"); // Redirect to the connect page
    }
  };

  useEffect(() => {
    initializeSupabase();
  }, []);

  useEffect(() => {
    if (isSupabaseConnected) {
      // Listen for auth state changes
      let supabase = getSupabaseClient()
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUserSession(session);
        }
      );

      return () => authListener?.subscription.unsubscribe();
    }
  }, [isSupabaseConnected]);

  const clearUserSession = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();

      if (supabase) {
        await supabase.auth.signOut(); // Ensure Supabase logs out the user properly
      }
    } catch (error) {}
    setUserSession(null); // Clear session state
  }, [router]);

  const setAuthData = (payload: Session) => {
    console.log(payload)
    setUserSession(payload);
  };

  return (
    <AuthContext.Provider
      value={{
        userSession,
        setAuthData,
        clearUserSession,
        isSupabaseConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
