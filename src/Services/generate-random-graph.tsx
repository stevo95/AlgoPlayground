import returnDictionary from './generate-dictionary';

interface GraphInterface {
    [key: string]: NodeInterface;
}

interface NodeInterface {
    isSearched?: boolean;
    links: string[];
}

interface GraphNodeInterface {
    id: string;
    label: string;
    color: string;
    val?: number;
}

const generateRandomGraph = (numOfNodes: number) => {
    const dictionary = returnDictionary(numOfNodes, numOfNodes * 1.2);

    const graph: GraphInterface = {};

    for (const el of dictionary) {
        if (!graph[el[0]]) {
            graph[el[0]] = {
                links: [] 
            }
        }
        if (!graph[el[1]]) {
            graph[el[1]] = {
                links: []
            }
        }
        for (let j = 0; j < el.length; ++j) {
            if (graph[el[j]]) {
                const index = el.indexOf(el[j]);
                if (index == 0) {
                    if (!graph[el[j]].links.includes(el[1])) {
                        graph[el[j]].links.push(el[1])
                    }
                } else {
                    if (!graph[el[j]].links.includes(el[0])) {
                        graph[el[j]].links.push(el[0])
                    }
                }
            } else {
                graph[el[j]] = {
                    links: []
                }
            }
        }
    }

    return graph;
}

export default generateRandomGraph;
