import React, { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import getSupabaseClient from "../../utils/supabase";
import { SelectedColumnsType } from "@/app/custom-types";

interface FilterType {
  column: string;
  operator: string;
  value: string;
}

interface QueryBuilderProps {
  selectedTable: string | null;
  selectedColumns: SelectedColumnsType;
  selectedFilters: FilterType[];
}

const QueryPreview: React.FC<QueryBuilderProps> = ({
  selectedTable,
  selectedColumns,
  selectedFilters,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);

  const buildSelectQuery = (columns: SelectedColumnsType): string => {
    return Object.entries(columns)
      .map(([key, value]) => {
        if (typeof value === "object" && Object.keys(value).length > 0) {
          return `${key}(${buildSelectQuery(value)})`; // Recursive FK handling
        }
        return key; // Base case: simple column
      })
      .join(", ");
  };

  const generateQuery = useMemo(() => {

    if (!selectedTable || Object.keys(selectedColumns).length === 0) return "";
    const selectString = buildSelectQuery(selectedColumns);

    let query = `supabase.from('${selectedTable}').select('${selectString}')`;

    selectedFilters.forEach((filter) => {
      if (filter.column && filter.value) {
        query += `.eq('${filter.column}', '${filter.value}')`;
      }
    });

    return query;
  }, [selectedTable, selectedColumns, selectedFilters]);

  /** Executes the query using Supabase */
  const executeQuery = async (sdkCode: string) => {
    if (!sdkCode) return;

    try {
      setLoading(true);
      setResponse(null);
      const supabaseClient = getSupabaseClient();

      // Execute the generated Supabase query
      const result = await new Function("supabase", `return (async () => ${sdkCode})()`)(
        supabaseClient
      );

      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h5 className="text-lg font-semibold mb-3">Query Editor</h5>
      
      <CodeMirror
        value={generateQuery}
        height="200px"
        extensions={[javascript({ jsx: true })]}
      />

      <button
        className={`mt-3 px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
        disabled={loading || !generateQuery}
        onClick={() => executeQuery(generateQuery)}
      >
        {loading ? "Executing..." : "Execute Query"}
      </button>

      <textarea
        readOnly
        value={response || ""}
        placeholder="JSON Response will appear here..."
        className="w-full mt-4 p-3 bg-gray-100 rounded-md font-mono text-sm"
        rows={10}
      />
    </div>
  );
};

export default QueryPreview;
