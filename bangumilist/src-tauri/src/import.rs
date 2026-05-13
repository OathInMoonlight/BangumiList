use std::path::Path;
use std::fs;

#[tauri::command]
pub fn import_csv(path_str: &str) -> Result<String, String> {
    let path = Path::new(path_str);
    if !path.exists() {
        return Err("File does not exist".to_string());
    }
    let contents = fs::read_to_string(path).map_err(|err| err.to_string())?;
    Ok(contents)
}