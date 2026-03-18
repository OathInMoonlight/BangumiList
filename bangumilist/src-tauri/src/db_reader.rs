use std::collections::HashMap;
use rusqlite::{Connection, Result};
use serde::Serialize;

#[derive(Serialize)]
pub struct Column {
    id: u32,
    name: String,
    data_type: String,
    title: String,
    sort_map: u32,
    group_type: String,
    if_display: bool,
    display_order: u32,
    tag_color: Option<String>
}

#[derive(Serialize)]
pub enum UnknownDataType {
    Number(i32), Text(String)
}

#[derive(Serialize)]
pub struct DBData {
    path: String,
    grid_view: bool,
    dual_table: bool,
    divide_line: String,
    table1_info: Vec<Column>,
    table2_info: Vec<Column>,
    table_data: Vec<HashMap<i32, Option<UnknownDataType>>>,
    sort1: String,
    sort2: String,
    group1: String,
    group2: String
}

#[tauri::command]
pub fn read_db(path: &str) -> Result<DBData, String> {
    let err_to_string = |err: rusqlite::Error| err.to_string();
    let db = Connection::open(path).map_err(err_to_string)?;
    let mut stmt = db.prepare("SELECT * FROM DATABASE_INFO").map_err(err_to_string)?;
    let database_info: (bool, bool, String, String, String, String, String) = stmt.query_row([], |row| {
        Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?, row.get(5)?, row.get(6)?))
    }).map_err(err_to_string)?;
    stmt = db.prepare("SELECT * FROM INFO_TABLE_1").map_err(err_to_string)?;
    let table1_info: Vec<Column> = stmt
        .query_map([], |row| {
            Ok(Column {
                id: row.get(0)?,
                name: row.get(1)?,
                data_type: row.get(2)?,
                title: row.get(3)?,
                sort_map: row.get(4)?,
                group_type: row.get(5)?,
                if_display: row.get(6)?,
                display_order: row.get(7)?,
                tag_color: row.get(8)?
            })
        }).map_err(err_to_string)?
        .collect::<Result<Vec<Column>>>().map_err(err_to_string)?;
    stmt = db.prepare("SELECT * FROM INFO_TABLE_2").map_err(err_to_string)?;
    let table2_info: Vec<Column> = stmt
        .query_map([], |row| {
            Ok(Column {
                id: row.get(0)?,
                name: row.get(1)?,
                data_type: row.get(2)?,
                title: row.get(3)?,
                sort_map: row.get(4)?,
                group_type: row.get(5)?,
                if_display: row.get(6)?,
                display_order: row.get(7)?,
                tag_color: row.get(8)?
            })
        }).map_err(err_to_string)?
        .collect::<Result<Vec<Column>>>().map_err(err_to_string)?;
    stmt = db.prepare("SELECT * FROM DATA_TABLE").map_err(err_to_string)?;
    let column_length = stmt.column_count();
    let table_data: Vec<HashMap<i32, Option<UnknownDataType>>> = stmt
        .query_map([], |row| {
            let mut row_data = HashMap::new();
            for i in 0..column_length {
                let value: Option<UnknownDataType> = match row.get_ref(i)? {
                    rusqlite::types::ValueRef::Null => None,
                    rusqlite::types::ValueRef::Integer(value) => Some(UnknownDataType::Number(value as i32)),
                    rusqlite::types::ValueRef::Real(_) => None,
                    rusqlite::types::ValueRef::Text(value) => Some(UnknownDataType::Text(String::from_utf8_lossy(value).to_string())),
                    rusqlite::types::ValueRef::Blob(_) => None
                };
                row_data.insert(i as i32, value);
            }
            Ok(row_data)
        }).map_err(err_to_string)?
        .collect::<Result<Vec<HashMap<i32, Option<UnknownDataType>>>>>().map_err(err_to_string)?;
    Ok(DBData { 
        path: path.to_string(),
        grid_view: database_info.0,
        dual_table: database_info.1,
        divide_line: database_info.2,
        table1_info,
        table2_info,
        table_data,
        sort1: database_info.3,
        sort2: database_info.4,
        group1: database_info.5,
        group2: database_info.6
    })
}