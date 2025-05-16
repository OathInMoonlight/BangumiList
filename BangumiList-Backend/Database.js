const fs = require("fs")
const path = require("path")
const sqlite = require("better-sqlite3")

class Database {
    constructor(dbPath) {
        this.dbPath = path.join(__dirname, dbPath)
        this.db = null
    }
    detectDatabase() {
        return fs.existsSync(this.dbPath)
    }
    createDatabase() {
        if (this.detectDatabase()) {
            return { status: "Error", message: "Database " + this.dbPath + " already exists." }
        }
        try {
            this.db = new sqlite(this.dbPath)
            return { status: "Success", message: "Database " + this.dbPath + " has been created." }
        }
        catch (err) {
            return { status: "Error", message: "Error creating database " + this.dbPath + "\n" + err.code }
        }
    }
    openDatabase() {
        if (!this.detectDatabase()) {
            return { status: "Error", message: "Database " + this.dbPath + " does not exist." }
        }
        try {
            this.db = new sqlite(this.dbPath, options.fileMustExist)
            return { status: "Success", message: "Database " + this.dbPath + " has been opened." }
        }
        catch (err) {
            return { status: "Error", message: "Error opening database " + this.dbPath + "\n" + err.code }
        }
    }
    createTable(tableName, columns) {
        try {
            const columnsString = columns.join(", ")
            this.db.run("CREATE TABLE IF NOT EXISTS ? (?)", [tableName, columnsString])
            return { status: "Success", message: "Table " + tableName + " has been created." }
        }
        catch (err) {
            return { status: "Error", message: "Error creating table " + tableName + "\n" + err.code }
        }
    }
    insertData(tableName, row) {
        try {
            const placeholders = Object.keys(row).map(() => "?").join(", ")
            this.db.run("INSERT INTO ? VALUES (" + placeholders + ")", [tableName, ...Object.values(row).unshift(null)])
            return { status: "Success", message: "Data has been inserted into table " + tableName }
        }
        catch (err) {
            return { status: "Error", message: "Error inserting data into table " + tableName + "\n" + err.code }
        }
    }
    deleteData(tableName, rowid) {
        try {
            this.db.run("DELETE FROM ? WHERE ID = ?", [tableName, rowid])
            return { status: "Success", message: "Data has been deleted from table " + tableName }
        }
        catch (err) {
            return { status: "Error", message: "Error deleting data from table " + tableName + "\n" + err.code }
        }
    }
    updateData(tableName, rowid, row) {
        try {
            const setString = Object.keys(row).map(key => key + " = ?").join(", ")
            this.db.run("UPDATE ? SET " + setString + " WHERE ID = ?", [tableName, ...Object.values(row), rowid])
            return { status: "Success", message: "Data has been updated in table " + tableName }
        }
        catch (err) {
            return { status: "Error", message: "Error updating data in table " + tableName + "\n" + err.code }
        }
    }
    getData(tableName) {
        try {
            const rows = this.db.all("SELECT * FROM ?", [tableName])
            return { status: "Success", message: "Data has been retrieved from table " + tableName, data: rows }
        }
        catch (err) {
            return { status: "Error", message: "Error retrieving data from table " + tableName + "\n" + err.code }
        }
    }
    closeDatabase() {
        try {
            this.db.close()
            return { status: "Success", message: "Database " + this.dbPath + " has been closed." }
        }
        catch (err) {
            return { status: "Error", message: "Error closing database " + this.dbPath + "\n" + err.code }
        }
    }
}