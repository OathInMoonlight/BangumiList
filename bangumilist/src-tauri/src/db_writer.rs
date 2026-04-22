use crate::datatype::{DBData, UnknownDataType};
use rusqlite::{Connection, Result};
use std::fs;
use std::path::Path;

#[tauri::command]
pub fn write_db(db_data: DBData) -> Result<String, String> {
    let err_to_string = |err: rusqlite::Error| err.to_string();
    let path = Path::new(&db_data.path);
    let tmp_path = path.with_extension("tmpdb");
    if tmp_path.exists() {
        return Err("Temporary file already exists".to_string());
    }
    let db = Connection::open(&tmp_path).map_err(err_to_string)?;
    db.execute("CREATE TABLE IF NOT EXISTS DATABASE_INFO (grid_view BOOLEAN NOT NULL, dual_table BOOLEAN NOT NULL, table1_label INTEGER, table2_label INTEGER,
        sort1 TEXT NOT NULL, sort2 TEXT NOT NULL, group_sort1 TEXT NOT NULL, group_sort2 TEXT NOT NULL)", []).map_err(err_to_string)?;
    db.execute("INSERT INTO DATABASE_INFO (grid_view, dual_table, table1_label, table2_label, sort1, sort2, group_sort1, group_sort2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        rusqlite::params![&db_data.grid_view, &db_data.dual_table, &db_data.table1_label, &db_data.table2_label, &db_data.sort1, &db_data.sort2, &db_data.group_sort1, &db_data.group_sort2]).map_err(err_to_string)?;
    db.execute("CREATE TABLE IF NOT EXISTS INFO_TABLE_1 (id INTEGER PRIMARY KEY AUTOINCREMENT, data_type TEXT NOT NULL, title TEXT NOT NULL,
        sort_map INTEGER NOT NULL, group_type TEXT NOT NULL, if_display BOOLEAN NOT NULL, display_lang TEXT NOT NULL, tag_color TEXT NOT NULL)", []).map_err(err_to_string)?;
    for column in &db_data.table1_info {
        db.execute("INSERT INTO INFO_TABLE_1 (data_type, title, sort_map, group_type, if_display, display_lang, tag_color) VALUES (?, ?, ?, ?, ?, ?, ?)",
            rusqlite::params![&column.data_type, &column.title, &column.sort_map, &column.group_type, &column.if_display, &column.display_lang, &column.tag_color])
            .map_err(err_to_string)?;
    }
    db.execute("CREATE TABLE IF NOT EXISTS INFO_TABLE_2 (id INTEGER PRIMARY KEY AUTOINCREMENT, data_type TEXT NOT NULL, title TEXT NOT NULL,
        sort_map INTEGER NOT NULL, group_type TEXT NOT NULL, if_display BOOLEAN NOT NULL, display_lang TEXT NOT NULL, tag_color TEXT NOT NULL)", []).map_err(err_to_string)?;
    for column in &db_data.table2_info {
        db.execute("INSERT INTO INFO_TABLE_2 (data_type, title, sort_map, group_type, if_display, display_lang, tag_color) VALUES (?, ?, ?, ?, ?, ?, ?)",
            rusqlite::params![&column.data_type, &column.title, &column.sort_map, &column.group_type, &column.if_display, &column.display_lang, &column.tag_color])
            .map_err(err_to_string)?;
    }
    db.execute(
        &format!(
            "CREATE TABLE IF NOT EXISTS DATA_TABLE (\"0\" INTEGER PRIMARY KEY AUTOINCREMENT{}{})",
            if db_data.table1_info.len() > 1 {
                ", "
            } else {
                ""
            },
            &db_data.table1_info[1..]
                .iter()
                .map(|column| format!(
                    "{} {}",
                    column.id,
                    match column.data_type.as_str() {
                        "bool" => "INTEGER",
                        "tag" => "TEXT",
                        "number" => "INTEGER",
                        "text" => "TEXT",
                        "paragraph" => "TEXT",
                        _ => "TEXT",
                    }
                ))
                .collect::<Vec<String>>()
                .join(", ")
        ),
        [],
    )
    .map_err(err_to_string)?;
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
                None => values.push(&rusqlite::types::Null),
            }
        }
        db.execute(
            &format!(
                "INSERT INTO DATA_TABLE ({}) VALUES ({})",
                columns.join(", "),
                placeholders.join(", ")
            ),
            values.as_slice(),
        )
        .map_err(err_to_string)?;
    }
    db.close().map_err(|(_, err)| err.to_string())?;
    if path.exists() {
        fs::remove_file(path).map_err(|err| err.to_string())?;
    }
    fs::rename(tmp_path, path).map_err(|err| err.to_string())?;
    Ok("Database saved successfully".to_string())
}
