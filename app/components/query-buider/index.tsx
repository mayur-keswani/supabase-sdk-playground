import { FilterType } from "@/app/custom-types";
import React, { useState } from "react";
import QueryConfigurator from "./QueryConfigurator";
import QueryPreview from "./QueryPreview";

const QueryBuilder = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);

  return (
    <div className="flex gap-4 p-4 w-full">
      <div className="w-1/3">
        <QueryConfigurator
          selectedTable={selectedTable}
          selectedColumns={selectedColumns}
          selectedFilters={selectedFilters}
          updateSelectedTable={(value: string) => {
            setSelectedTable(value);
          }}
          updateSelectedColumns={(col: string) => {
            setSelectedColumns((prev) =>
              prev.includes(col)
                ? prev.filter((c) => c !== col)
                : [...prev, col]
            );
          }}
          updateSelectedFilters={(values: FilterType[]) => {
            setSelectedFilters(values);
          }}
        />
      </div>
      <div className="w-2/3">
        <QueryPreview
          selectedTable={selectedTable}
          selectedColumns={selectedColumns}
          selectedFilters={selectedFilters}
        />
      </div>
    </div>
  );
};

export default QueryBuilder;
