import { useEffect } from 'react';
import './App.css';
import GraphPage from './Pages/Graph.Page'

function App() {

  useEffect(() => {
    document.title = "Algo Playground"
  }, [])

  
  return (
    <div className="App">
      <div className= "graph_canvas">
        <GraphPage />
      </div>
    </div>
  );
}

export default App;
