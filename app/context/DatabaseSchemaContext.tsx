"use client";

import { createContext, useState, ReactNode } from "react";

type SchemaType = Record<string, any>;


export const DatabaseSchemaContext = createContext<
  | {
      databaseSchema: Record<string, any> | null;
      setSchema: (schema: SchemaType) => void;
    }
  | undefined
>(undefined);

export const DatabaseSchemaProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [databaseSchema, setDatabaseSchema] = useState<SchemaType | null>(null);

  const setSchema = (schema: any) => {
    setDatabaseSchema(schema);
  };

  const getColumns = () => {
    return [];
  };
  return (
    <DatabaseSchemaContext.Provider value={{ setSchema, databaseSchema }}>
      {children}
    </DatabaseSchemaContext.Provider>
  );
};
