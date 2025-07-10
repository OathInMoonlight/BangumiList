import * as fs from "fs"
import * as path from "path"
import * as sqlite from "better-sqlite3"
import mainInfo from "./mainInfo"

class Database {
    private dbPath: string
    private db: sqlite.Database | null = null
    private databaseInfoTableName: string = "DATABASE_INFO"

    private infoTable1Name: string = "INFO_TABLE_1"
    private infoTable2Name: string = "INFO_TABLE_2"
    private table1Name: string = "TABLE_1"
    private table2Name: string = "TABLE_2"
    private table1Columns: string[] = []
    private table2Columns: string[] = []

    constructor(dbPath: string) {
        this.dbPath = path.join(dbPath)
    }
    detectDatabase(): boolean {
        return fs.existsSync(this.dbPath)
    }
}