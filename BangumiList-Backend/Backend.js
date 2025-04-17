const express = require('express')
const cors = require('cors')
const sqlite3 = require("sqlite3").verbose()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

const dbPath = "BangumiList.db"

app.get("/update", (req, res) => {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(err.message)
        }
        console.log("Connected to the database.")
    })
    db.all("SELECT * FROM FILELIST", [], (err, rows) => {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        else {
            res.status(200).json(rows)
        }
    })
})

app.listen(port, ()=>{
    console.log("Server is running on port " + port)
})