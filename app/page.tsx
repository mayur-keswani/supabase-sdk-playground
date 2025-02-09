"use client";

import { useContext, useEffect, useState } from "react";
import getSupabaseClient from "./utils/supabase";
import { useRouter } from "next/navigation";
import { AuthContext } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const {userSession} = useContext(AuthContext)!;

  useEffect(() => {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        setIsSupabaseConnected(true);
      } else setIsSupabaseConnected(false);
    } catch (error) {
      setIsSupabaseConnected(false);
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <h1 className="text-4xl font-bold mb-1">
          The Supabase SDK Playground 
        </h1>
        <p className="text-2xl font-semibold mb-4">Built for Supabase' Developers</p>
        <button
          type="button"
          onClick={() => {
            if (isSupabaseConnected) {
              if(userSession){
                router.push("/dashboard");
              }else{
                router.push("/login");
              }
            }
            router.push("/connect");
          }}
          className="py-2 px-10 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSupabaseConnected ? "Dashboard" : "Connect With Supabase"}
        </button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Made with ❤️ from India by Mayur_keswani_
      </footer>
    </div>
  );
}
