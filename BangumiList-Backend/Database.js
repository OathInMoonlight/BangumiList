const fs = require("fs")
const path = require("path")
const sqlite = require("better-sqlite3")
const tableInfo = require("./tableInfo.js")

class Database {
    constructor(dbPath) {
        this.dbPath = path.join(__dirname, dbPath)
        this.db = null
        this.infoTable0Name = "INFOTABLE0"

        this.infoTable1Name = "INFOTABLE1"
        this.infoTable2Name = "INFOTABLE2"
        this.table1Name = "FIRSTTABLE"
        this.table2Name = "SECONDTABLE"
        this.table1Columns = []
        this.table2Columns = []
    }
    detectDatabase() {
        return fs.existsSync(this.dbPath)
    }
    createDatabase(databaseInfo) {
        if (this.detectDatabase()) {
            throw { status: "Error", message: "Database \${this.dbPath} already exists." }
        }
        try {
            this.db = new sqlite(this.dbPath) // 创建新数据库
            this.db.prepare("CREATE TABLE IF NOT EXISTS " + this.infoTable0Name + " (\
                GRIDVIEW BOOLEAN NOT NULL,\
                DOUBLETABLE BOOLEAN NOT NULL,\
                TIMESTAMP BOOLEAN NOT NULL,\
                FIRSTTIMESTAMP TEXT,\
                SECONDTIMESTAMP TEXT)").run()
            this.db.prepare("INSERT INTO " + this.infoTable0Name + " VALUES (?, ?, ?, ?, ?)").run([...Object.values(databaseInfo)])
            return { status: "Success", message: "Database " + this.dbPath + " has been created." }
        }
        catch (err) {
            throw { status: "Error", message: "Error creating database " + this.dbPath + "\n" + err }
        }
    }
    openDatabase(has_inner = false) {
        if (!this.detectDatabase()) {
            throw { status: "Error", message: "Database " + this.dbPath + " does not exist." }
        }
        try {
            this.db = new sqlite(this.dbPath, { fileMustExist: true }) // 打开数据库
            this.table1Columns = this.db.prepare("SELECT KEYS FROM " + this.infoTable1Name + " ORDER BY ID ASC").all()
                .map(value => value["KEYS"]) // 获取表1的列名
            if (has_inner) {
                this.table2Columns = this.db.prepare("SELECT KEYS FROM " + this.infoTable2Name + " ORDER BY ID ASC").all()
                    .map(value => value["KEYS"]) // 获取表2的列名
            }
            return { status: "Success", message: "Database " + this.dbPath + " has been opened." }
        }
        catch (err) {
            throw { status: "Error", message: "Error opening database " + this.dbPath + "\n" + err }
        }
    }
    updateDatabase(databaseInfo) {
        if (!this.detectDatabase()) {
            throw { status: "Error", message: "Database " + this.dbPath + " does not exist." }
        }
        try {
            this.db.prepare("UPDATE " + this.infoTable0Name + " SET GRIDVIEW = ?, DOUBLETABLE = ?, TIMESTAMP = ?, FIRSTTIMESTAMP = ?, SECONDTIMESTAMP = ?")
                .run([...Object.values(databaseInfo)])
            return { status: "Success", message: "Database " + this.dbPath + " has been updated." }
        }
        catch (err) {
            throw { status: "Error", message: "Error updating database " + this.dbPath + "\n" + err }
        }
    }
    createTable(tableInfo, is_inner = false) {
        try {
            // 储存表的元数据
            const infoTableKeys = Object.keys(tableInfo)
            infoTableKeys.unshift("id")
            const infoTableColumns = infoTableKeys.map(key => { // 计算元数据的列名
                if (key == "id") {
                    return "[" + key.toUpperCase() + "] INTEGER PRIMARY KEY AUTOINCREMENT"
                }
                else if (key == "shownColumns") {
                    return "[" + key.toUpperCase() + "] BOOLEAN NOT NULL"
                }
                else {
                    return "[" + key.toUpperCase() + "] TEXT NOT NULL"
                }
            }).join(", ")
            const infoTableName = is_inner ? this.infoTable2Name : this.infoTable1Name
            this.db.prepare("CREATE TABLE IF NOT EXISTS " + infoTableName + " (" + infoTableColumns + ")").run() // 创建元数据表
            const placeholders = infoTableKeys.map(() => "?").join(", ")
            const insertInfoTransact = this.db.prepare("INSERT INTO " + infoTableName + " VALUES (" + placeholders + ")")
            for (let key of tableInfo.keys) { // 将各列的元数据插入元数据表
                const row = [null] // 第一列是自增ID
                for (let value of Object.values(tableInfo)) {
                    if (Array.isArray(value)) {
                        row.push(key)
                    }
                    else if (typeof value[key] == "object") {
                        row.push(JSON.stringify(value[key]))
                    }
                    else if (typeof value[key] == "boolean") {
                        row.push(value[key] ? 1 : 0)
                    }
                    else {
                        row.push(value[key])
                    }
                }
                insertInfoTransact.run(row)
            }

            // 创建数据表
            const columns = []
            for (let key of tableInfo.keys) { // 计算数据表的列名
                if (key == "id") {
                    columns.push("ID INTEGER PRIMARY KEY AUTOINCREMENT")
                }
                else {
                    columns.push("[" + key.toUpperCase() + "] " + tableInfo.dataType[key] + " NOT NULL")
                }
            }
            if (is_inner) {
                this.table2Columns = this.db.prepare("SELECT KEYS FROM " + infoTableName + " ORDER BY ID ASC").all()
                    .map(value => value["KEYS"]) // 存储表2的列名
            }
            else {
                this.table1Columns = this.db.prepare("SELECT KEYS FROM " + infoTableName + " ORDER BY ID ASC").all()
                    .map(value => value["KEYS"]) // 存储表1的列名
            }
            const tableName = is_inner ? this.table2Name : this.table1Name
            const columnsString = columns.join(", ")
            this.db.prepare("CREATE TABLE IF NOT EXISTS " + tableName + " (" + columnsString + ")").run()
            return { status: "Success", message: "Table " + tableName + " has been created." }
        }
        catch (err) {
            throw { status: "Error", message: "Error creating table " + (is_inner ? this.table2Name : this.table1Name) + "\n" + err }
        }
    }
    alterTable(tableInfo) {
        try {
            const table1columns = this.db.prepare("SELECT ID, KEYS FROM " + this.infoTable1Name + " ORDER BY ID ASC").all()
                .map(row => { return { id: row["ID"], key: row["KEYS"] } })
            for (let oldRow of table1columns) {
                let flag = false
                for (let newRow of tableInfo.userDatabaseColumns) {
                    if (oldRow.id == newRow.id) {
                        flag = true
                        const rowKey = Object.keys(newRow).map(key => (key == "key" ? "KEYS" : key.toUpperCase()) + " = ?").join(", ")
                        const rowValue = Object.values(newRow).map(value => typeof value == "object" ? JSON.stringify(value) : (typeof value == "boolean" ? (value ? 1 : 0) : value))
                        console.log(rowKey, rowValue)
                        this.db.prepare("UPDATE " + this.infoTable1Name + " SET " + rowKey + " WHERE ID = ?").run([...rowValue, oldRow.id])
                        if (newRow.key != oldRow.key) {
                            this.db.prepare("ALTER TABLE " + this.table1Name + " RENAME COLUMN " + oldRow.key + " TO " + newRow.key).run()
                        }
                        newRow.id = null
                        break
                    }
                }
                if (!flag) {
                    this.db.prepare("DELETE FROM " + this.infoTable1Name + " WHERE ID = ?").run(oldRow.id)
                    this.db.prepare("ALTER TABLE " + this.table1Name + " DROP COLUMN " + oldRow.key).run()
                }
            }
            for (let newRow of tableInfo.userDatabaseColumns) {
                if (newRow.id != null) {
                    let placeholders = Object.keys(newRow)
                    placeholders.shift()
                    palaceholders = placeholders.map(() => "?").join(", ")
                    const values = Object.values(newRow)
                    values.shift()
                    this.db.prepare("INSERT INTO " + this.infoTable1Name + " VALUES (" + placeholders + ")").run([...values])
                    const columnDef = newRow.key == "id" ? "ID INTEGER PRIMARY KEY AUTOINCREMENT" :
                        (newRow.dataType == "BOOLEAN" ? "[" + newRow.key.toUpperCase() + "] BOOLEAN NOT NULL" :
                            "[" + newRow.key.toUpperCase() + "] TEXT NOT NULL")
                    this.db.prepare("ALTER TABLE " + this.table1Name + " ADD COLUMN " + columnDef).run()
                }
            }
            if (tableInfo.doubleTable) {
                const table2columns = this.db.prepare("SELECT ID, KEYS FROM " + this.infoTable2Name + " ORDER BY ID ASC").all()
                    .map(row => { return { id: row["ID"], key: row["KEYS"] } })
                for (let oldRow of table2columns) {
                    let flag = false
                    for (let newRow of tableInfo.userDatabaseColumns2) {
                        if (oldRow.id == newRow.id) {
                            flag = true
                            newRow.id = null
                            const rowKey = Object.keys(newRow).map(key => (key == "key" ? "KEYS" : key.toUpperCase()) + " = ?").join(", ")
                            const rowValue = Object.values(newRow).map(value => typeof value == "object" ? JSON.stringify(value) : (typeof value == "boolean" ? (value ? 1 : 0) : value))
                            this.db.prepare("UPDATE " + this.infoTable2Name + " SET " + rowKey + " WHERE ID = ?").run([...rowValue, oldRow.id])
                            if (newRow.key != oldRow.key) {
                                this.db.prepare("ALTER TABLE " + this.table2Name + " RENAME COLUMN " + oldRow.key + " TO " + newRow.key).run()
                            }
                            break
                        }
                    }
                    if (!flag) {
                        this.db.prepare("DELETE FROM " + this.infoTable2Name + " WHERE ID = ?").run(oldRow.id)
                        this.db.prepare("ALTER TABLE " + this.table2Name + " DROP COLUMN " + oldRow.key).run()
                    }
                }
                for (let newRow of tableInfo.userDatabaseColumns2) {
                    if (newRow.id != null) {
                        let placeholders = Object.keys(newRow)
                        placeholders.shift()
                        palaceholders = placeholders.map(() => "?").join(", ")
                        const values = Object.values(newRow)
                        values.shift()
                        this.db.prepare("INSERT INTO " + this.infoTable2Name + " VALUES (" + placeholders + ")").run([...values])
                        const columnDef = newRow.key == "id" ? "ID INTEGER PRIMARY KEY AUTOINCREMENT" :
                            (newRow.dataType == "BOOLEAN" ? "[" + newRow.key.toUpperCase() + "] BOOLEAN NOT NULL" :
                                "[" + newRow.key.toUpperCase() + "] TEXT NOT NULL")
                        this.db.prepare("ALTER TABLE " + this.table2Name + " ADD COLUMN " + columnDef).run()
                    }
                }
            }
            return { status: "Success", message: "Tables of " + this.dbPath + " has been altered." }
        }
        catch (err) {
            throw { status: "Error", message: "Error altering tables of " + this.dbPath + "\n" + err }
        }
    }
    insertData(row, is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            const columns = is_inner ? this.table2Columns : this.table1Columns
            const placeholders = Object.keys(columns).map(() => "?")
            const values = columns.map(column => { // 计算插入数据的值
                let value = row[column]
                if (value == undefined) {
                    return null
                }
                else if (typeof value == "boolean") {
                    return value ? 1 : 0
                }
                else {
                    return value
                }
            })
            this.db.prepare("INSERT INTO " + tableName + " VALUES (" + placeholders + ")").run([...values])
            return { status: "Success", message: "Data has been inserted into table " + tableName }
        }
        catch (err) {
            throw { status: "Error", message: "Error inserting data into table " + (is_inner ? this.table2Name : this.table1Name) + "\n" + err }
        }
    }
    deleteData(rowid, is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            this.db.prepare("DELETE FROM " + tableName + " WHERE ID = ?").run(rowid)
            return { status: "Success", message: "Data has been deleted from table " + tableName }
        }
        catch (err) {
            throw { status: "Error", message: "Error deleting data from table " + (is_inner ? this.table2Name : this.table1Name) + "\n" + err }
        }
    }
    updateData(rowid, row, is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            const setString = Object.keys(row).map(key => key + " = ?").join(", ")
            this.db.prepare("UPDATE " + tableName + " SET " + setString + " WHERE ID = ?").run([...Object.values(row), rowid])
            return { status: "Success", message: "Data has been updated in table " + tableName }
        }
        catch (err) {
            throw { status: "Error", message: "Error updating data in table " + (is_inner ? this.table2Name : this.table1Name) + "\n" + err }
        }
    }
    getData(is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            const rows = this.db.prepare("SELECT * FROM " + tableName).all()
            return { status: "Success", message: "Data has been retrieved from table " + tableName, data: rows }
        }
        catch (err) {
            throw { status: "Error", message: "Error retrieving data from table " + (is_inner ? this.table2Name : this.table1Name) + "\n" + err }
        }
    }
    getInfo() {
        try {
            const settings = this.db.prepare("SELECT * FROM " + this.infoTable0Name).get()
            const rows = this.db.prepare("SELECT * FROM " + this.infoTable1Name).all()
            let rows2 = null
            if (settings.DOUBLETABLE) {
                rows2 = this.db.prepare("SELECT * FROM " + this.infoTable2Name).all()
            }
            return { status: "Success", message: "Info has been retrieved from Database", data: { settings: settings, rows: rows, rows2: rows2 } }
        }
        catch (err) {
            throw { status: "Error", message: "Error retrieving info from Database" + "\n" + err }
        }
    }
    closeDatabase() {
        try {
            this.db.close()
            return { status: "Success", message: "Database " + this.dbPath + " has been closed." }
        }
        catch (err) {
            throw { status: "Error", message: "Error closing database " + this.dbPath + "\n" + err }
        }
    }
}

