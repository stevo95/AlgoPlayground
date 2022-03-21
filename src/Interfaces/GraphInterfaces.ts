
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
    isSearched?: boolean;
    isStartingWord?: boolean;
    isTargetWord?: boolean
}

export interface LinkInterface {
    source: string;
    target: string;
}

export interface GraphLinkInterface {
    source: GraphVertexInterface;
    target: GraphVertexInterface;
    isPassed?: boolean;
}