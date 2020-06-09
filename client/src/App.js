import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { CopyToClipboard } from 'react-copy-to-clipboard';
const DEFAULT_URL = "https://"

function App() {
  const [path, setPath] = useState("")
  const [redirect_to, setRedirect_to] = useState(DEFAULT_URL)
  const [saved, setSaved] = useState("")
  const [savedPath, setSavedPath] = useState("")
  const [recentPath, setRecentPath] = useState({})
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("/api/mostRecent")
      if (data && data.path) {
        console.log(data)
        setRecentPath(data)
        console.log("set")
      }
    }
    fetchData()
  }, [])
  function handleChange(event) {
    setPath(event.target.value)
  }
  function handleChangeR(event) {
    setRedirect_to(event.target.value)
  }

  return (
    <div className="App">
      <div className="container">
        <div>Create a new Redirect</div>
        <div className="label">Path </div>
        <input className="input" type="text" placeholder={"any-path"} value={path} onChange={handleChange} />
        <div className="label">Redirect to</div>
        <input className="input" type="text" placeholder={"https://ibm.com/training"} value={redirect_to} onChange={handleChangeR} />
        <div>
          <button disabled={!path || !redirect_to} onClick={async () => {
            const { data } = await axios.post("/api/savePath", { path, redirect_to })
            if (data && data.err) {
              setSaved(data.msg)
            } else {
              setSavedPath(window.location.origin + "/" + path)
              setPath("")
              setRedirect_to(DEFAULT_URL)
              setSaved("Saved!")
            }
            setTimeout(() => { setSaved("") }, 5000)
          }}>Send Redirect</button>
        </div>
        <div>
          <CopyToClipboard text={savedPath} onCopy={() => { }}>
            <button disabled={savedPath.length === 0}>Copy Link: {savedPath}</button>
          </CopyToClipboard>

        </div>
        <div>{saved}</div>
        {recentPath.path && <div className="most-recent tooltip">
          {window.location.origin + "/" + recentPath.path}
          <span class="tooltiptext"><a href={recentPath.redirect_to}>{recentPath.redirect_to}</a></span>
        </div>}

        <div className="example">Example: inputting path as 'eggs' and redirect as 'https://reddit.com' will redirect you when visiting https://r.kryspin.dev/eggs</div>

        <div>V1.3</div>
      </div>
    </div >
  );
}

export default App;
