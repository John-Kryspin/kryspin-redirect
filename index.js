const path = require('path');
const express = require('express')
const app = express()
const pgconn = require('./pgconn')
pgconn.connectToServer()
const client = pgconn.getClient()
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/:redirect_to', async function (req, res) {
    console.log("hi")
    if (!req.params.redirect_to)
        return
    const key = req.params.redirect_to
    const result = await client.query("SELECT * FROM REDIRECTS WHERE PATH = $1", [key])
    const rows = result.rows
    if (rows && rows.length > 0) {
        res.redirect(rows[0].redirect_to)
    } else {
        res.json({ "msg": `no data found for this path: ${key}` })
    }
})
app.post('/api/savePath', async function (req, res) {
    const path = req.body.path
    const redirect_to = req.body.redirect_to
    if (!path || !redirect_to)
        return

    const result = await client.query("INSERT INTO REDIRECTS(path, redirect_to) VALUES ($1,$2)", [path, redirect_to])
    res.json({ status: "OK", msg: "Added to DB" })
})
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

app.listen(8080)
