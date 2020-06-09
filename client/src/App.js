import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
const DEFAULT_URL = "https://"
function App() {
  const [path, setPath] = useState("")
  const [redirect_to, setRedirect_to] = useState(DEFAULT_URL)
  const [saved, setSaved] = useState("")

  function handleChange(event) {
    setPath(event.target.value)
  }
  function handleChangeR(event) {
    setRedirect_to(event.target.value)
  }

  return (
    <div className="App">
      <div>Create a new Redirect</div>
      Path: <input type="text" placeholder={"any-path"} value={path} onChange={handleChange} />
        Redirect to:<input type="text" placeholder={"https://ibm.com/training"} value={redirect_to} onChange={handleChangeR} />
      <div> <button disabled={!path || !redirect_to} onClick={async () => {
        const { data } = await axios.post("/api/savePath", { path, redirect_to })

        if (data && data.err) {
          setSaved(data.msg)
        } else {
          setPath("")
          setRedirect_to(DEFAULT_URL)
          setSaved("Saved!")
        }
        setTimeout(() => { setSaved("") }, 5000)
      }}>Send Redirect</button>
      </div>
      <div>{saved}</div>

    </div>
  );
}

export default App;
