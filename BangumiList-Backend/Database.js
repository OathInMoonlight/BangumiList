const fs = require("fs")
const path = require("path")
const sqlite = require("better-sqlite3")

class Database {
    constructor(dbPath) {
        this.dbPath = path.join(__dirname, dbPath)
        this.db = null
        this.table1Name = null
        this.table2Name = null
        this.table1Columns = []
        this.table2Columns = []
    }
    detectDatabase() {
        return fs.existsSync(this.dbPath)
    }
    createDatabase() {
        if (this.detectDatabase()) {
            throw { status: "Error", message: "Database \${this.dbPath} already exists." }
        }
        try {
            this.db = new sqlite(this.dbPath)
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
            this.db = new sqlite(this.dbPath, { fileMustExist: true })
            this.table1Name = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()[0].name
            this.table1Columns = this.db.prepare("PRAGMA table_info(" + this.table1Name + ")").all().map(column => column.name)
            if (has_inner) {
                this.table2Name = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()[1].name
                this.table2Columns = this.db.prepare("PRAGMA table_info(" + this.table2Name + ")").all().map(column => column.name)
            }
            return { status: "Success", message: "Database " + this.dbPath + " has been opened." }
        }
        catch (err) {
            throw { status: "Error", message: "Error opening database " + this.dbPath + "\n" + err }
        }
    }
    createTable(tableName, columns, is_inner = false) {
        try {
            columns.unshift(["ID", "INTEGER", "PRIMARY KEY", "AUTOINCREMENT"])
            if (is_inner) {
                this.table2Name = tableName
                this.table2Columns = columns.map(column => column[0])
            }
            else {
                this.table1Name = tableName
                this.table1Columns = columns.map(column => column[0])
            }
            columns = columns.map(column => column.join(" "))
            const columnsString = columns.join(", ")
            this.db.prepare("CREATE TABLE IF NOT EXISTS " + tableName + " (" + columnsString + ")").run()
            return { status: "Success", message: "Table " + tableName + " has been created." }
        }
        catch (err) {
            throw { status: "Error", message: "Error creating table " + tableName + "\n" + err }
        }
    }
    insertData(row, is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            const placeholders = Object.keys(row).map(() => "?").join(", ") + ", ?"
            const columns = is_inner ? this.table2Columns : this.table1Columns
            const values = columns.map(column => {
                if (row[column] == undefined) {
                    return null
                }
                else if (typeof row[column] == "boolean") {
                    return row[column] ? 1 : 0
                }
                else {
                    return row[column]
                }
            })
            this.db.prepare("INSERT INTO " + tableName + " VALUES (" + placeholders + ")").run([...values])
            return { status: "Success", message: "Data has been inserted into table " + tableName }
        }
        catch (err) {
            throw { status: "Error", message: "Error inserting data into table " + tableName + "\n" + err }
        }
    }
    deleteData(rowid, is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            this.db.prepare("DELETE FROM " + tableName + " WHERE ID = ?").run(rowid)
            return { status: "Success", message: "Data has been deleted from table " + tableName }
        }
        catch (err) {
            throw { status: "Error", message: "Error deleting data from table " + tableName + "\n" + err }
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
            throw { status: "Error", message: "Error updating data in table " + tableName + "\n" + err }
        }
    }
    getData(is_inner = false) {
        try {
            const tableName = is_inner ? this.table2Name : this.table1Name
            const rows = this.db.prepare("SELECT * FROM " + tableName).all()
            return { status: "Success", message: "Data has been retrieved from table " + tableName, data: rows }
        }
        catch (err) {
            throw { status: "Error", message: "Error retrieving data from table " + tableName + "\n" + err }
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
                this.MainDB.createDatabase()
                this.MainDB.createTable("DATABASELIST", [
                    ["DATABASENAME", "TEXT", "NOT NULL"],
                    ["ENABLEGRID", "INTEGER"],
                    ["ENABLEDOUBLETABLE", "INTEGER"],
                    ["ENABLETIMESTAMP", "INTEGER"],
                    ["DATABASEPATH", "TEXT"]
                ])
            }
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Main database has been initialized." }
        }
        catch (err) {
            throw { status: "Error", message: "Error initializing main database\n" + err.message }
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
    insertMainDB(row) {
        try {
            this.MainDB.openDatabase()
            this.MainDB.insertData(row)
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Data have been inserted into main database." }
        }
        catch (err) {
            throw { status: "Error", message: "Error inserting data into main database\n" + err.message }
        }
    }
    deleteMainDB(rowid) {
        try {
            this.MainDB.openDatabase()
            this.MainDB.deleteData(rowid)
            this.MainDB.closeDatabase()
            return { status: "Success", message: "Data have been deleted from main database." }
        }
        catch (err) {
            throw { status: "Error", message: "Error deleting data from main database\n" + err.message }
        }
    }
}

module.exports = DatabaseManager