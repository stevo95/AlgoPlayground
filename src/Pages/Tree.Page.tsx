import { Info } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import { ReactElement, useRef, useState, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";
import generateRandomArrayOfLength from "../Services/generate-random-array";



const TreePage = (): ReactElement => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const nodeRef = useRef<string>("");
    const [links, setLinks]: any[] | any[] = useState([]);
    const [nodes, setNodes]: any[] | any[] = useState([]);
    const treeData = {
        nodes: nodes,
        links: links,
    };
    const canvasHeight = window.innerHeight * 0.9;

    useEffect(() => {
        const array = generateRandomArrayOfLength(10, 1000);
        console.log(array)
    }, []);

    const nodeHoverHandler = (node: any | null) => {
        if (node && typeof node.id === "string") {
            nodeRef.current = node.id;
        } else {
            nodeRef.current = "";
        }
    };

    const nodeSelectHandler = (node: any) => {
        return;
    }
    
    const nodeColorHandler = (node: any) => {
        if (node.isTargetWord) {
          return "greenyellow";
        } else if (node.isStartingWord) {
          return "blue";
        }
        const color = node.isSearched ? "red" : "#555";
        return color;
    };
    
    const linkColorHandler = (link: any) => {
        if (link.isPassed) {
            return "red";
        } else {
            return "#555";
        }
    };
    
    return (
        <div className="graph_container">
          <ForceGraph2D
            graphData={treeData}
            height={canvasHeight}
            linkWidth={2}
            linkColor={(link) => linkColorHandler(link)}
            nodeColor={(node) => nodeColorHandler(node)}
            nodeCanvasObjectMode={() => "after"}
            onNodeHover={(node) => nodeHoverHandler(node)}
            onNodeClick={(node) => nodeSelectHandler(node)}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "black";
              if (
                typeof label === "string" &&
                typeof node.x === "number" &&
                typeof node.y === "number"
              ) {
                ctx.fillText(label, node.x, node.y + 15);
              }
            }}
            autoPauseRedraw={false}
          />
        </div>
    )
}

export default TreePage;