class DatabaseManager {
    constructor() {
        this.MainDB = new Database("BangumiList.db")
        this.userDB = null
    }
    initMainDB() {
        try {
            if (this.MainDB.detectDatabase()) {
                this.MainDB.openDatabase()
            }
            else {
                this.MainDB.createDatabase({
                    gridView: 0,
                    doubleTable: 0,
                    timeStamp: 0,
                    firstTimeStamp: null,
                    secondTimeStamp: null
                })
                this.MainDB.createTable(tableInfo)
            }
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Main database has been initialized." }
        }
        catch (err) {
            throw { status: "Error", message: "Error initializing main database\n" + err.message }
        }
    }
    getMainDBInfo() {
        try {
            this.MainDB.openDatabase()
            const data = this.MainDB.getInfo().data
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Info have been gotten from main database.", data: data }
        }
        catch (err) {
            throw { status: "Error", message: "Error getting info from main database\n" + err.message }
        }
    }
    getMainDB() {
        try {
            this.MainDB.openDatabase()
            const rows = this.MainDB.getData().data
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Data have been gotten from main database.", data: rows }
        }
        catch (err) {
            throw { status: "Error", message: "Error getting data from main database\n" + err.message }
        }
    }
    convertColumnData(columnsData) {
        const newTableInfo = {
            keys: [],
            dataType: {},
            sortMap: {},
            text: {},
            align: {},
            width: {},
            dataDisplay: {},
            group: {},
            shownColumns: {}
        }
        for (let column of columnsData) {
            newTableInfo.keys.push(column.key)
            newTableInfo.dataType[column.key] = column.dataType
            newTableInfo.sortMap[column.key] = column.sortMap
            newTableInfo.text[column.key] = column.text
            newTableInfo.align[column.key] = column.width == "tight" ? "center" : "start"
            newTableInfo.width[column.key] = column.width
            newTableInfo.dataDisplay[column.key] = column.dataType == "BOOLEAN" ? "icon" : "text"
            newTableInfo.group[column.key] = column.dataType == "TEXT" ? "alphabet" :
                (column.dataType == "BOOLEAN" ? "classification" : "none")
            newTableInfo.shownColumns[column.key] = column.defaultShow
        }
        return newTableInfo
    }
    insertMainDB(addForm) {
        try {
            this.MainDB.openDatabase()
            this.MainDB.insertData(addForm)
            this.MainDB.closeDatabase()
            const newUserDB = new Database(path.join(addForm.databasePath, addForm.databaseName + ".db"))
            if (newUserDB.detectDatabase()) {
                throw "A database with the same name already exists."
            }
            else {
                newUserDB.createDatabase({
                    gridView: addForm.gridView ? 1 : 0,
                    doubleTable: addForm.doubleTable ? 1 : 0,
                    timeStamp: addForm.timeStamp ? 1 : 0,
                    firstTimeStamp: addForm.firstTimeStamp,
                    secondTimeStamp: addForm.secondTimeStamp
                })
                const newTableInfo = convertColumnData(addForm.userDatabaseColumns)
                newUserDB.createTable(newTableInfo)
                const newTableInfo2 = convertColumnData(addForm.userDatabaseColumns2)
                newUserDB.createTable(newTableInfo2, true)
            }
            newUserDB.closeDatabase()
            return { status: "Success", message: "Data have been inserted into main database." }
        }
        catch (err) {
            throw { status: "Error", message: "Error inserting data into main database\n" + err.message }
        }
    }
    importMainDB(data) {
        try {
            const targetPath = path.join(__dirname, "databases", data.fileName)
            fs.renameSync(data.file.path, targetPath)
            this.MainDB.openDatabase()
            this.MainDB.insertData({
                databaseName: path.parse(data.fileName).name,
                databasePath: "databases/"
            })
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Database has been uploaded successfully." }
        }
        catch (err) {
            throw { status: "Error", message: "Error updating database to backend\n" + err.message }
        }
    }
    exportMainDB(fileName) {
        try {
            const filePath = path.join(__dirname, "databases", fileName + ".db")
            if (fs.existsSync(filePath)) {
                return { status: "Success", message: "File exists.", filePath: filePath }
            }
            else {
                throw { status: "Error", message: "File does not exist." }
            }
        }
        catch (err) {
            throw { status: "Error", message: "Error exporting database from backend\n" + err.message }
        }
    }
    deleteMainDB(deleteReq) {
        try {
            this.MainDB.openDatabase()
            this.MainDB.deleteData(deleteReq.id)
            this.MainDB.closeDatabase()
            if (deleteReq.ifDeleteFile) {
                const filePath = path.join(__dirname, "databases", deleteReq.name + ".db")
                if (fs.existsSync(filePath)) {
                    fs.rmSync(filePath)
                }
                else {
                    throw { status: "Error", message: "Database file does not exist." }
                }
            }
            return { status: "Success", message: "Data have been deleted from main database." }
        }
        catch (err) {
            throw { status: "Error", message: "Error deleting data from main database\n" + err.message }
        }
    }
    updateMainDB(updateForm) {
        try {
            this.MainDB.openDatabase()
            this.MainDB.updateData(updateForm.id, { databaseName: updateForm.databaseName, databasePath: updateForm.databasePath })
            this.MainDB.closeDatabase()
            this.userDB = new Database(path.join("databases", updateForm.databaseName + ".db"))
            if (!this.userDB.detectDatabase()) {
                throw "Database file does not exist."
            }
            else {
                this.userDB.openDatabase()
                this.userDB.updateDatabase({
                    gridView: updateForm.gridView ? 1 : 0,
                    doubleTable: updateForm.doubleTable ? 1 : 0,
                    timeStamp: updateForm.timeStamp ? 1 : 0,
                    firstTimeStamp: updateForm.firstTimeStamp,
                    secondTimeStamp: updateForm.secondTimeStamp
                })
                // updateForm.userDatabaseColumns = this.convertColumnData(updateForm.userDatabaseColumns)
                // updateForm.userDatabaseColumns2 = this.convertColumnData(updateForm.userDatabaseColumns2)
                this.userDB.alterTable(updateForm)
                this.userDB.closeDatabase()
            }
            return { status: "Success", message: "Columns have been updated in user database." }
        }
        catch (err) {
            throw { status: "Error", message: "Error updating columns of user database\n" + err.message }
        }
    }
    getUserDBInfo(databaseName) {
        try {
            this.userDB = new Database(path.join("databases", databaseName + ".db"))
            this.userDB.openDatabase()
            const data = this.userDB.getInfo().data
            this.userDB.closeDatabase()
            return { status: "Success", message: "Info have been gotten from user database.", data: data }
        }
        catch (err) {
            throw { status: "Error", message: "Error getting info from user database\n" + err.message }
        }
    }
}

module.exports = DatabaseManager