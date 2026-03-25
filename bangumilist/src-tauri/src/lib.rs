// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod datatype;
mod db_reader;
mod db_writer;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, db_reader::read_db, db_writer::write_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
