import React from 'react';
import logo from './logo.svg';
import './App.css';
import GraphPage from './Pages/Graph.Page'

function App() {
  return (
    <div className="App">
      <div className= "graph_canvas">
        <GraphPage />
      </div>
    </div>
  );
}

export default App;
