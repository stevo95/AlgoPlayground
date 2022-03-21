import "./Graph.Page.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ForceGraph2D } from "react-force-graph";
import { Close, Info } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import generateRandomGraph from "../Services/generate-random-graph";
import {
  findVertexAndChangeColor,
  findLinkAndChangeColor,
} from "../Helpers/GraphPage.Helpers";
import {
  GraphInterface,
  LinkInterface,
  GraphVertexInterface,
  GraphLinkInterface,
} from "../Interfaces/GraphInterfaces";
import {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  FormEvent,
  ReactElement,
} from "react";

const GraphPage = (): ReactElement => {
  const [dfsChecked, setDfsChecked] = useState<boolean>(false);
  const [graph, setGraph]: GraphVertexInterface[] | any[] = useState([]);
  const [links, setLinks]: LinkInterface[] | any[] = useState([]);
  const [reset, setReset] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [vertexes, setVertex]: GraphVertexInterface[] | any[] = useState([]);
  const vertexRef = useRef<string>("");
  const startVertex = useRef<string>("");
  const targetVertex = useRef<string>("null");
  const increment = useRef<number>(1000);
  const selectedAlgoRef: MutableRefObject<string> = useRef("bfs");
  const graphData = {
    nodes: vertexes,
    links: links,
  };

  useEffect(() => {
    const tempVertexes = [];
    const tempLinks = [];

    const randomGraph = generateRandomGraph(30);
    setGraph(randomGraph);

    for (const [key, value] of Object.entries(randomGraph)) {
      tempVertexes.push({
        id: key,
        label: key,
        color: "#555",
        val: 1,
        isSearched: false,
      });
      for (const el of value.links) {
        if (key !== el) {
          tempLinks.push({
            source: key,
            target: el,
            isPassed: false,
            value: 8,
          });
        }
      }
    }
    setVertex(tempVertexes);
    setLinks(tempLinks);
  }, [reset]);

  const changeOnDelay = (
    ms: number,
    searchFor: string,
    state: string,
    link: LinkInterface,
    linkOnly: boolean
  ): Promise<null> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        if (linkOnly) {
          findLinkAndChangeColor(link.source, link.target, links);
        } else {
          findVertexAndChangeColor(searchFor, state, vertexes);
          findLinkAndChangeColor(link.source, link.target, links);
        }
        resolve(null);
      }, ms + increment.current)
    );
  };

  const graphSearchDepthFirst = (
    graph: GraphInterface,
    toSearch: string,
    targetWord: string,
    searchedVertexes: string[],
    previous: string
  ) => {
    searchedVertexes.push(toSearch);
    changeOnDelay(
      1000,
      toSearch,
      "searched",
      { source: previous, target: toSearch },
      false
    );
    increment.current += 1000;

    if (graph[toSearch].links.includes(targetWord)) {
      changeOnDelay(
        1000,
        targetWord,
        "target",
        { source: toSearch, target: targetWord },
        true
      );
      increment.current += 1000;
      return true;
    }

    for (const vertex of graph[toSearch].links) {
      if (!searchedVertexes.includes(vertex)) {
        const result = graphSearchDepthFirst(
          graph,
          vertex,
          targetWord,
          searchedVertexes,
          toSearch
        );
        if (result) {
          return true;
        }
      }
    }

    return false;
  };

  const graphSearchBreadthFirst = async (
    startWord: string,
    targetWord: string
  ) => {
    const searchQueue: string[] = [startWord];
    const linkQueue: LinkInterface[] = [];
    const searchedVertexes = [];
    const history = [];
    let vertex: string | undefined;
    let link: LinkInterface | undefined;

    while (searchQueue.length) {
      vertex = searchQueue.shift();
      searchedVertexes.push(vertex);

      if (linkQueue.length) {
        link = linkQueue.shift();
      }

      if (!vertex) return;

      if (vertex === targetWord && link) {
        changeOnDelay(1000, vertex, "searched", link, true);
        break;
      } else if (
        link &&
        vertex !== targetVertex.current &&
        vertex !== startWord &&
        vertex !== targetWord
      ) {
        changeOnDelay(1000, vertex, "searched", link, false);
        increment.current += 1000;
        history.push({
          vertex: vertex,
          links: graph[vertex].links,
        });
      }

      for (const el of graph[vertex].links) {
        if (!searchedVertexes.includes(el)) {
          searchQueue.push(el);
          linkQueue.push({
            source: vertex,
            target: el,
          });
        }
      }
    }
  };

  const vertexColorHandler = (vertex: GraphVertexInterface) => {
    if (vertex.isTargetWord) {
      return "greenyellow";
    } else if (vertex.isStartingWord) {
      return "blue";
    }
    const color = vertex.isSearched ? "red" : "#555";
    return color;
  };

  const linkColorHandler = (link: GraphLinkInterface) => {
    if (link.isPassed) {
      return "red";
    } else {
      return "#555";
    }
  };

  const vertexHoverHandler = (vertex: GraphVertexInterface | null) => {
    if (vertex && typeof vertex.id === "string") {
      vertexRef.current = vertex.id;
    } else {
      vertexRef.current = "";
    }
  };

  const vertexSelectHandler = (vertex: GraphVertexInterface) => {
    if (
      vertex &&
      !startVertex.current &&
      !targetVertex.current &&
      typeof vertex.id === "string"
    ) {
      startVertex.current = vertex.id;
      findVertexAndChangeColor(vertex.id, "start", vertexes);
    } else if (
      vertex &&
      startVertex.current &&
      !targetVertex.current &&
      typeof vertex.id === "string"
    ) {
      findVertexAndChangeColor(vertex.id, "target", vertexes);
      targetVertex.current = vertex.id;
    } else {
      startVertex.current = "";
      targetVertex.current = "";
      findVertexAndChangeColor(startVertex.current, "reset", vertexes);
      findVertexAndChangeColor(targetVertex.current, "reset", vertexes);
    }
  };

  const radioButtonHandler = (event: FormEvent<HTMLDivElement>) => {
    const value = (event.target as HTMLTextAreaElement).value;

    if (value === "bfs") {
      selectedAlgoRef.current = "bfs";
      setDfsChecked(false);
    } else {
      selectedAlgoRef.current = "dfs";
      setDfsChecked(true);
    }
  };

  const searchButtonHandler = () => {
    if (selectedAlgoRef.current === "bfs") {
      graphSearchBreadthFirst(startVertex.current, targetVertex.current);
    } else {
      graphSearchDepthFirst(
        graph,
        startVertex.current,
        targetVertex.current,
        [],
        startVertex.current
      );
    }
  };

  const resetButtonHandler = () => {
    startVertex.current = "";
    targetVertex.current = "";
    setReset(!reset);
  };

  const handleModalOpen = () => {
    if (!modalOpen) {
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="graph_container">
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            height: "80%",
            "background-color": "whitesmoke",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            style={{ alignSelf: "flex-start", justifySelf: "flex-start" }}
            onClick={handleModalClose}
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              1. Select starting graph vertex by clicking it
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              2. Select target graph vertex by clicking it
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              3. Select desired algorithm
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              4. Hit search
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              5. Watch it work :-)
            </Typography>
          </Box>
        </Box>
      </Modal>
      <div className="graph_control_container">
        <button className="button_general" onClick={handleModalOpen}>
          <Info />
        </button>
        <div className="radio_container">
          <div className="radio_button_pair">
            <input
              type="radio"
              value="dfs"
              name="Depth first search"
              checked={dfsChecked}
              onChange={(event: FormEvent<HTMLDivElement>) => {
                radioButtonHandler(event);
              }}
            />
            <div className="radio_button_name">Depth first search</div>
          </div>
          <div className="radio_button_pair">
            <input
              type="radio"
              value="bfs"
              name="Breadth first search"
              checked={!dfsChecked}
              onChange={(event: FormEvent<HTMLDivElement>) => {
                radioButtonHandler(event);
              }}
            />
            <div className="radio_button_name">Breadth first search</div>
          </div>
        </div>
        <button className="button_general" onClick={searchButtonHandler}>
          SEARCH
        </button>
        <button className="button_general" onClick={resetButtonHandler}>
          RESET
        </button>
      </div>
      <ForceGraph2D
        graphData={graphData}
        height={window.innerHeight * 0.9}
        linkWidth={2}
        linkColor={(link) => linkColorHandler(link)}
        nodeColor={(node) => vertexColorHandler(node)}
        nodeCanvasObjectMode={() => "after"}
        onNodeHover={(node) => vertexHoverHandler(node)}
        onNodeClick={(node) => vertexSelectHandler(node)}
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
  );
};

export default GraphPage;
