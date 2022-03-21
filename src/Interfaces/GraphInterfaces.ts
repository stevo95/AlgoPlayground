
export interface GraphInterface {
    [key: string]: VertexInterface;
}

interface VertexInterface {
    isStartingWord?: boolean;
    isTargetWord?: boolean;
    isSearched?: boolean;
    links: string[];
    id?: string;
}

export interface GraphVertexInterface {
    id: string;
    label: string;
    color: string;
    val?: number;
}

export interface LinkInterface {
    source: string;
    target: string;
}