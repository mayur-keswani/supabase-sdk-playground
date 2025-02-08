import getSupabaseClient from "@/app/utils/supabase";
import React, { useState } from "react";

const CustomQuery: React.FC = () => {
  const [sdkCode, setSdkCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);

  const executeCode = async () => {
    try {
      if (!sdkCode.trim()) {
        setResponse("⚠️ Please enter valid Supabase SDK code.");
        return;
      }

      const supabase = getSupabaseClient();
      setResponse(null);
      setLoading(true);

      const result = await new Function(
        "supabase",
        `
        return (async () => {
          return ${sdkCode};
        })();
      `
      )(supabase);

      setLoading(false);
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: unknown) {
      setLoading(false);
      setResponse(`❌ Error: ${(error as Error)?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 w-full">
      {/* Left Section - Code Input */}
      <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Enter Supabase SDK Code</h3>
        <textarea
          rows={8}
          placeholder="Enter your Supabase SDK code..."
          value={sdkCode}
          onChange={(e) => setSdkCode(e.target.value)}
          className="w-full p-2 border rounded-md font-mono bg-gray-50 focus:ring focus:ring-blue-300"
        />
        <button
          className={`w-full mt-4 p-2 text-white font-semibold rounded-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={executeCode}
          disabled={loading}
        >
          {loading ? "Executing..." : "Run Code"}
        </button>
      </div>

      {/* Right Section - Response Output */}
      <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Response Output</h3>
        <textarea
          rows={8}
          readOnly
          value={response || ""}
          placeholder="JSON Response will appear here..."
          className="w-full p-2 border rounded-md font-mono bg-gray-100 focus:ring focus:ring-blue-300"
        />
      </div>
    </div>
  );
};

export default CustomQuery;
