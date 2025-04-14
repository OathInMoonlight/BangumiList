export default {
    currentLang: "zh",
    text: {
        settings: {"zh": "设置", "ja": "設定", "en": "Settings"},
        darkMode: {"zh": "深色模式", "ja": "ダークモード", "en": "Dark Mode"},
        primaryColor: {"zh": "主色调", "ja": "プライマリカラー", "en": "Primary Color"},
        red: {"zh": "红色", "ja": "赤", "en": "Red"},
        yellow: {"zh": "黄色", "ja": "黄", "en": "Yellow"},
        green: {"zh": "绿色", "ja": "緑", "en": "Green"},
        blue: {"zh": "蓝色", "ja": "青", "en": "Blue"},
        language: {"zh": "语言", "ja": "言語", "en": "Language"},
        databaseList: {"zh": "数据库列表", "ja": "データベースリスト", "en": "Database List"},
        backToList: {"zh": "返回列表", "ja": "リストに戻る", "en": "Back to List"},
        plus: {"zh": "新建", "ja": "新規作成", "en": "New"},
        import: {"zh": "导入", "ja": "インポート", "en": "Import"},
        export: {"zh": "导出", "ja": "エクスポート", "en": "Export"},
        delete: {"zh": "删除", "ja": "削除", "en": "Delete"},
        edit: {"zh": "编辑", "ja": "編集", "en": "Edit"},
        search: {"zh": "搜索", "ja": "検索", "en": "Search"},
        gridView: {"zh": "网格视图", "ja": "グリッドビュー", "en": "Grid View"},
        listView: {"zh": "列表视图", "ja": "リストビュー", "en": "List View"},
        listShowItems: {"zh": "列表显示项", "ja": "リスト表示項目", "en": "List Show Items"},
        gridLarge: {"zh": "网格:大", "ja": "グリッド:大", "en": "Grid:Large"},
        gridDefault: {"zh": "网格:默认", "ja": "グリッド:デフォルト", "en": "Grid:Default"},
        gridSmall: {"zh": "网格:小", "ja": "グリッド:小", "en": "Grid:Small"},
        sortBy: {"zh": "排序方式", "ja": "ソート順", "en": "Sort By"},
        groupSortBy: {"zh": "分组依据", "ja": "グループ分け", "en": "Group Sort By"},
        noData: {"zh": "无数据", "ja": "データなし", "en": "No Data"},
        id: {"zh": "序号", "ja": "番号", "en": "ID"},
        fileName: {"zh": "文件名", "ja": "ファイル名", "en": "File Name"},
        enableGrid: {"zh": "使用网格视图", "ja": "グリッドビューを使用", "en": "Enable Grid View"},
        enableDoubleTable: {"zh": "使用双层表", "ja": "二重テーブルを使用", "en": "Enable Double Table"},
        enableTimeStamp: {"zh": "使用时间戳", "ja": "タイムスタンプを使用", "en": "Enable Time Stamp"},
        filePath: {"zh": "文件路径", "ja": "ファイルパス", "en": "File Path"}
    }
}

export class Lang{
    constructor(lang = "zh"){
        this.currentLang = lang
        this.text = ''
        this.zh = {
            "settings": "设置",
            "darkMode": "深色模式",
            "primaryColor": "主色调",
            "red": "红色",
            "yellow": "黄色",
            "green": "绿色",
            "blue": "蓝色",
            "language": "语言",
            "databaseList": "数据库列表",
            "backToList": "返回列表",
            "plus": "新建",
            "import": "导入",
            "export": "导出",
            "delete": "删除",
            "edit": "编辑",
            "search": "搜索",
            "gridView": "网格视图",
            "listView": "列表视图",
            "listShowItems": "列表显示项",
            "gridLarge": "网格:大",
            "gridDefault": "网格:默认",
            "gridSmall": "网格:小",
            "sortBy": "排序方式",
            "groupSortBy": "分组依据",
            "noData": "无数据",
            "id": "序号",
            "fileName": "文件名",
            "enableGrid": "使用网格视图",
            "enableDoubleTable": "使用双层表",
            "enableTimeStamp": "使用时间戳",
            "filePath": "文件路径"
        }
        this.ja = {
            "settings": "設定",
            "darkMode": "ダークモード",
            "primaryColor": "プライマリカラー",
            "red": "赤",
            "yellow": "黄",
            "green": "緑",
            "blue": "青",
            "language": "言語",
            "databaseList": "データベースリスト",
            "backToList": "リストに戻る",
            "plus": "新規作成",
            "import": "インポート",
            "export": "エクスポート",
            "delete": "削除",
            "edit": "編集",
            "search": "検索",
            "gridView": "グリッドビュー",
            "listView": "リストビュー",
            "listShowItems": "リスト表示項目",
            "gridLarge": "グリッド:大",
            "gridDefault": "グリッド:デフォルト",
            "gridSmall": "グリッド:小",
            "sortBy": "ソート順",
            "groupSortBy": "グループ分け",
            "noData": "データなし",
            "id": "番号",
            "fileName": "ファイル名",
            "enableGrid": "グリッドビューを使用",
            "enableDoubleTable": "二重テーブルを使用",
            "enableTimeStamp": "タイムスタンプを使用",
            "filePath": "ファイルパス"
        }
        this.en = {
            "settings": "Settings",
            "darkMode": "Dark Mode",
            "primaryColor": "Primary Color",
            "red": "Red",
            "yellow": "Yellow",
            "green": "Green",
            "blue": "Blue",
            "language": "Language",
            "databaseList": "Database List",
            "backToList": "Back to List",
            "plus": "New",
            "import": "Import",
            "export": "Export",
            "delete": "Delete",
            "edit": "Edit",
            "search": "Search",
            "gridView": "Grid View",
            "listView": "List View",
            "listShowItems": "List Show Items",
            "gridLarge": "Grid:Large",
            "gridDefault": "Grid:Default",
            "gridSmall": "Grid:Small",
            "sortBy": "Sort By",
            "groupSortBy": "Group Sort By",
            "noData": "No Data",
            "id": "ID",
            "fileName": "File Name",
            "enableGrid": "Enable Grid View",
            "enableDoubleTable": "Enable Double Table",
            "enableTimeStamp": "Enable Time Stamp",
            "filePath": "File Path"
        }
        this.changeLang()
    }
    changeLang(){
        switch (this.currentLang) {
            case "zh":
                this.text = this.zh
                break
            case "ja":
                this.text = this.ja
                break
            case "en":
                this.text = this.en
                break
            default:
                this.text = this.zh
                break
        }
    }
}