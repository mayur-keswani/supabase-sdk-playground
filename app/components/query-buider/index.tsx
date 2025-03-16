import {
  FilterType,
  OperationType,
  SelectedColumnsType,
  SelectedSortByType,
} from "@/app/custom-types";
import React, { useState } from "react";
import QueryConfigurator from "./QueryConfigurator";
import QueryPreview from "./QueryPreview";

const QueryBuilder = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsType>(
    {}
  );
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);
  const [selectedSortBy,setSelectedSortBy] = useState<SelectedSortByType>({column:'',ascending:true})
  const [selectedOperation, setSelectedOperation] =
    useState<OperationType>("SELECT");

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-1/3">
        <QueryConfigurator
          selectedTable={selectedTable}
          selectedColumns={selectedColumns}
          selectedFilters={selectedFilters}
          selectedOperation={selectedOperation}
          selectedSortBy = {selectedSortBy}
          updateSelectedTable={(value: string) => {
            setSelectedTable(value);
          }}
          updateSelectedColumns={(values: SelectedColumnsType) => {
            setSelectedColumns(values);
          }}
          updateSelectedFilters={(values: FilterType[]) => {
            setSelectedFilters(values);
          }}
          updateSelectedSortBy={(column:string,ascending:boolean)=>{
            setSelectedSortBy({column,ascending})
          }}
          updateSelectedOperation={(value: OperationType) => {
            setSelectedOperation(value);
          }}
        />
      </div>
      <div className="w-full lg:w-2/3">
        <QueryPreview
          selectedTable={selectedTable}
          selectedColumns={selectedColumns}
          selectedFilters={selectedFilters}
          selectedSortBy={selectedSortBy}
          selectedOperation={selectedOperation}
        />
      </div>
    </div>
  );
};

export default QueryBuilder;
