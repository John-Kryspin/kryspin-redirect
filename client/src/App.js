import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
function App() {
  const [path, setPath] = useState("")
  const [redirect_to, setRedirect_to] = useState("")
  const [saved, setSaved] = useState("")

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
        <div>{saved}</div>
        <button onClick={async () => {
          await axios.post("/api/savePath", { path, redirect_to })
          setPath("")
          setRedirect_to("")
          setSaved("Saved!")
          setTimeout(() => { setSaved("") }, 2000)
        }}>Send Redirect</button>
      </header>
    </div>
  );
}

export default App;
