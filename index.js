const path = require('path');
const express = require('express')
const app = express()
const pgconn = require('./pgconn')
pgconn.connectToServer()
const client = pgconn.getClient()
var bodyParser = require('body-parser')
const isUrl = require('is-url')
app.use(bodyParser.json())

app.get('/:redirect_to', async function (req, res) {
    console.log("hi")
    if (!req.params.redirect_to)
        return res.json({ err: true, msg: `Invalid redirect provided` })
    const key = req.params.redirect_to
    const result = await client.query("SELECT * FROM REDIRECTS WHERE PATH = $1", [key])
    const rows = result.rows
    if (rows && rows.length > 0) {
        res.redirect(rows[0].redirect_to)
    } else {
        res.json({ "msg": `no data found for this path: ${key}` })
    }
})
app.get('/api/mostRecent', async function (req, res) {
    const result = await client.query("SELECT * FROM REDIRECTS WHERE last_update is not null ORDER BY last_update DESC")
    console.log(result.rows)
    const rows = result.rows
    if (rows && rows.length > 0) {
        res.json(rows[0])
    } else {
        res.json({ "msg": `no data found for this path: ${key}` })
    }
})
app.post('/api/savePath', async function (req, res) {
    let path = req.body.path
    let redirect_to = req.body.redirect_to
    if (!path || !redirect_to)
        return res.json({ err: true, msg: `Missing required attributes` })
    path = path.toLowerCase()
    if (!isUrl(redirect_to))
        return res.json({ err: true, msg: `Invalid url provided` })
    const alreadyExistsResponse = await client.query("SELECT * FROM REDIRECTS WHERE PATH = $1", [path])
    if (alreadyExistsResponse && alreadyExistsResponse.rowCount > 0) {
        return res.json({ err: true, msg: `Path: ${path}, already exists!` })
    }
    await client.query("INSERT INTO REDIRECTS(path, redirect_to) VALUES ($1,$2)", [path, redirect_to])
    res.json({ status: "OK", msg: "Added to DB" })
})
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

app.listen(8080)
