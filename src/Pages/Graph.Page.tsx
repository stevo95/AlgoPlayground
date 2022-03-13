import React, {useState, useRef, useEffect, MutableRefObject, FormEvent} from 'react';
import './Graph.Page.css';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import generateRandomGraph from '../Services/generate-random-graph'

const GraphPage = () => {

    interface GraphInterface {
        [key: string]: NodeInterface;
    }

    interface NodeInterface {
        isStartingWord?: boolean;
        isTargetWord?: boolean;
        isSearched: boolean;
        links: string[];
        id?: string;
    }

    interface GraphNodeInterface {
        id: string;
        label: string;
        color: string;
        val?: number;
    }

    interface LinkInterface {
        source: string;
        target: string;
    }

    const [nodes, setNode]: GraphNodeInterface[] | any[] = useState([]);
    const [links, setLinks]: any[] = useState([]);
    const [graph, setGraph]: any = useState([]);
    const [dfsChecked, setDfsChecked] = useState(false);
    const nodeRef: any = useRef(null);
    const startNode: any = useRef(null)
    const targetNode: any = useRef(null)
    const increment: MutableRefObject<number> = useRef(1000)
    const bfsRef: MutableRefObject<boolean> = useRef(true)
    const dfsRef: MutableRefObject<boolean> = useRef(false)
    const selectedAlgoRef: MutableRefObject<string> = useRef('bfs');
    const [reset, setReset]: any = useState(false)
    const graphData = {
        nodes: nodes, 
        links: links
    }

    useEffect(() => {
        const tempNodes = [];
        const tempLinks = [];

        const randomGraph = generateRandomGraph(30);
        setGraph(randomGraph);

        for (const [key, value] of Object.entries(randomGraph)) {
            tempNodes.push({
                id: key,
                label: key,
                color: "#555",
                val: 1,
                isSearched: false
            });
            for (const el of value.links) {
                if (key !== el) {
                    tempLinks.push({
                        source: key,
                        target: el,
                        isPassed: false,
                        value: 8
                    })

                }
            }
        }
        setNode(tempNodes);
        setLinks(tempLinks);
    }, [reset]);

    
    const findNodeAndChangeColor = (searchFor: string, state: string) => {
        for (const node of nodes) {
            if (node.id == searchFor) {
                if (state == 'searched') {
                    node.isSearched = true;
                } else if (state == 'target') {
                    node.isTargetWord = true;
                } else if (state == 'start') {
                    node.isStartingWord = true;
                } else {
                    node.isStartingWord = false;
                    node.isTargetWord = false;
                }
            }
        }
    }

    const findLinkAndChangeColor = (source: string, target: string) => {
        for (const link of links) {
            if (link.source.id == source && link.target.id == target) {
                link.isPassed = true;
            }
        }
    }

    const changeOnDelay = (ms: number, searchFor: string, state: string, link: LinkInterface, linkOnly: boolean): Promise<null> => {
        return new Promise(resolve => setTimeout(() => {
            if (linkOnly) {
                findLinkAndChangeColor(link.source, link.target);
            } else {
                findNodeAndChangeColor(searchFor, state);
                findLinkAndChangeColor(link.source, link.target);
            }
            console.log("link to color: ", link)
            resolve(null)
        }, ms + increment.current));
    }

    const graphSearchDepthFirst = (graph: GraphInterface, toSearch: string, targetWord: string, searchedNodes: string[], previous: string) => {
        searchedNodes.push(toSearch);
        changeOnDelay(1000, toSearch, 'searched', {source: previous, target: toSearch}, false);
        increment.current += 1000;

        if (graph[toSearch].links.includes(targetWord)) {
            changeOnDelay(1000, targetWord, 'target', {source: toSearch, target: targetWord}, true);
            increment.current += 1000;
            return true;
        }

        for (const node of graph[toSearch].links) {
            if (!searchedNodes.includes(node)) {
                const result = graphSearchDepthFirst(graph, node, targetWord, searchedNodes, toSearch);
                if (result) {
                    return true;
                }
            }
        }

        return false;
    }

    const graphSearchBreadthFirst = async (startWord: string, targetWord: string) => {
        const searchQueue: string[] = [startWord];
        const linkQueue: LinkInterface[] = [];
        const searchedNodes = [];
        const history = [];
        let node: any;
        let link: any; 

        while (searchQueue.length) {
            node = searchQueue.shift();
            searchedNodes.push(node);

            if (linkQueue.length) {
                link = linkQueue.shift();
            }

            if (node == targetWord) {
                changeOnDelay(1000, node, 'searched', link, true);
                console.log(links)
                break;
            } else if (node !== targetNode && node !== startWord && node !== targetWord) {
                changeOnDelay(1000, node, 'searched', link, false);
                increment.current += 1000;
                history.push({
                    node: node,
                    links: graph[node].links
                })
            }

            for (const el of graph[node].links) {
                if (!searchedNodes.includes(el)) {
                    searchQueue.push(el);
                    linkQueue.push({
                        source: node,
                        target: el
                    })
                }
            }
        }

    }

    const nodeColorHandler = (node: any) => {
        if (node.isTargetWord) {
            return 'greenyellow';
        } else if (node.isStartingWord) {
            return 'blue';
        }
        const color = node.isSearched ? 'red' : '#555';
        return color;
    }

    const linkColorHandler = (link: any) => {
        if (link.isPassed) {
            return 'red';
        } else {
            return '#555';
        }
    }

    const nodeHoverHandler = (node: any) => {
        if (node) {
            nodeRef.current = node.id;
          } else {
            nodeRef.current = null;
          }
    }

    const nodeSelectHandler = (node: any) => {
        if (node && !startNode.current && !targetNode.current) {
            startNode.current = node.id;
            findNodeAndChangeColor(node.id, 'start')
          } else if (node && startNode.current && !targetNode.current) {
            findNodeAndChangeColor(node.id, 'target');
            targetNode.current = node.id;
          } else {
            startNode.current = null;
            targetNode.current = null;
            findNodeAndChangeColor(startNode.current, 'reset');
            findNodeAndChangeColor(targetNode.current, 'reset');
          }
    }

    const radioButtonHandler = (event: FormEvent<HTMLDivElement>) => {
        const value = (event.target as HTMLTextAreaElement).value;

        if (value == 'bfs') {
            selectedAlgoRef.current = 'bfs';
            setDfsChecked(false);
        } else {
            selectedAlgoRef.current = 'dfs';
            setDfsChecked(true);
        }
    }

    const searchButtonHandler = () => {
        if (selectedAlgoRef.current == 'bfs') {
            graphSearchBreadthFirst(startNode.current, targetNode.current)

        } else {
            graphSearchDepthFirst(graph, startNode.current, targetNode.current, [], startNode.current)
        }
    }

    const resetButtonHandler = () => {
        setReset(!reset);
    }

    return (
        <div className="graph_container">
            <div className="graph_control_container">
                <div className= "radio_container">
                    <div className="radio_button_pair">
                        <input 
                            type="radio" 
                            value="dfs" 
                            name="Depth first search" 
                            checked={dfsChecked}
                            onChange={(event: FormEvent<HTMLDivElement>) => {radioButtonHandler(event)}}
                        />
                        <div className="radio_button_name">
                            Depth first search
                        </div>
                    </div>
                    <div className="radio_button_pair">
                        <input 
                            type="radio" 
                            value="bfs" 
                            name="Breadth first search"
                            checked={!dfsChecked}
                            onChange={(event: FormEvent<HTMLDivElement>) => {radioButtonHandler(event)}}
                        />
                        <div className="radio_button_name">
                            Breadth first search
                        </div>
                    </div>
                </div>
                <button
                    className="button_search"
                    onClick= {searchButtonHandler}>
                        SEARCH
                </button>
                <button
                    className="button_reset"
                    onClick= {resetButtonHandler}>
                        RESET
                </button>
            </div>
            <ForceGraph2D
                graphData={graphData}
                linkWidth={2}
                linkColor={link => linkColorHandler(link) }
                nodeColor={ node => nodeColorHandler(node) }
                nodeCanvasObjectMode={() => "after"}
                onNodeHover={(node) => nodeHoverHandler(node)}
                onNodeClick={(node) => nodeSelectHandler(node)}
                nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black"; //node.color;
                if (
                    typeof label == 'string' && 
                    typeof node.x == 'number' && 
                    typeof node.y == 'number'
                ) {
                    ctx.fillText(label, node.x, node.y + 15);
                }
                }}
                autoPauseRedraw= {false}
            />
        </div>
    );
}

export default GraphPage;
