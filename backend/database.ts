import * as fs from "fs"
import * as path from "path"
import Database, { Database as DatabaseType } from "better-sqlite3"
import type { Column, TableInfo, TimeStampType, DatabaseInfo,
    TableDataRow, MainDataRow, TableData, SortOrder, DatabaseData } from "./types.js"
import { dbInfoTableInfo, defaultSort, infoTableInfo, mainInfo } from "./initialInfo.js"

class DatabaseOpration {
    private dbPath: string
    private db: DatabaseType | null = null
    private dbInfoTableName: string = "DATABASE_INFO"

    private infoTable1Name: string = "INFO_TABLE_1"
    private infoTable2Name: string = "INFO_TABLE_2"
    private dataTableName: string = "DATA_TABLE"

    constructor(dbPath: string) {
        this.dbPath = path.join(dbPath)
    }
    convertDataType(value: unknown): unknown {
        if(value === null) {
            return null
        }
        if(Array.isArray(value) || typeof value === "object") {
            return JSON.stringify(value)
        }
        if(typeof value === "boolean") {
            return value ? 1 : 0
        }
        return value
    }
    inverseConvertDataType(value: unknown, dataType: null | "array" | "object" | "boolean"): unknown {
        if(value === null) {
            return null
        }
        if(dataType === "array" || dataType === "object") {
            return JSON.parse(value as string)
        }
        if(dataType === "boolean") {
            return (value as number) === 1
        }
        return value
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
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.dbInfoTableName} (${
                dbInfoTableInfo.map(column => `${column.key} ${column.dataType}`).join(", ")
            })`).run()
            const dbInfoTableCol = [ this.convertDataType(dbInfo.gridView), this.convertDataType(dbInfo.doubleTable),
                this.convertDataType(dbInfo.timeStamp), defaultSort, defaultSort, defaultSort, defaultSort ]
            this.db.prepare(`INSERT INTO ${this.dbInfoTableName} VALUES (?, ?, ?, ?, ?)`).run(...dbInfoTableCol)
            // 创建表1元数据表
            const infoTableCol = infoTableInfo.map(column => `${column.key} ${column.dataType}`).join(", ")
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.infoTable1Name} (${infoTableCol})`).run()
            // 插入表1元数据
            const placeholders = infoTableInfo.map(() => "?").join(", ")
            const insertInfoTable1Transact = this.db.prepare(`INSERT INTO ${this.infoTable1Name} VALUES (${placeholders})`)
            for(const column of dbInfo.table1Info) {
                const columnValues = Object.values(column)
                columnValues[0] = null
                insertInfoTable1Transact.run(...(columnValues.map(this.convertDataType)))
            }
            // 创建表2元数据表
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.infoTable2Name} (${infoTableCol})`).run()
            // 插入表2元数据
            const insertInfoTable2Transact = this.db.prepare(`INSERT INTO ${this.infoTable2Name} VALUES (${placeholders})`)
            for(const column of dbInfo.table2Info) {
                const columnValues = Object.values(column)
                columnValues[0] = null
                insertInfoTable2Transact.run(...(columnValues.map(this.convertDataType)))
            }
            // 创建数据表
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.dataTableName} (${
                dbInfo.table1Info.map(column => `${column.key} ${column.dataType}`).join(", ")
            })`).run()
        } catch (error) {
            throw new Error(`Error when creating database ${this.dbPath}.\n${error}`)
        }
    }
    openDatabase(): void {
        if (!this.detectDatabase()) {
            throw new Error(`Database ${this.dbPath} does not exist.`)
        }
        try {
            this.db = new Database(this.dbPath, { fileMustExist: true })
        } catch (error) {
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
                dbInfoTableInfo.slice(0,3).map(column => `${column.key} = ?`).join(", ")
            }`).run(this.convertDataType(dbInfo.gridView),
                this.convertDataType(dbInfo.doubleTable), this.convertDataType(dbInfo.timeStamp))
            // 更新表1元数据 
            const table1Columns = this.db.prepare(`SELECT * FROM ${this.infoTable1Name}`).all() as TableInfo
            const originalTable1Columns = new Map(table1Columns.map(column => [ column.id, column ]))
            const newTable1Columns = new Map(dbInfo.table1Info.map(column => [ column.id, column ]))

            const infoTableCol = infoTableInfo.slice(1).map(column => `${column.key} = ?`).join(", ")
            const updateInfoTable1Transact = this.db.prepare(`UPDATE ${this.infoTable1Name} SET ${infoTableCol} WHERE id = ?`)
            const renameTable1Transact = this.db.prepare(`ALTER TABLE ${this.dataTableName} RENAME COLUMN ? TO ?`)

            const deleteInfoTable1Transact = this.db.prepare(`DELETE FROM ${this.infoTable1Name} WHERE id = ?`)
            const dropTable1Transact = this.db.prepare(`ALTER TABLE ${this.dataTableName} DROP COLUMN ?`)

            const placeholders = infoTableInfo.map(() => "?").join(", ")
            const insertInfoTable1Transact = this.db.prepare(`INSERT INTO ${this.infoTable1Name} VALUES (${placeholders})`)
            const addTable1Transact = this.db.prepare(`ALTER TABLE ${this.dataTableName} ADD COLUMN ? ?`)

            for(const [ id, column ] of originalTable1Columns) {
                if(newTable1Columns.has(id)) {
                    const newColumn = newTable1Columns.get(id) as Column
                    if(JSON.stringify(column) !== JSON.stringify(newColumn)) {
                        updateInfoTable1Transact.run(...(Object.values(newColumn).slice(1).map(this.convertDataType)), id)
                        if(column.key !== newColumn.key) {
                            renameTable1Transact.run(column.key, newColumn.key)
                        }
                        if(column.dataType !== newColumn.dataType) {
                            throw new Error(`Cannot change data type of column ${column.key} in infoTable 1.`)
                        }
                    }
                } else {
                    deleteInfoTable1Transact.run(id)
                    dropTable1Transact.run(column.key)
                }
            }
            for(const [ id, column ] of newTable1Columns) {
                if(!originalTable1Columns.has(id)) {
                    const columnValues = Object.values(column)
                    columnValues[0] = null
                    insertInfoTable1Transact.run(...(Object.values(column).map(this.convertDataType)))
                    addTable1Transact.run(column.key, column.dataType)
                }
            }
            // 更新表2元数据
            const table2Columns = this.db.prepare(`SELECT * FROM ${this.infoTable2Name}`).all() as TableInfo
            const originalTable2Columns = new Map(table2Columns.map(column => [ column.id, column ]))
            const newTable2Columns = new Map(dbInfo.table2Info.map(column => [ column.id, column ]))

            const updateInfoTable2Transact = this.db.prepare(`UPDATE ${this.infoTable2Name} SET ${infoTableCol} WHERE id = ?`)
            const renameTable2Transact = this.db.prepare(`ALTER TABLE ${this.dataTableName} RENAME COLUMN ? TO ?`)

            const deleteInfoTable2Transact = this.db.prepare(`DELETE FROM ${this.infoTable2Name} WHERE id = ?`)
            const dropTable2Transact = this.db.prepare(`ALTER TABLE ${this.dataTableName} DROP COLUMN ?`)

            const insertInfoTable2Transact = this.db.prepare(`INSERT INTO ${this.infoTable2Name} VALUES (${placeholders})`)
            const addTable2Transact = this.db.prepare(`ALTER TABLE ${this.dataTableName} ADD COLUMN ? ?`)

            for(const [ id, column ] of originalTable2Columns) {
                if(newTable2Columns.has(id)) {
                    const newColumn = newTable2Columns.get(id) as Column
                    if(JSON.stringify(column) !== JSON.stringify(newColumn)) {
                        updateInfoTable2Transact.run(...(Object.values(newColumn).slice(1).map(this.convertDataType)), id)
                        if(column.key !== newColumn.key) {
                            renameTable2Transact.run(column.key, newColumn.key)
                        }
                        if(column.dataType !== newColumn.dataType) {
                            throw new Error(`Cannot change data type of column ${column.key} in infoTable 2.`)
                        }
                    }
                } else {
                    deleteInfoTable2Transact.run(id)
                    dropTable2Transact.run(column.key)
                }
            }
            for(const [ id, column ] of newTable2Columns) {
                if(!originalTable2Columns.has(id)) {
                    const columnValues = Object.values(column)
                    columnValues[0] = null
                    insertInfoTable2Transact.run(...(Object.values(column).map(this.convertDataType)))
                    addTable2Transact.run(column.key, column.dataType)
                }
            }
        } catch (error) {
            throw new Error(`Error when updating database ${this.dbPath}.\n${error}`)
        }
    }
    closeDatabase(): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            this.db.close()
        } catch (error) {
            throw new Error(`Error when closing database ${this.dbPath}.\n${error}`)
        }
    }
    getDatabaseInfo(): DatabaseInfo {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            const dbInfo = {} as DatabaseInfo
            dbInfo.dbName = path.parse(this.dbPath).name
            dbInfo.dbPath = this.dbPath
            const dbInfoRow = this.inverseConvertDataType(
                this.db.prepare(`SELECT * FROM ${this.dbInfoTableName}`).get(), "object") as {
                gridView: boolean, doubleTable: boolean, timeStamp: TimeStampType,
                sort1: SortOrder, groupSort1: SortOrder, sort2: SortOrder, groupSort2: SortOrder
            }
            dbInfo.gridView = dbInfoRow.gridView
            dbInfo.doubleTable = dbInfoRow.doubleTable
            dbInfo.timeStamp = dbInfoRow.timeStamp
            dbInfo.table1Info = this.db.prepare(`SELECT * FROM ${this.infoTable1Name}`).all() as TableInfo // 考虑到性能开销，放弃反序列化text字段
            dbInfo.table2Info = this.db.prepare(`SELECT * FROM ${this.infoTable2Name}`).all() as TableInfo
            return dbInfo
        } catch (error) {
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
                tableData: {} as TableData,
                sort1: defaultSort,
                groupSort1: defaultSort,
                sort2: defaultSort,
                groupSort2: defaultSort
            } as DatabaseData
            dbData.tableData = this.db.prepare(`SELECT * FROM ${this.dataTableName}`).all() as TableData // 考虑到性能开销，放弃反序列化
            const dbInfoRow = this.inverseConvertDataType(
                this.db.prepare(`SELECT * FROM ${this.dbInfoTableName}`).get(), "object") as {
                gridView: boolean, doubleTable: boolean, timeStamp: TimeStampType,
                sort1: SortOrder, groupSort1: SortOrder, sort2: SortOrder, groupSort2: SortOrder
            }
            dbData.sort1 = dbInfoRow.sort1
            dbData.groupSort1 = dbInfoRow.groupSort1
            dbData.sort2 = dbInfoRow.sort2
            dbData.groupSort2 = dbInfoRow.groupSort2
            return dbData
        } catch (error) {
            throw new Error(`Error when getting database data from ${this.dbPath}.\n${error}`)
        }
    }
    updateSortInfo(sort1: SortOrder, groupSort1: SortOrder, sort2: SortOrder, groupSort2: SortOrder) {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            this.db.prepare(`UPDATE ${this.dbInfoTableName} SET ${
                Object.values(dbInfoTableInfo).slice(3).map(column => `${column.key} = ?`).join(", ")
            }`).run(sort1, groupSort1, sort2, groupSort2)
        } catch (error) {
            throw new Error(`Error when updating sort info in database ${this.dbPath}.\n${error}`)
        }
    }
    insertData(newRows: TableData): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            const placeholders = Object.keys(newRows[0]).map(() => "?").join(", ")
            const insertTransact = this.db.prepare(`INSERT INTO ${this.dataTableName} VALUES (${placeholders})`)
            for(const newRow of newRows) {
                const rowValues = Object.values(newRow)
                rowValues[0] = null
                insertTransact.run(...(rowValues.map(this.convertDataType)))
            }
        } catch (error) {
            throw new Error(`Error when inserting data into ${this.dataTableName} of ${this.dbPath}.\n${error}`)
        }
    }
    deleteData(rowId: number): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            this.db.prepare(`DELETE FROM ${this.dataTableName} WHERE id = ?`).run(rowId)
        } catch (error) {
            throw new Error(`Error when deleting data from ${this.dataTableName} of ${this.dbPath}.\n${error}`)
        }
    }
    updateData(newRow: TableDataRow): void {
        if (this.db === null) {
            throw new Error(`Database ${this.dbPath} is null.`)
        }
        try {
            const setClause = Object.keys(newRow).slice(1).map(key => `${key} = ?`).join(", ")
            this.db.prepare(`UPDATE ${this.dataTableName} SET ${setClause} WHERE id = ?`).run(
                ...(Object.values(newRow).slice(1).map(this.convertDataType)), newRow[0]
            )
        } catch (error) {
            throw new Error(`Error when updating data of ${this.dataTableName} of ${this.dbPath}.\n${error}`)
        }
    }
}

export class DatabaseManager {
    private databasePath: string = path.join(path.resolve(), "databases")
    private mainDB: DatabaseOpration
    private userDB: DatabaseOpration | null = null

    constructor() {
        if(!fs.existsSync(this.databasePath)) {
            fs.mkdirSync(this.databasePath)
        }
        this.mainDB = new DatabaseOpration(path.join(path.resolve(), "main.db"))
    }
    // 主数据库业务
    initMainDB(): void {
        try {
            if(!this.mainDB.detectDatabase()) {
                this.mainDB.createDatabase(mainInfo)
                this.mainDB.closeDatabase()
            }
        } catch (error) {
            throw new Error(`Error when initializing main database.\n${error}`)
        }
    }
    getMainDBInfo(): DatabaseInfo {
        try {
            this.mainDB.openDatabase()
            const mainDBInfo = this.mainDB.getDatabaseInfo()
            this.mainDB.closeDatabase()
            return mainDBInfo
        } catch (error) {
            throw new Error(`Error when getting main database info.\n${error}`)
        }
    }
    getMainDBData(): DatabaseData {
        try {
            this.mainDB.openDatabase()
            const mainDBData = this.mainDB.getData()
            this.mainDB.closeDatabase()
            return mainDBData
        } catch (error) {
            throw new Error(`Error when getting main database data.\n${error}`)
        }
    }
    insertMainDB(newDBInfo: DatabaseInfo): void {
        try {
            const dbPath = path.join(this.databasePath, newDBInfo.dbPath)
            this.userDB = new DatabaseOpration(dbPath)
            if(this.userDB.detectDatabase()) {
                throw new Error(`File of database ${newDBInfo.dbName} already exists.`)
            }
            this.userDB.createDatabase(newDBInfo)
            this.userDB.closeDatabase()
            this.mainDB.openDatabase()
            this.mainDB.insertData([ { 0: null, 1: newDBInfo.dbName, 2: newDBInfo.dbPath } ])
            this.mainDB.closeDatabase()
        } catch (error) {
            throw new Error(`Error when inserting data into main database.\n${error}`)
        }
    }
    importMainDB(fileName: string, tmpFilePath: string): void {
        try {
            const newFilePath = path.join(this.databasePath, fileName + ".db")
            if(fs.existsSync(newFilePath)) {
                throw new Error(`File of database ${fileName} already exists.`)
            }
            fs.renameSync(tmpFilePath, newFilePath)
            this.mainDB.openDatabase()
            this.mainDB.insertData([ { 0: null, 1: fileName, 2: fileName + ".db" } ])
            this.mainDB.closeDatabase()
        } catch (error) {
            throw new Error(`Error when importing database ${fileName}.\n${error}`)
        }
    }
    exportMainDB(fileName: string): string {
        try {
            const filePath = path.join(this.databasePath, fileName + ".db")
            if(!fs.existsSync(filePath)) {
                throw new Error(`File of database ${fileName} does not exist.`)
            }
            return filePath
        } catch (error) {
            throw new Error(`Error when exporting database ${fileName}.\n${error}`)
        }
    }
    deleteMainDB(mainDataRow: MainDataRow, ifDeleteFile: boolean): void {
        try {
            this.mainDB.openDatabase()
            this.mainDB.deleteData(mainDataRow[0] as number)
            this.mainDB.closeDatabase()
            if(ifDeleteFile) {
                const filePath = path.join(this.databasePath, mainDataRow[2])
                if(fs.existsSync(filePath)) {
                    fs.rmSync(filePath)
                } else {
                    throw new Error(`File of database ${filePath} does not exist.`)
                }
            }
        } catch (error) {
            throw new Error(`Error when deleting database ${mainDataRow[1]}.\n${error}`)
        }
    }
    updateMainDB(mainDataRow: MainDataRow, newDBInfo: DatabaseInfo): void {
        try {
            const dbPath = path.join(this.databasePath, newDBInfo.dbPath)
            const ifNameChanged = mainDataRow[1] !== newDBInfo.dbName
            const oldDBPath = path.join(this.databasePath, mainDataRow[2])
            if(ifNameChanged) {
                if(!fs.existsSync(oldDBPath)) {
                    throw new Error(`Old database ${oldDBPath} does not exist.`)
                }
                fs.renameSync(oldDBPath, dbPath)
            }
            this.userDB = new DatabaseOpration(dbPath)
            if(!this.userDB.detectDatabase()) {
                throw new Error(`File of database ${newDBInfo.dbName} does not exist.`)
            }
            this.userDB.openDatabase()
            this.userDB.updateDatabase(newDBInfo)
            this.userDB.closeDatabase()
            if(ifNameChanged) {
                this.mainDB.openDatabase()
                this.mainDB.updateData({
                    0: mainDataRow[0],
                    1: newDBInfo.dbName,
                    2: newDBInfo.dbPath
                })
                this.mainDB.closeDatabase()
            }
        } catch (error) {
            throw new Error(`Error when updating database ${newDBInfo.dbName}.\n${error}`)
        }
    }
    // 用户数据库业务
    getUserDBInfo(mainDataRow: MainDataRow): DatabaseInfo {
        try {
            const dbPath = path.join(this.databasePath, mainDataRow[2])
            this.userDB = new DatabaseOpration(dbPath)
            this.userDB.openDatabase()
            const userDBInfo = this.userDB.getDatabaseInfo()
            this.userDB.closeDatabase()
            return userDBInfo
        } catch (error) {
            throw new Error(`Error when getting user database ${mainDataRow[1]} info.\n${error}`)
        }
    }
}