use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Serialize)]
#[derive(Deserialize)]
pub struct Column {
    pub id: u32,
    pub name: String,
    pub data_type: String,
    pub title: String,
    pub sort_map: u32,
    pub group_type: String,
    pub if_display: bool,
    pub tag_color: Option<String>
}

#[derive(Serialize)]
#[derive(Deserialize)]
#[serde(untagged)]
pub enum UnknownDataType {
    Number(i32), Text(String)
}

#[derive(Serialize)]
#[derive(Deserialize)]
pub struct DBData {
    pub path: String,
    pub grid_view: bool,
    pub dual_table: bool,
    pub table1_info: Vec<Column>,
    pub table2_info: Vec<Column>,
    pub table_data: Vec<HashMap<i32, Option<UnknownDataType>>>,
    pub sort1: String,
    pub sort2: String,
    pub group1: String,
    pub group2: String
}