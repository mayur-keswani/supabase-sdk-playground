import { FilterType, SelectedColumnsType } from "@/app/custom-types";
import React, { useState } from "react";
import QueryConfigurator from "./QueryConfigurator";
import QueryPreview from "./QueryPreview";

const QueryBuilder = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsType>({});
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-1/3">
        <QueryConfigurator
          selectedTable={selectedTable}
          selectedColumns={selectedColumns}
          selectedFilters={selectedFilters}
          updateSelectedTable={(value: string) => {
            setSelectedTable(value);
          }}
          updateSelectedColumns={(values: SelectedColumnsType) => {
            setSelectedColumns(values)
          }}
          updateSelectedFilters={(values: FilterType[]) => {
            setSelectedFilters(values);
          }}
        />
      </div>
      <div className="w-full lg:w-2/3">
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
