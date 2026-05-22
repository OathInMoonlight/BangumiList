use std::sync::Mutex;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod datatype;
mod db_reader;
mod db_writer;
mod import;
mod export;
mod setting;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(startup_file: Option<String>) {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_reader::get_startup_file,
            db_reader::read_db,
            db_writer::write_db,
            import::import_csv,
            export::export_csv,
            setting::read_setting,
            setting::save_setting
        ])
        .manage(Mutex::new(datatype::Startup {
            startup_file: startup_file
        }))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
