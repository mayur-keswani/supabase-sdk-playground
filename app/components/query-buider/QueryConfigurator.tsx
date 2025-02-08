import React, { useContext, useEffect, useMemo, useState } from "react";
import { DatabaseSchemaContext } from "@/app/context/DatabaseSchemaContext";
import { FilterType } from "@/app/custom-types";
import { nanoid } from 'nanoid'



interface PropsType {
  selectedTable: string | null;
  selectedColumns: string[];
  selectedFilters: FilterType[];
  updateSelectedTable: (table: string) => void;
  updateSelectedColumns: (column: string) => void;
  updateSelectedFilters: (filters: FilterType[]) => void;
}

const Builder: React.FC<PropsType> = ({
  selectedTable,
  selectedColumns,
  selectedFilters,
  updateSelectedTable,
  updateSelectedColumns,
  updateSelectedFilters,
}) => {

  const {databaseSchema:schema} = useContext(DatabaseSchemaContext)!;

  const columns = useMemo(()=>{ return selectedTable? schema?.[selectedTable]?.properties : []},[selectedTable])
  

  const addFilter = () => {
    let updatedFilters = selectedFilters.concat({ id: nanoid(),column: "", operator: "=", value: "" })
    updateSelectedFilters(updatedFilters);
  };

  const updateFilter = (id: string, key:'column'|'operator'|'value', value: string) => {
    
    let updatedFilters =  selectedFilters.map((filt) => {
      if(filt.id === id)
        return { ...filt, [key] :value };
      else 
        return filt;
    });

    updateSelectedFilters(updatedFilters);
  };


  const removeFilter = (id: string) => {
    let updatedFilters = selectedFilters.filter((filt) => filt.id !== id);

    updateSelectedFilters(updatedFilters);
  };
  console.log({schema})

  return (
    <div className="h-lvh p-4 border-r border-gray-300 bg-white shadow-md rounded-lg">
      {/* Select Table */}
      <h5 className="text-lg font-semibold mb-3">Select Table & Columns</h5>
      <select
        className="w-full p-2 mb-3 border rounded-md"
        value={selectedTable ?? ''}
        onChange={(e) => updateSelectedTable(e.target.value)}
      >
        <option value="">-- Select Table --</option>
        {Object.keys(schema??[]).map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>

      {/* Select Columns */}
      {Object.keys(columns).length > 0 && (
        <div>
          <h6 className="text-md font-medium mb-2">Select Columns</h6>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(columns).map((col) => (
              <label key={col} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => updateSelectedColumns(col)}
                  className="accent-blue-600"
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <h5 className="text-lg font-semibold mt-4">Filters</h5>
      {selectedFilters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2 mt-2">
          <select
            value={filter.column}
            onChange={(e) => updateFilter(filter.id,'column', e.target.value)}
            className="w-1/3 p-2 border rounded-md"
          >
            <option value="">Column</option>
            {Object.keys(columns).map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <select
            value={filter.operator}
            onChange={(e) => updateFilter(filter.id, "operator", e.target.value)}
            className="w-1/4 p-2 border rounded-md"
          >
            <option value="=">=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&ge;</option>
            <option value="<=">&le;</option>
          </select>

          <input
            type="text"
            placeholder="Value"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
            className="w-1/3 p-2 border rounded-md"
          />

          <button
            onClick={() => removeFilter(filter.id)}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add Filter Button */}
      <button
        onClick={addFilter}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add Filter
      </button>
    </div>
  );
};

export default Builder;
