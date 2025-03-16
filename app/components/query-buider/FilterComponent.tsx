import { useState } from "react";
import { nanoid } from "nanoid";
import { Column, FilterType } from "@/app/custom-types";

const FilterComponent = ({
  columns,
  selectedFilters,
  updateSelectedFilters,
}: {
  columns: Column[];
  selectedFilters: FilterType[];
  updateSelectedFilters: (filters: FilterType[]) => void;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`${
          selectedFilters?.length > 0 ? "bg-green-600" : "bg-gray-800"
        } text-white px-4 py-2 rounded-md flex items-center gap-2`}
      >
        <span>
          Filter{" "}
          {selectedFilters?.length > 0 && (
            <span>({selectedFilters.length})</span>
          )}
        </span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 011 1v2.5a1 1 0 01-.293.707L11 13.414V16a1 1 0 01-1.447.894l-2-1A1 1 0 017 15v-1.586L3.293 8.207A1 1 0 013 7.5V5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Filter Dropdown Panel */}
      {isFilterOpen && (
        <div className="absolute left-0 max-h-[250px] overflow-y-scroll  mt-2 w-96 bg-white border shadow-lg rounded-lg p-4 z-50">
          {selectedFilters.length == 0 && (
            <p className="text-gray-700 font-semibold">
              No filters applied to this view
            </p>
          )}

          {selectedFilters.length > 0 && (
            <>
              <div></div>
              <div>
                {selectedFilters.map((filter: FilterType) => (
                  <div key={filter.id} className="flex items-center gap-2 mt-2">
                    <select
                      value={filter.column}
                      onChange={(e) =>
                        updateSelectedFilters(
                          selectedFilters.map((f) =>
                            f.id === filter.id
                              ? { ...f, column: e.target.value }
                              : f
                          )
                        )
                      }
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
                            f.id === filter.id
                              ? { ...f, operator: e.target.value }
                              : f
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
                            f.id === filter.id
                              ? { ...f, value: e.target.value }
                              : f
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
              </div>
            </>
          )}

          {/* Add Filter Button */}
          <button
            onClick={() =>
              updateSelectedFilters([
                ...selectedFilters,
                { id: nanoid(), column: "", operator: "=", value: "" },
              ])
            }
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add filter
          </button>

          {/* Clear Filter Button */}
          {selectedFilters.length > 0 && (
            <button
              onClick={() => {
                updateSelectedFilters([]);
                setIsFilterOpen(false);
              }}
              className={`float-right mt-4 p-2 rounded-md bg-red-500 text-white hover:bg-red-600`}
            >
              Clear All filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
