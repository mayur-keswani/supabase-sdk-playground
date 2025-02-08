"use client";

import { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import getSupabaseClient from "../utils/supabase";

export const AuthContext = createContext<
  | {
      userSession: Session | null;
      setAuthData: (payload: Session) => void;
      clearUserSession: () => void;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<Session | null>(null);

  const clearUserSession = () => {
    setUserSession(null);
  };
  const setAuthData = (payload: Session) => {
    setUserSession(payload);
  };

  // Fetch session on load (persists session on refresh)
  const fetchSession = async () => {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
        } else {
          setUserSession(data?.session ?? null);
        }
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const getColumns = () => {
    return [];
  };
  return (
    <AuthContext.Provider
      value={{ userSession, setAuthData, clearUserSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
