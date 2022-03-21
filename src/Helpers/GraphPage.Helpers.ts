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
    for (const link of links) {
        if (link.source.id === source && link.target.id === target) {
            link.isPassed = true;
        }
    }
}

export {
    findVertexAndChangeColor,
    findLinkAndChangeColor,
}