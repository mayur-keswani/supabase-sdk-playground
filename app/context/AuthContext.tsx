"use client";

import { Session } from "@supabase/supabase-js";
import {
  createContext,
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
    let subscription: { data: any };
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        subscription = supabase.auth.onAuthStateChange((_event, session) => {
          setUserSession(session);
        });
      }
    } catch (error) {
      console.log({ error });
    }

    return () => subscription && subscription.data.subscription.unsubscribe();
  };

  useEffect(() => {
    fetchSession();
  }, []);

  
  return (
    <AuthContext.Provider
      value={{ userSession, setAuthData, clearUserSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
