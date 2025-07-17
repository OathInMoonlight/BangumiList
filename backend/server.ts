import * as fs from "fs"
import * as path from "path"
import express from "express"
import cors from "cors"
import multer from "multer"
import { DatabaseManager } from "./database.js"
import { TableDataRow } from "./types.js"

// 初始化网络服务
const app = express()
const port = 3001
const fileCachePath = path.join(path.resolve(), "fileCache")
if(!fs.existsSync(fileCachePath)) {
    fs.mkdirSync(fileCachePath)
}
const upload = multer({ dest: fileCachePath })
app.use(cors({
    origin: "http://localhost:3000",
    methods: [ "GET", "POST" ]
}))
app.use(express.json())

// 初始化数据库
const dbManager = new DatabaseManager()
try {
    dbManager.initMainDB()
    console.log("Main database is ready.")
}
catch (error) {
    console.error(error)
}

// 路由定义
app.get("/main/getInfo", (req, res) => {
    try {
        res.status(200).json(dbManager.getMainDBInfo())
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.get("/main/getData", (req, res) => {
    try{
        res.status(200).json(dbManager.getMainDBData())
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/insert", (req, res) => {
    try {
        res.status(200).json(dbManager.insertMainDB(req.body))
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/import", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded.")
            return
        }
        res.status(200).json(dbManager.importMainDB(req.body.fileName, req.file.path))
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.get("/main/export", (req, res) => {
    try {
        res.download(dbManager.exportMainDB(req.query.fileName as string), (error) => {
            if(error) {
                res.status(500).send(error)
            }
        })
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/delete", (req, res) => {
    try {
        res.status(200).json(dbManager.deleteMainDB(req.body.dbMainInfo, req.body.ifDeleteFile))
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/update", (req, res) => {
    try {
        res.status(200).json(dbManager.updateMainDB(req.body.dbMainInfo, req.body.newDBInfo))
    }
    catch (error) {
        res.status(500).send(error)
    }
})
app.get("/user/getInfo", (req, res) => {
    try {
        res.status(200).json(dbManager.getUserDBInfo(req.query.dbMainInfo as TableDataRow))
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
})