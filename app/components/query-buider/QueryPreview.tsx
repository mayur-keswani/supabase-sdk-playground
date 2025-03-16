import React, { useContext, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import getSupabaseClient from "../../utils/supabase";
import { OperationType, SelectedColumnsType, SelectedSortByType } from "@/app/custom-types";
import { DatabaseSchemaContext } from "@/app/context/DatabaseSchemaContext";

interface FilterType {
  column: string;
  operator: string;
  value: string;
}

interface QueryBuilderProps {
  selectedTable: string | null;
  selectedColumns: SelectedColumnsType;
  selectedFilters: FilterType[];
  selectedOperation: OperationType;
  selectedSortBy:SelectedSortByType;
}

const QueryPreview: React.FC<QueryBuilderProps> = ({
  selectedTable,
  selectedColumns,
  selectedFilters,
  selectedOperation,
  selectedSortBy
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const { databaseSchema: schema } = useContext(DatabaseSchemaContext)!;
  

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
  const buildInsertQuery = (columns: SelectedColumnsType): Record<string,string> => {
    let payload:Record<string,string> = {}
    
     Object.entries(columns)
      .map(([key, value]) => {
        if(typeof value === 'string')
          payload[key] = value;
        else 
         payload[key] = ''
      })
    
    return payload;
  };

  const generateQuery = useMemo(() => {
    if (!selectedTable) return "";
    let query = `supabase.from('${selectedTable}')`;
    if(selectedOperation === 'SELECT'){
      const selectString = buildSelectQuery(selectedColumns);
      query +=  `.select('${selectString}')`;
    }
    else if(selectedOperation === 'INSERT'){
      const insertPayload = buildInsertQuery(selectedColumns);
      query +=  `.insert(${JSON.stringify(insertPayload)}).select('*')`;
    }
    else if(selectedOperation === 'UPDATE'){
      const insertPayload = buildInsertQuery(selectedColumns);
      query +=  `.update(${JSON.stringify(insertPayload)}).select('*')`;
    }
    else if(selectedOperation === 'DELETE'){
      const insertPayload = buildInsertQuery(selectedColumns);
      query +=  `.delete(${JSON.stringify(insertPayload)}).select('*')`;
    }
    else if(selectedOperation === 'UPSERT'){
      const insertPayload = buildInsertQuery(selectedColumns);
      let primaryKeys:string[]=[]
      Object.entries(schema?.[selectedTable]?.columns ?? []).map(([key,value])=>{

       
        if(value.pk){
          primaryKeys.push(value.title)
        }
      });
      query +=  `.upsert(${JSON.stringify(insertPayload)}, { onConflict:[${primaryKeys.map(pk => `"${pk}"`).join(', ')}] }).select('*')`;
    }
   

    selectedFilters.forEach((filter) => {
      if (filter.column && filter.value) {
        if(filter.operator=='='){
          query += `.eq('${filter.column}', '${filter.value}')`;
        }
        else if(filter.operator=='>'){
          query += `.gt('${filter.column}', '${filter.value}')`;
        }
        else if(filter.operator=='>='){
          query += `.gte('${filter.column}', '${filter.value}')`;
        }
        else if(filter.operator=='<'){
          query += `.lt('${filter.column}', '${filter.value}')`;
        }
        else if(filter.operator=='<='){
          query += `.lte('${filter.column}', '${filter.value}')`;
        }
        
      }
    });
    
    if(selectedSortBy?.column){
      query += `.order('${selectedSortBy.column}', { ascending: ${selectedSortBy.ascending} })`;
    }
    return query;
  }, [selectedTable, selectedColumns, selectedFilters,selectedOperation,selectedSortBy]);

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
        editable={false}
        value={generateQuery}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        aria-disabled={true}
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
