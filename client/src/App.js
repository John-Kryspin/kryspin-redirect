import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
function App() {
  const [path, setPath] = useState("")
  const [redirect_to, setRedirect_to] = useState("")
  function handleChange(event) {
    setPath(event.target.value)
  }
  function handleChangeR(event) {
    setRedirect_to(event.target.value)
  }

  return (
    <div className="App">
      <header className="App-header">
        Path: <input type="text" value={path} onChange={handleChange} />
        Redirect to:<input type="text" value={redirect_to} onChange={handleChangeR} />
        <button onClick={() => {
          axios.post("/api/savePath", { path, redirect_to })
          setPath("")
          setRedirect_to("")
        }}>Send Redirect</button>
      </header>
    </div>
  );
}

export default App;
