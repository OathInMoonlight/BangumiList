use std::path::Path;
use std::fs;

#[tauri::command]
pub fn export_csv(path_str: &str, contents: &str) -> Result<(), String> {
    let path = Path::new(path_str);
    if path.exists() {
        return Err("File already exists".to_string());
    }
    let mut data = Vec::new();
    data.extend_from_slice(b"\xEF\xBB\xBF"); // 添加 UTF-8 BOM，防止Excel误判成ANSI
    data.extend_from_slice(contents.as_bytes());
    fs::write(path, data).unwrap();
    Ok(())
}