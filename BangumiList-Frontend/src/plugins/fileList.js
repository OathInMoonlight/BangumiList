export default {
    Keys: ["id", "fileName", "enableGrid", "enableDoubleTable", "enableTimeStamp", "filePath"],
    Text: {
        id: { "zh": "序号", "ja": "番号", "en": "ID" },
        fileName: { "zh": "文件名", "ja": "ファイル名", "en": "File Name" },
        enableGrid: { "zh": "网格视图", "ja": "グリッドビュー", "en": "Grid View" },
        enableDoubleTable: { "zh": "双层表", "ja": "二重テーブル", "en": "Double Table" },
        enableTimeStamp: { "zh": "时间戳", "ja": "タイムスタンプ", "en": "Time Stamp" },
        filePath: { "zh": "文件路径", "ja": "ファイルパス", "en": "File Path" }
    },
    Align: {
        id: "center",
        fileName: "center",
        enableGrid: "center",
        enableDoubleTable: "center",
        enableTimeStamp: "center",
        filePath: "start"
    },
    computeWidth(key, currentLang) {
        if (key === this.Keys[1]) {
            return 256
        }
        else if (key === this.Keys[5]) {
            return -1
        }
        else {
            return currentLang === "en" ? this.Text[key][currentLang].length * 8 + 50 : this.Text[key][currentLang].length * 16 + 50
        }
    },
    data : []
}