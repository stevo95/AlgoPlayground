
import { GraphVertexInterface, GraphLinkInterface } from '../Interfaces/GraphInterfaces';

const findVertexAndChangeColor = (searchFor: string, state: string, vertexes: GraphVertexInterface[]) => {
    for (const vertex of vertexes) {
        if (vertex.id === searchFor) {
            if (state === 'searched') {
                vertex.isSearched = true;
            } else if (state === 'target') {
                vertex.isTargetWord = true;
            } else if (state === 'start') {
                vertex.isStartingWord = true;
            } else {
                vertex.isStartingWord = false;
                vertex.isTargetWord = false;
            }
        }
    }
}

const findLinkAndChangeColor = (source: string, target: string, links: GraphLinkInterface[]) => {
    if (links.length === 0) return;
    for (const link of links) {
        if (!link.source || !link.target || !isInstanceOfGraphVertexInterface(link.source) || !isInstanceOfGraphVertexInterface(link.target)) {
            continue;
        }
        if (link.source.id === source && link.target.id === target) {
            link.isPassed = true;
        }
    }
}

const isInstanceOfGraphVertexInterface = (object: any): object is GraphVertexInterface => {
    return 'id' in object;
}

export {
    findVertexAndChangeColor,
    findLinkAndChangeColor,
}
