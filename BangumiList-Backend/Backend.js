const express = require('express')
const cors = require('cors')
const multer = require('multer')
const database = require("./Database.js")

const app = express()
const port = 3001
const upload = multer({ dest: "fileCache/" })

app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request body

db = new database()
try {
    console.log(db.initMainDB().message)
}
catch (err) {
    console.error(err.message)
}

app.get("/main/info/get", (req, res) => {
    try {
        res.status(200).json(db.getMainDBInfo())
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
})
app.get("/main/get", (req, res) => {
    try{
        res.status(200).json(db.getMainDB())
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
})
app.post("/main/insert", (req, res) => {
    try {
        res.status(200).json(db.insertMainDB(req.body))
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
})
app.post("/main/import", upload.single('file'), (req, res) => {
    try {
        res.status(200).json(db.importMainDB({fileName: req.body.fileName, file: req.file}))
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
})
app.get("/main/export", (req, res) => {
    try {
        res.download(db.exportMainDB(req.query.fileName).filePath, (err) => {
            if(err){
                console.error(err)
                res.status(500).send(err)
            }
        })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
})
app.post("/main/delete", (req, res) => {
    try {
        res.status(200).json(db.deleteMainDB(req.body.id))
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send(err.message)
    }
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
})