const express = require('express')
const cors = require('cors')
const sqlite3 = require("sqlite3").verbose()
const fs = require("fs")

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

const dbPath = "BangumiList.db"
if (!fs.existsSync(dbPath)) {
    initializeDatabase()
}
function initializeDatabase() {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(err.message)
        }
        console.log("Created new database.")
    })
    db.run("CREATE TABLE IF NOT EXISTS DATABASELIST (\
        ID INTEGER PRIMARY KEY AUTOINCREMENT, DATABASENAME TEXT NOT NULL, ENABLEGRID INTEGER,\
        ENABLEDOUBLETABLE INTEGER, ENABLETIMESTAMP INTEGER, DATABASEPATH TEXT)")
    db.close()
}

app.get("/updateDatabase", (req, res) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        console.log("Connected to the database.")
    })
    db.all("SELECT * FROM DATABASELIST", [], (err, rows) => {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        else {
            res.status(200).json(rows)
        }
    })
    db.close()
})
app.post("/addDatabase", (req, res) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        console.log("Connected to the database.")
    })
    db.run("INSERT INTO DATABASELIST VALUES (?,?,?,?,?,?)", [null, req.body.databaseName,
        req.body.enableGrid, req.body.enableDoubleTable, req.body.enableTimeStamp,
        req.body.databasePath], function (err) {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        else {
            res.status(200).json({ status: "success" })
        }
    })
    db.close()
})
app.post("/deleteDatabase", (req, res)=>{
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        console.log("Connected to the database.")
    })
    db.run("DELETE FROM DATABASELIST WHERE ID = ?", [req.body.id], function (err) {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
        }
        else {
            res.status(200).json({ status: "success" })
        }
    })
    db.close()
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
})