import { Column, SelectedSortByType } from "@/app/custom-types";
import { useState } from "react";

interface SortProps {
  columns: Column[];
  selectedSortBy: SelectedSortByType;
  updateSelectedSortBy: (column: string, ascending: boolean) => void;
}

const SortComponent: React.FC<SortProps> = ({
  columns,
  selectedSortBy,
  updateSelectedSortBy,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsSortOpen(!isSortOpen)}
        className={`${
          selectedSortBy?.column ? "bg-green-600" : "bg-gray-800"
        } text-white px-4 py-2 rounded-md flex items-center gap-2`}
      >
        <span>
          Sort By{" "}
          {selectedSortBy?.column && <span>({selectedSortBy.column})</span>}
        </span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 011 1v2.5a1 1 0 01-.293.707L11 13.414V16a1 1 0 01-1.447.894l-2-1A1 1 0 017 15v-1.586L3.293 8.207A1 1 0 013 7.5V5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isSortOpen && (
        <div className="absolute left-0 max-h-[250px] overflow-y-scroll bg-white  mt-2 border rounded-lg p-4 z-50">
          {/* Column Selection */}
          <label className="block text-gray-400 mb-2">Sort by:</label>
          <select
            className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedSortBy.column ?? ""}
            onChange={(e) =>
              updateSelectedSortBy(
                e.target.value,
                selectedSortBy?.ascending ?? true
              )
            }
          >
            <option value="" disabled>
              Pick a column to sort by
            </option>
            {Object.entries(columns).map(([key, value]) => (
              <option key={value.title} value={value.title}>
                {value.title}
              </option>
            ))}
          </select>

          {/* Toggle Switch for Sorting Order */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-400">Ascending:</span>
            <button
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                selectedSortBy?.ascending ? "bg-green-500" : "bg-gray-500"
              }`}
              onClick={() =>
                updateSelectedSortBy(
                  selectedSortBy?.column ?? "",
                  !selectedSortBy.ascending
                )
              }
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  selectedSortBy?.ascending ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

           {/* Clear Filter Button */}
           {selectedSortBy.column && (
            <button
              onClick={() => {
                updateSelectedSortBy('',true);
                setIsSortOpen(false);
              }}
              className={`float-right mt-4 p-2 rounded-md bg-red-500 text-white hover:bg-red-600`}
            >
              Clear Sorting
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SortComponent;
