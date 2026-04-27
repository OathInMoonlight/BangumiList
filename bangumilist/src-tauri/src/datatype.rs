use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Column {
    pub id: u32,
    pub data_type: String,
    pub title: String,
    pub sort_map: u32,
    pub group_type: String,
    pub if_display: bool,
    pub display_lang: String,
    pub value_preset: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", untagged)]
pub enum UnknownDataType {
    Bool(bool),
    Number(i32),
    Text(String),
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DBData {
    pub path: String,
    pub grid_view: bool,
    pub dual_table: bool,
    pub table1_label: Option<u32>,
    pub table2_label: Option<u32>,
    pub table1_info: Vec<Column>,
    pub table2_info: Vec<Column>,
    pub table_data: Vec<HashMap<i32, Option<UnknownDataType>>>,
    pub sort1: String,
    pub sort2: String,
    pub group_sort1: String,
    pub group_sort2: String,
}
