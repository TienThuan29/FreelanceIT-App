export interface VectorMetadata {
    [key: string]: string | number | boolean;
}

export interface VectorRecord {
    id: string;
    values: number[];
    metadata?: VectorMetadata;
}

export interface QueryResult {
    id: string;
    score: number;
    metadata?: VectorMetadata;
}