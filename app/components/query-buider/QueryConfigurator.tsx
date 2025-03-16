import React, { useContext, useEffect, useState } from "react";
import { DatabaseSchemaContext } from "@/app/context/DatabaseSchemaContext";
import {
  Column,
  SelectedColumnsType,
  FilterType,
  OperationType,
} from "@/app/custom-types";
import FilterComponent from "./FilterComponent";

interface PropsType {
  selectedTable: string | null;
  selectedColumns: SelectedColumnsType;
  selectedFilters: FilterType[];
  selectedOperation: OperationType;
  updateSelectedTable: (table: string) => void;
  updateSelectedColumns: (values: SelectedColumnsType) => void;
  updateSelectedFilters: (filters: FilterType[]) => void;
  updateSelectedOperation: (value: OperationType) => void;
}

const Builder: React.FC<PropsType> = ({
  selectedTable,
  selectedColumns,
  selectedFilters,
  selectedOperation,
  updateSelectedTable,
  updateSelectedColumns,
  updateSelectedFilters,
  updateSelectedOperation,
}) => {
  const [openAccordions, setOpenAccordions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleAccordion = (table: string) => {
    if (openAccordions[table]) {
      let updatedSelectedColumns = { ...selectedColumns };
      delete updatedSelectedColumns[table];
      updateSelectedColumns(updatedSelectedColumns);
    }
    setOpenAccordions((prev) => {
      return { ...prev, [table]: !prev[table] };
    });
  };

  const { databaseSchema: schema } = useContext(DatabaseSchemaContext)!;

  const isSelected = (obj: any, path: string[], operation: OperationType) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = current[path[i]] || {};
      current = current[path[i]];
    }
    if (operation === "SELECT") return !!current[path[path.length - 1]];
    else return path[path.length - 1] in current;
  };

  const handleColumnChange = (
    column: Column,
    checked: boolean,
    parentPath: string[] = [],
    textValue: string = ""
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
        if (selectedOperation === "SELECT")
          setNestedValue(updatedColumns, path, {});
        else setNestedValue(updatedColumns, path, textValue);
      } else {
        // Simple column
        if (selectedOperation === "SELECT") {
          setNestedValue(updatedColumns, path, true);
        } else {
          setNestedValue(updatedColumns, path, textValue);
        }
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
    if (level > 3)
      return (
        <>
          <br />
          <span className="text-red-600 text-sm">
            Sorry, Currently we are only supporting join till 3 levels
          </span>
        </>
      ); // Limit recursion to 2 levels

    const cols = schema?.[table]?.columns ?? [];

    return cols.map((col) => (
      <div key={col.title} className="ml-4 mb-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected(
              selectedColumns,
              [...parentPath, col.title],
              selectedOperation
            )}
            onChange={(e) =>
              handleColumnChange(col, e.target.checked, parentPath)
            }
            className="accent-blue-600"
          />
          <label className="block text-sm font-medium">{col.title}</label>

          {Object.keys(selectedColumns).includes(col.title) &&
            (selectedOperation === "INSERT" ||
              selectedOperation === "UPDATE" ||
              selectedOperation === "UPSERT") && (
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder={`Enter ${col.title}`}
                value={
                  typeof selectedColumns[col.title] === "string"
                    ? selectedColumns[col.title]?.toString()
                    : ""
                }
                onChange={(e) =>
                  handleColumnChange(col, true, parentPath, e.target.value)
                }
              />
            )}
        </label>

        {/* Recursively render foreign key columns */}
        {col.fk &&
          isSelected(
            selectedColumns,
            [...parentPath, col.title],
            selectedOperation
          ) &&
          selectedOperation === "SELECT" && (
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

  useEffect(() => {
    updateSelectedColumns({});
  }, [selectedOperation]);

  return (
    <div className="h-lvh p-4 border-r border-gray-300 bg-white shadow-md rounded-lg overflow-y-scroll">
      {/* Operation Type Selector */}
      <h5 className="text-lg font-semibold mb-3">Operation</h5>
      <select
        className="w-full p-2 mb-3 border rounded-md"
        value={selectedOperation}
        onChange={(e) => {
          updateSelectedOperation(e.target.value as OperationType);
        }}
      >
        <option value="SELECT">SELECT</option>
        <option value="INSERT">INSERT</option>
        <option value="UPDATE">UPDATE</option>
        <option value="DELETE">DELETE</option>
        <option value="UPSERT">UPSERT</option>
      </select>
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

      {/* FILTERS */}
      {selectedTable && (
        <FilterComponent
          columns={schema?.[selectedTable!]?.columns!}
          selectedFilters={selectedFilters}
          updateSelectedFilters={updateSelectedFilters}
        />
      )}

      {/* Columns */}
      {selectedTable && (
        <div className="max-h-[350px] overflow-y-scroll">
          <h6 className="text-md font-medium mb-2">Select Columns</h6>
          <div>{renderColumns(selectedTable)}</div>
        </div>
      )}

      {selectedTable && (
        <div className="max-h-[350px] overflow-y-scroll">
          <h6 className="text-md font-medium mb-2">Select Relationship</h6>
          <div>
            {schema[selectedTable].relationships.map((relatedTable) => (
              <div key={relatedTable} className="border-b">
                {/* Accordion Header */}
                <button
                  className="w-full flex justify-between items-center p-3 text-left font-medium bg-gray-100 hover:bg-gray-200"
                  onClick={() => toggleAccordion(relatedTable)}
                >
                  {relatedTable}
                  <span
                    className={`transform transition ${
                      openAccordions[relatedTable] ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openAccordions[relatedTable] && (
                  <div className="p-3 bg-white border-t">
                    <div className="h-[150px] overflow-y-scroll ml-3">
                      {renderColumns(relatedTable, 1, [relatedTable])}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

     
    </div>
  );
};

export default Builder;
