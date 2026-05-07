// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod datatype;
mod db_reader;
mod db_writer;
mod export;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_reader::read_db,
            db_writer::write_db,
            export::export_csv
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
