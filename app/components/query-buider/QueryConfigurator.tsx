import React, { useContext, useMemo } from "react";
import { DatabaseSchemaContext } from "@/app/context/DatabaseSchemaContext";
import { Column, SelectedColumnsType, FilterType } from "@/app/custom-types";
import { nanoid } from "nanoid";

interface PropsType {
  selectedTable: string | null;
  selectedColumns: SelectedColumnsType;
  selectedFilters: FilterType[];
  updateSelectedTable: (table: string) => void;
  updateSelectedColumns: (values: SelectedColumnsType) => void;
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
  const { databaseSchema: schema } = useContext(DatabaseSchemaContext)!;

  const columns = useMemo(() => {
    return selectedTable ? schema?.[selectedTable]?.columns : [];
  }, [selectedTable]);

  const isSelected=(obj: any, path: string[])=>{
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = current[path[i]] || {};
      current = current[path[i]];
    }
   return current[path[path.length - 1]]
  }

  const handleColumnChange = (
    column: Column,
    checked: boolean,
    parentPath: string[] = []
  ) => {
    let updatedColumns = { ...selectedColumns };
    let path = [...parentPath, column.title]; // Build path dynamically

    // Helper function to set nested values
    const setNestedValue = (obj: any, path: string[], value: any) => {
      let current = obj;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = current[path[i]] || {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
    };

    if (checked) {
      if (column.fk) {
        // Ensure nested structure for FK
        setNestedValue(updatedColumns, path, {});
      } else {
        // Simple column
        setNestedValue(updatedColumns, path, true);
      }
    } else {
      // Helper function to remove a nested key
      const deleteNestedKey = (obj: any, path: string[]) => {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) return;
          current = current[path[i]];
        }
        delete current[path[path.length - 1]];
      };
      deleteNestedKey(updatedColumns, path);
    }

    updateSelectedColumns(updatedColumns);
  };

  const renderColumns = (
    table: string,
    level: number = 1,
    parentPath: string[] = []
  ) => {
    // console.log({level})
    if (level > 3) return <>
      <br/>
      <span className="text-red-600 text-sm">Sorry, Currently we are only supporting join till 3 levels</span>
      </>; // Limit recursion to 2 levels

    const cols = schema?.[table]?.columns ?? [];
    return cols.map((col) => (
      <div key={col.title} className="ml-4 mb-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            // checked={!!parentPath.reduce((obj, key) => obj?.[key], selectedColumns)?.[col.title]}
            onChange={(e) =>
              handleColumnChange(col, e.target.checked, parentPath)
            }
            className="accent-blue-600"
          />
          <span>{col.title}</span>
        </label>

        {/* Recursively render foreign key columns */}
        {col.fk && isSelected(selectedColumns,[...parentPath,col.title]) && (
          <div className="ml-6 mt-1 border-l pl-4">
            <span className="text-sm text-gray-600">
              Select columns from {col.fk.split(".")[0]}:
            </span>
            {renderColumns(col.fk.split(".")[0], level + 1, [
              ...parentPath,
              col.title,
            ])}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-lvh p-4 border-r border-gray-300 bg-white shadow-md rounded-lg">
      <h5 className="text-lg font-semibold mb-3">Select Table & Columns</h5>
      <select
        className="w-full p-2 mb-3 border rounded-md"
        value={selectedTable ?? ""}
        onChange={(e) => updateSelectedTable(e.target.value)}
      >
        <option value="">-- Select Table --</option>
        {Object.keys(schema ?? {}).map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>

      {selectedTable && (
        <div>
          <h6 className="text-md font-medium mb-2">Select Columns</h6>
          <div className="h-[300px] overflow-y-scroll">
            {renderColumns(selectedTable)}
          </div>
        </div>
      )}

      {/* Filters */}
      <h5 className="text-lg font-semibold mt-4">Filters</h5>
      {selectedFilters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2 mt-2">
          <select
            value={filter.column}
            onChange={(e) => {
              updateSelectedFilters(
                selectedFilters.map((f) =>
                  f.id === filter.id ? { ...f, column: e.target.value } : f
                )
              )
            }}
            className="w-1/3 p-2 border rounded-md"
          >
            <option value="">Column</option>
            {columns?.map((col) => (
              <option key={col.title} value={col.title}>
                {col.title}
              </option>
            ))}
          </select>

          <select
            value={filter.operator}
            onChange={(e) =>
              updateSelectedFilters(
                selectedFilters.map((f) =>
                  f.id === filter.id ? { ...f, operator: e.target.value } : f
                )
              )
            }
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
            onChange={(e) =>
              updateSelectedFilters(
                selectedFilters.map((f) =>
                  f.id === filter.id ? { ...f, value: e.target.value } : f
                )
              )
            }
            className="w-1/3 p-2 border rounded-md"
          />

          <button
            onClick={() =>
              updateSelectedFilters(
                selectedFilters.filter((f) => f.id !== filter.id)
              )
            }
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add Filter Button */}
      <button
        onClick={() =>
          updateSelectedFilters([
            ...selectedFilters,
            { id: nanoid(), column: "", operator: "=", value: "" },
          ])
        }
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add Filter
      </button>
    </div>
  );
};

export default Builder;
