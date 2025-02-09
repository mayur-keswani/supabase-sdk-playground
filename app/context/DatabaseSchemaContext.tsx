"use client";

import { createContext, useState, ReactNode } from "react";
import { Column, TableDefinition, TableState } from "../custom-types";

type DatabaseSchemaContextType = {
  databaseSchema: TableState;
  setSchema: (definitions: Record<string, TableDefinition>, paths: Record<string, any>) => void;
};

export const DatabaseSchemaContext = createContext<DatabaseSchemaContextType | undefined>(undefined);

export const DatabaseSchemaProvider = ({ children }: { children: ReactNode }) => {
  const [databaseSchema, setDatabaseSchema] = useState<TableState>({});



  const setSchema = (definitions: Record<string, TableDefinition>, paths: Record<string, any>) => {
    let tableGroup: TableState = {};

    const checkView = (title: string) => Object.keys(paths[`/${title}`] || {}).length === 1;

    for (const [key, value] of Object.entries(definitions)) {
      let colGroup: Column[] = [];

      Object.entries(value.properties).forEach(([colKey, colVal]) => {
        let col: Column = {
          title: colKey,
          format: colVal.format?.split(" ")[0] || "", // Ensure format exists before splitting
          type: colVal.type,
          default: colVal.default ?? undefined,
          required: value.required?.includes(colKey) ?? false,
          pk: colVal.description?.includes("<pk/>") ?? false,
          fk: colVal.description?.split("`")[1] || undefined,
        };
        colGroup.push(col);
      });

      tableGroup[key] = {
        title: key,
        is_view: checkView(key),
        columns: colGroup,
      };
    }

    setDatabaseSchema(tableGroup);
  };

  return (
    <DatabaseSchemaContext.Provider value={{ setSchema, databaseSchema }}>
      {children}
    </DatabaseSchemaContext.Provider>
  );
};
