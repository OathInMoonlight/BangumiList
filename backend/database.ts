import * as fs from "fs"
import * as path from "path"
import Database, { Database as DatabaseType } from "better-sqlite3"
import { Column, DatabaseInfo, TableDataRow, TableData, DatabaseData } from "./types.js"
import { dbInfoTableInfo, infoTableInfo } from "./initialInfo.js"

class DatabaseOpration {
    private dbPath: string
    private db: DatabaseType | null = null
    private dbInfoTableName: string = "DATABASE_INFO"

    private infoTable1Name: string = "INFO_TABLE_1"
    private infoTable2Name: string = "INFO_TABLE_2"
    private table1Name: string = "TABLE_1"
    private table2Name: string = "TABLE_2"

    constructor(dbPath: string) {
        this.dbPath = path.join(dbPath)
    }
    // 数据库操作
    detectDatabase(): boolean {
        return fs.existsSync(this.dbPath)
    }
    createDatabase(dbInfo: DatabaseInfo): void {
        if(this.detectDatabase()) {
            throw new Error(`Database ${this.dbPath} already exists.`)
        }
        try {
            this.db = new Database(this.dbPath)
            // 创建数据库元数据表
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.dbInfoTableName} (` +
                Object.values(dbInfoTableInfo).map(column => `${column.key} ${column.dataType}`).join(", ")
            + ")").run()
            const dbInfoTableCol = [ dbInfo.gridView, dbInfo.doubleTable,
                dbInfo.timeStamp, dbInfo.firstStamp, dbInfo.secondStamp ]
            this.db.prepare(`INSERT INTO ${this.dbInfoTableName} VALUES (?, ?, ?, ?, ?)`).run(...dbInfoTableCol)
            // 创建表1元数据表
            const infoTableCol = Object.values(infoTableInfo)
                .map(column => `${column.key} ${column.dataType}`).join(", ")
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.infoTable1Name} (${infoTableCol})`).run()
            // 插入表1元数据
            const placeholders = Object.keys(infoTableInfo).map(() => "?").join(", ")
            const insertInfoTable1Transact = this.db.prepare(`INSERT INTO ${this.infoTable1Name} VALUES (${placeholders})`)
            const table1InfoCol = Object.values(dbInfo.table1Info)
            for(const column of table1InfoCol) {
                const columnValues = Object.values(column)
                columnValues[0] = null
                insertInfoTable1Transact.run(
                    ...(columnValues.map(value => typeof value === "object" ? JSON.stringify(value) : value))
                )
            }
            // 创建表1
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.table1Name} (` +
                table1InfoCol.map(column => `${column.key} ${column.dataType} ${
                    column.key === "id" ? "PRIMARY KEY AUTOINCREMENT" : "NOT NULL"}`).join(", ")
            + ")").run()
            // 创建表2元数据表
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.infoTable2Name} (${infoTableCol})`).run()
            // 插入表2元数据
            const insertInfoTable2Transact = this.db.prepare(`INSERT INTO ${this.infoTable2Name} VALUES (${placeholders})`)
            const table2InfoCol = Object.values(dbInfo.table2Info)
            for(const column of table2InfoCol) {
                const columnValues = Object.values(column)
                columnValues[0] = null
                insertInfoTable2Transact.run(
                    ...(columnValues.map(value => typeof value === "object" ? JSON.stringify(value) : value))
                )
            }
            // 创建表2
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.table2Name} (` +
                table2InfoCol.map(column => `${column.key} ${column.dataType} ${
                    column.key === "id" ? "PRIMARY KEY AUTOINCREMENT" : "NOT NULL"}`).join(", ")
            + ")").run()
        }
        catch (error) {
            throw new Error(`Error when creating database ${this.dbPath}.\n${error}`)
        }
    }
    openDatabase(): void {
        if (!this.detectDatabase()) {
            throw new Error(`Database ${this.dbPath} does not exist.`)
        }
        try {
            this.db = new Database(this.dbPath, { fileMustExist: true })
        }
        catch (error) {
            throw new Error(`Error when opening database ${this.dbPath}.\n${error}`)
        }
    }
    updateDatabase(dbInfo: DatabaseInfo): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            // 更新数据库元数据表
            this.db.prepare(`UPDATE ${this.dbInfoTableName} SET ${
                Object.values(dbInfoTableInfo).map(column => `${column.key} = ?`).join(", ")
            }`).run(dbInfo.gridView, dbInfo.doubleTable,
                dbInfo.timeStamp, dbInfo.firstStamp, dbInfo.secondStamp)
            // 更新表1元数据 
            const table1Columns = this.db.prepare(`SELECT * FROM ${this.infoTable1Name}`).all() as Column[]
            const originalTable1Columns = new Map(table1Columns.map(column => [ column.id, column ]))
            const newTable1Columns = new Map(Object.values(dbInfo.table1Info).map(column => [ column.id, column ]))
            const infoTableCol = Object.values(infoTableInfo).map(column => `${column.key} = ?`).join(", ")
            const updateInfoTable1Transact = this.db.prepare(`UPDATE ${this.infoTable1Name} SET ${infoTableCol} WHERE id = ?`)
            const renameTable1Transact = this.db.prepare(`ALTER TABLE ${this.table1Name} RENAME COLUMN ? TO ?`)
            const deleteInfoTable1Transact = this.db.prepare(`DELETE FROM ${this.infoTable1Name} WHERE id = ?`)
            const dropTable1Transact = this.db.prepare(`ALTER TABLE ${this.table1Name} DROP COLUMN ?`)
            const placeholders = Object.keys(infoTableInfo).map(() => "?").join(", ")
            const insertInfoTable1Transact = this.db.prepare(`INSERT INTO ${this.infoTable1Name} VALUES (${placeholders})`)
            const addTable1Transact = this.db.prepare(`ALTER TABLE ${this.table1Name} ADD COLUMN ? ?`)
            for(const [ id, column ] of originalTable1Columns) {
                if(newTable1Columns.has(id)) {
                    const newColumn = newTable1Columns.get(id)
                    if(JSON.stringify(column) !== JSON.stringify(newColumn)) {
                        updateInfoTable1Transact.run(
                            ...(Object.values(newColumn).map(value => typeof value === "object" ? JSON.stringify(value) : value)), id
                        )
                        if(column.key !== newColumn.key) {
                            renameTable1Transact.run(column.key, newColumn.key)
                        }
                    }
                }
                else {
                    deleteInfoTable1Transact.run(id)
                    dropTable1Transact.run(column.key)
                }
            }
            for(const [ id, column ] of newTable1Columns) {
                if(!originalTable1Columns.has(id)) {
                    const columnValues = Object.values(column)
                    columnValues[0] = null
                    insertInfoTable1Transact.run(
                        ...(Object.values(column).map(value => typeof value === "object" ? JSON.stringify(value) : value))
                    )
                    addTable1Transact.run(column.key, column.dataType)
                }
            }
            // 更新表2元数据
            const table2Columns = this.db.prepare(`SELECT * FROM ${this.infoTable2Name}`).all() as Column[]
            const originalTable2Columns = new Map(table2Columns.map(column => [ column.id, column ]))
            const newTable2Columns = new Map(Object.values(dbInfo.table2Info).map(column => [ column.id, column ]))
            const updateInfoTable2Transact = this.db.prepare(`UPDATE ${this.infoTable2Name} SET ${infoTableCol} WHERE id = ?`)
            const renameTable2Transact = this.db.prepare(`ALTER TABLE ${this.table2Name} RENAME COLUMN ? TO ?`)
            const deleteInfoTable2Transact = this.db.prepare(`DELETE FROM ${this.infoTable2Name} WHERE id = ?`)
            const dropTable2Transact = this.db.prepare(`ALTER TABLE ${this.table2Name} DROP COLUMN ?`)
            const insertInfoTable2Transact = this.db.prepare(`INSERT INTO ${this.infoTable2Name} VALUES (${placeholders})`)
            const addTable2Transact = this.db.prepare(`ALTER TABLE ${this.table2Name} ADD COLUMN ? ?`)
            for(const [ id, column ] of originalTable2Columns) {
                if(newTable2Columns.has(id)) {
                    const newColumn = newTable2Columns.get(id)
                    if(JSON.stringify(column) !== JSON.stringify(newColumn)) {
                        updateInfoTable2Transact.run(
                            ...(Object.values(newColumn).map(value => typeof value === "object" ? JSON.stringify(value) : value)), id
                        )
                        if(column.key !== newColumn.key) {
                            renameTable2Transact.run(column.key, newColumn.key)
                        }
                    }
                }
                else {
                    deleteInfoTable2Transact.run(id)
                    dropTable2Transact.run(column.key)
                }
            }
            for(const [ id, column ] of newTable2Columns) {
                if(!originalTable2Columns.has(id)) {
                    const columnValues = Object.values(column)
                    columnValues[0] = null
                    insertInfoTable2Transact.run(
                        ...(Object.values(column).map(value => typeof value === "object" ? JSON.stringify(value) : value))
                    )
                    addTable2Transact.run(column.key, column.dataType)
                }
            }
        }
        catch (error) {
            throw new Error(`Error when updating database ${this.dbPath}.\n${error}`)
        }
    }
    closeDatabase(): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            this.db.close()
        }
        catch (error) {
            throw new Error(`Error when closing database ${this.dbPath}.\n${error}`)
        }
    }
    getDatabaseInfo(): DatabaseInfo {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            const dbInfo = {} as DatabaseInfo
            const dbPathInfo = path.parse(this.dbPath)
            dbInfo.dbName = dbPathInfo.name
            dbInfo.dbPath = dbPathInfo.dir
            const dbInfoRow = this.db.prepare(`SELECT * FROM ${this.dbInfoTableName}`).get() as { [ key: string ]: unknown }
            dbInfo.gridView = dbInfoRow.gridView ? true : false
            dbInfo.doubleTable = dbInfoRow.doubleTable ? true : false
            dbInfo.timeStamp = dbInfoRow.timeStamp ? true : false
            dbInfo.firstStamp = dbInfoRow.firstStamp as string
            dbInfo.secondStamp = dbInfoRow.secondStamp as string
            const table1Info = this.db.prepare(`SELECT * FROM ${this.infoTable1Name}`).all() as Column[]
            for(const column of table1Info) {
                column.text = JSON.parse(column.text as string) as { "zh": string, "ja": string, "en": string }
                dbInfo.table1Info[column.id] = column
            }
            const table2Info = this.db.prepare(`SELECT * FROM ${this.infoTable2Name}`).all() as Column[]
            for(const column of table2Info) {
                column.text = JSON.parse(column.text as string) as { "zh": string, "ja": string, "en": string }
                dbInfo.table2Info[column.id] = column
            }
            return dbInfo
        }
        catch (error) {
            throw new Error(`Error when getting database info from ${this.dbPath}.\n${error}`)
        }
    }
    // 数据操作
    getData(): DatabaseData {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            const dbData = {
                ...this.getDatabaseInfo(),
                table1Data: {} as TableData,
                table2Data: {} as TableData
            } as DatabaseData
            const table1Data = this.db.prepare(`SELECT * FROM ${this.table1Name}`).all() as TableDataRow[]
            for(const row of table1Data) {
                dbData.table1Data[row.id as number] = row
            }
            const table2Data = this.db.prepare(`SELECT * FROM ${this.table2Name}`).all() as TableDataRow[]
            for(const row of table2Data) {
                dbData.table2Data[row.id as number] = row
            }
            return dbData
        }
        catch (error) {
            throw new Error(`Error when getting database data from ${this.dbPath}.\n${error}`)
        }
    }
    convertDataType(value: unknown): unknown {
        if(Array.isArray(value)) {
            return JSON.stringify(value)
        }
        if(typeof value === "object") {
            return JSON.stringify(value)
        }
        if(typeof value === "boolean") {
            return value ? 1 : 0
        }
        return value
    }
    insertData(isTable1: boolean, newRows: TableDataRow[]): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        const tableName = isTable1 ? this.table1Name : this.table2Name
        try {
            const placeholders = Object.keys(newRows[0]).map(() => "?").join(", ")
            const insertTransact = this.db.prepare(`INSERT INTO ${tableName} VALUES (${placeholders})`)
            for(const newRow of newRows) {
                const rowValues = Object.values(newRow)
                rowValues[0] = null
                insertTransact.run(
                    ...(rowValues.map(this.convertDataType))
                )
            }
        }
        catch (error) {
            throw new Error(`Error when inserting data into ${tableName} of ${this.dbPath}.\n${error}`)
        }
    }
    deleteData(isTable1: boolean, rowId: number): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        const tableName = isTable1 ? this.table1Name : this.table2Name
        try {
            this.db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(rowId)
        }
        catch (error) {
            throw new Error(`Error when deleting data from ${tableName} of ${this.dbPath}.\n${error}`)
        }
    }
    updateData(isTable1: boolean, newRow: TableDataRow): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        const tableName = isTable1 ? this.table1Name : this.table2Name
        try {
            const setClause = Object.keys(newRow).map(key => `${key} = ?`).join(", ")
            this.db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`).run(
                ...(Object.values(newRow).map(this.convertDataType)), newRow.id
            )
        }
        catch (error) {
            throw new Error(`Error when updating data of ${tableName} of ${this.dbPath}.\n${error}`)
        }
    }
}