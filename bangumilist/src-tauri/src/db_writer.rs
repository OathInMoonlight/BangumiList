use rusqlite::{Connection, Result};
use std::path::Path;
use crate::datatype::{DBData, UnknownDataType};
use std::fs;

#[tauri::command]
pub fn write_db(db_data: DBData) -> Result<String, String> {
    let err_to_string = |err: rusqlite::Error| err.to_string();
    let path = Path::new(&db_data.path);
    let tmp_path = path.with_extension("tmpdb");
    if tmp_path.exists() {
        return Err("Temporary file already exists".to_string());
    }
    let db = Connection::open(&tmp_path).map_err(err_to_string)?;
    db.execute("CREATE TABLE IF NOT EXISTS DATABASE_INFO (grid_view BOOLEAN NOT NULL, dual_table BOOLEAN NOT NULL,
        sort1 TEXT NOT NULL, sort2 TEXT NOT NULL, group1 TEXT NOT NULL, group2 TEXT NOT NULL)", []).map_err(err_to_string)?;
    db.execute("INSERT INTO DATABASE_INFO (grid_view, dual_table, sort1, sort2, group1, group2) VALUES (?, ?, ?, ?, ?, ?)",
        rusqlite::params![&db_data.grid_view, &db_data.dual_table, &db_data.sort1, &db_data.sort2, &db_data.group1, &db_data.group2]).map_err(err_to_string)?;
    db.execute("CREATE TABLE IF NOT EXISTS INFO_TABLE_1 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, data_type TEXT NOT NULL, title TEXT NOT NULL,
        sort_map INTEGER NOT NULL, group_type TEXT NOT NULL, if_display BOOLEAN NOT NULL, tag_color TEXT)", []).map_err(err_to_string)?;
    for column in &db_data.table1_info {
        db.execute("INSERT INTO INFO_TABLE_1 (name, data_type, title, sort_map, group_type, if_display, tag_color) VALUES (?, ?, ?, ?, ?, ?, ?)",
            rusqlite::params![&column.name, &column.data_type, &column.title, &column.sort_map, &column.group_type, &column.if_display, &column.tag_color])
            .map_err(err_to_string)?;
    }
    db.execute("CREATE TABLE IF NOT EXISTS INFO_TABLE_2 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, data_type TEXT NOT NULL, title TEXT NOT NULL,
        sort_map INTEGER NOT NULL, group_type TEXT NOT NULL, if_display BOOLEAN NOT NULL, tag_color TEXT)", []).map_err(err_to_string)?;
    for column in &db_data.table2_info {
        db.execute("INSERT INTO INFO_TABLE_2 (name, data_type, title, sort_map, group_type, if_display, tag_color) VALUES (?, ?, ?, ?, ?, ?, ?)",
            rusqlite::params![&column.name, &column.data_type, &column.title, &column.sort_map, &column.group_type, &column.if_display, &column.tag_color])
            .map_err(err_to_string)?;
    }
    db.execute(&format!("CREATE TABLE IF NOT EXISTS DATA_TABLE (\"0\" INTEGER PRIMARY KEY AUTOINCREMENT{}{})",if db_data.table1_info.len() > 1 {", "} else {""},
        &db_data.table1_info[1..].iter().map(|column| format!("{} {}", column.id, match column.data_type.as_str() {
            "bool" => "INTEGER",
            "tag" => "TEXT",
            "number" => "INTEGER",
            "text" => "TEXT",
            "paragraph" => "TEXT",
            _ => "TEXT"
        })).collect::<Vec<String>>().join(", ")), []).map_err(err_to_string)?;
    for row in &db_data.table_data {
        let mut columns: Vec<String> = Vec::new();
        let mut placeholders: Vec<String> = Vec::new();
        let mut values: Vec<&dyn rusqlite::ToSql> = Vec::new();
        for (column_id, value) in row {
            columns.push(column_id.to_string());
            placeholders.push("?".to_string());
            match value {
                Some(UnknownDataType::Number(num)) => values.push(num),
                Some(UnknownDataType::Text(text)) => values.push(text),
                None => values.push(&rusqlite::types::Null)
            }
        }
        db.execute(&format!("INSERT INTO DATA_TABLE ({}) VALUES ({})", columns.join(", "), placeholders.join(", ")), values.as_slice()).map_err(err_to_string)?;
    }
    db.close().map_err(|(_, err)| err.to_string())?;
    if path.exists() {
        fs::remove_file(path).map_err(|err| err.to_string())?;
    }
    fs::rename(tmp_path, path).map_err(|err| err.to_string())?;
    Ok("Database saved successfully".to_string())
}