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
        relationships:[]
      };
    }
   
    Object.entries(tableGroup).forEach(([key1,value1])=>{
      let tableName = key1;
      let tableColumns = value1.columns

      let pkColumn = tableColumns?.find(col=> col.pk)
      let relationshipsKey = `${tableName}.${pkColumn?.title}`
      let relationships: string[] = []
      Object.entries(tableGroup).forEach(([key2,value2])=>{
          if(key2 !== key1){ 
            let innerTableName = key2;
            let innerTableColumns = value2.columns;
            let isRelationshipExist = innerTableColumns?.findIndex(col=> col.fk?.toString() == relationshipsKey.toString()) !== -1

            if(isRelationshipExist){
              relationships.push(innerTableName)
            }

          }
      })
      tableGroup[key1]['relationships'] = relationships
    })


    

    setDatabaseSchema(tableGroup);
  };

  return (
    <DatabaseSchemaContext.Provider value={{ setSchema, databaseSchema }}>
      {children}
    </DatabaseSchemaContext.Provider>
  );
};
