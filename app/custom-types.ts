export interface FilterType {
    id: string;
    column: string;
    operator: string;
    value: string;
}


export interface Table {
    title: string;
    columns?: Column[];
    // position?: Position;
    relationships:string[]
    is_view?: boolean;
}

export interface TableState {
    [key: string]: Table;
}


export type TableDefinition = {
    properties: Record<string, ColumnDefinition>;
    required?: string[];
};

export type ColumnDefinition = {
    format?: string;
    type: string;
    default?: any;
    description?: string;
};

export interface Column {
    title: string;
    format: string;
    type: string;
    default?: any;
    required?: boolean;
    pk?: boolean;
    fk?: string | undefined;
}

export type SelectedColumnsType =  {[key:string]:boolean| SelectedColumnsType}