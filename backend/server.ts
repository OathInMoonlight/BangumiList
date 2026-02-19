import * as fs from "fs"
import * as path from "path"
import express from "express"
import cors from "cors"
import multer from "multer"
import { DatabaseManager } from "./database.js"
import type { MainDataRow } from "./types.js"

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
} catch (error) {
    console.error(error)
}

// 路由定义
app.get("/main/getInfo", (req, res) => {
    try {
        res.status(200).json(dbManager.getMainDBInfo())
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get("/main/getData", (req, res) => {
    try{
        res.status(200).json(dbManager.getMainDBData())
    } catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/insert", (req, res) => {
    try {
        dbManager.insertMainDB(req.body)
        res.status(200)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/import", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded.")
            return
        }
        dbManager.importMainDB(req.file.filename, req.file.path)
        res.status(200)
    } catch (error) {
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
    } catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/delete", (req, res) => {
    try {
        dbManager.deleteMainDB(req.body.mainDataRow, req.body.ifDeleteFile)
        res.status(200)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.post("/main/update", (req, res) => {
    try {
        dbManager.updateMainDB(req.body.mainDataRow, req.body.newDBInfo)
        res.status(200)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get("/user/getInfo", (req, res) => {
    try {
        res.status(200).json(dbManager.getUserDBInfo(
            JSON.parse(req.query.mainDataRow as string) as MainDataRow))
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
})