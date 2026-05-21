use std::path::Path;
use std::fs;

#[tauri::command]
pub fn read_setting() -> Result<String, String> {
    let path = Path::new("bangumilist_setting.json");
    if path.exists() {
        let contents = fs::read_to_string(path).map_err(|err| err.to_string())?;
        Ok(contents)
    } else {
        Ok("false".to_string())
    }
}

#[tauri::command]
pub fn save_setting(contents: &str) -> Result<(), String> {
    let path = Path::new("bangumilist_setting.json");
    fs::write(path, contents).map_err(|err| err.to_string())?;
    Ok(())
}