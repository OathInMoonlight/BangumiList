import type { Languages } from "../types/types"

const languages: Languages = {
    langList: [
        { label: "中文", value: "zh" },
        { label: "日本語", value: "ja" },
        { label: "English", value: "en" }
    ],
    currentLang: "zh",
    text: {
        // 抽象动作
        error: { "zh": "错误", "ja": "エラー", "en": "Error" },
        warning: { "zh": "警告", "ja": "警告", "en": "Warning" },
        back: { "zh": "返回", "ja": "戻る", "en": "Back" },
        true: { "zh": "是", "ja": "はい", "en": "True" },
        false: { "zh": "否", "ja": "いいえ", "en": "False" },
        cancel: { "zh": "取消", "ja": "キャンセル", "en": "Cancel" },
        confirm: { "zh": "确认", "ja": "確認", "en": "Confirm" },
        noData: { "zh": "无数据", "ja": "データなし", "en": "No Data" },

        // 全局设置
        language: { "zh": "语言", "ja": "言語", "en": "Language" },
        settings: { "zh": "设置", "ja": "設定", "en": "Settings" },
        globalZoom: { "zh": "全局缩放", "ja": "グローバルズーム", "en": "Global Zoom" },
        darkModeSystem: { "zh": "跟随系统", "ja": "システムに従う", "en": "Follow System" },
        lightMode: { "zh": "浅色模式", "ja": "ライトモード", "en": "Light Mode" },
        darkMode: { "zh": "深色模式", "ja": "ダークモード", "en": "Dark Mode" },
        primaryColor: { "zh": "主色调", "ja": "プライマリカラー", "en": "Primary Color" },

        // 工具栏
        newDatabase: { "zh": "新建数据库", "ja": "データベースを新規作成", "en": "New Database" },
        openDatabase: { "zh": "打开数据库", "ja": "データベースを開く", "en": "Open Database" },
        editDatabase: { "zh": "编辑数据库", "ja": "データベースを編集", "en": "Edit Database" },
        saveDatabase: { "zh": "保存数据库", "ja": "データベースを保存", "en": "Save Database" },
        saveDatabaseAs: {"zh": "数据库另存为", "ja": "データベースを新規保存", "en": "Save Database as" },
        closeDatabase: { "zh": "关闭数据库", "ja": "データベースを閉じる", "en": "Close Database" },
        plus: { "zh": "新建", "ja": "新規作成", "en": "New" },
        import: { "zh": "导入", "ja": "インポート", "en": "Import" },
        edit: { "zh": "编辑", "ja": "編集", "en": "Edit" },
        export: { "zh": "导出", "ja": "エクスポート", "en": "Export" },
        delete: { "zh": "删除", "ja": "削除", "en": "Delete" },
        
        // 列表单
        moveForward: { "zh": "前移", "ja": "前に移動", "en": "Move Forward" },
        deleteColumn: { "zh": "删除列", "ja": "列を削除", "en": "Delete Column" },
        moveBackward: { "zh": "后移", "ja": "後ろに移動", "en": "Move Backward" },
        column: { "zh": "列", "ja": "列", "en": "Column" },
        columnType: { "zh": "列类型", "ja": "列タイプ", "en": "Column Type" },
        bool: { "zh": "布尔", "ja": "ブール", "en": "Boolean" },
        tag: { "zh": "标签", "ja": "タグ", "en": "Tag" },
        number: { "zh": "数值", "ja": "数値", "en": "Number" },
        text: { "zh": "文本", "ja": "テキスト", "en": "Text" },
        paragraph: { "zh": "段落", "ja": "文章", "en": "Paragraph" },
        columnName: { "zh": "列名", "ja": "列名", "en": "Column Name" },
        columnNameZH: { "zh": "列名(中文)", "ja": "列名(中国語)", "en": "Column Name (Chinese)" },
        columnNameJA: { "zh": "列名(日本語)", "ja": "列名(日本語)", "en": "Column Name (Japanese)" },
        columnNameEN: { "zh": "列名(English)", "ja": "列名(英語)", "en": "Column Name (English)" },
        columnSortMap: { "zh": "列排序映射", "ja": "列ソート射影", "en": "Column Sort Map" },
        columnGroupType: { "zh": "列分组类型", "ja": "列グループタイプ", "en": "Column Group Type" },
        alphabet: { "zh": "按首字母分组", "ja": "アルファベット順でグループ化", "en": "Group by Alphabet" },
        columnDisplayAsLang: { "zh": "列显示语言", "ja": "列表示言語", "en": "Column Display Language" },
        notDisplayAsLang: { "zh": "不随语言显示", "ja": "言語に従わない", "en": "No Display Language" },
        columnValuePreset: { "zh": "列值预设", "ja": "列値プリセット", "en": "Column Value Preset" },
        noValuePreset: { "zh": "无值预设", "ja": "値プリセットなし", "en": "No Value Preset" },
        columnDisplayOn: { "zh": "列显示开启", "ja": "列の表示をオン", "en": "Column Display On" },
        columnDisplayOff: { "zh": "列显示关闭", "ja": "列の表示をオフ", "en": "Column Display Off" },

        // 数据库表单
        databaseSettings: { "zh": "数据库设置", "ja": "データベース設定", "en": "Database Settings" },
        gridViewOn: { "zh": "网格视图开启", "ja": "グリッドビューオン", "en": "Grid View On" },
        gridViewOff: { "zh": "网格视图关闭", "ja": "グリッドビューオフ", "en": "Grid View Off" },
        dualTableOn: { "zh": "双层表开启", "ja": "二重テーブルオン", "en": "Dual Table On" },
        dualTableOff: { "zh": "双层表关闭", "ja": "二重テーブルオフ", "en": "Dual Table Off" },
        primaryTableSetting: { "zh": "主表设置", "ja": "主テーブル設定", "en": "Primary Table Setting" },
        id: { zh: "序号", ja: "番号", en: "ID" },
        cover: { zh: "封面", ja: "カバー", en: "Cover" },
        childTable: { zh: "子表", ja: "子テーブル", en: "Child Table" },
        GridLabel: { "zh": "网格视图封面标签", "ja": "グリッドビューのカバーラベル", "en": "Grid View Cover Label" },
        addNewColumn: { "zh": "添加新列", "ja": "新しい列を追加", "en": "Add New Column" },
        childTableSetting: { "zh": "子表设置", "ja": "子テーブル設定", "en": "Child Table Setting" },
        invalidValue: { "zh": "无效的值", "ja": "無効な値", "en": "Invalid Value" },

        // 打开
        clickOrDragToOpen: { "zh": "点击或者拖动文件到该区域来打开", "ja": "クリックまたはファイルをここにドラッグして開く", "en": "Click or Drag File Here to Open" },
        opening: { "zh": "正在打开", "ja": "開いている", "en": "Opening" },
        // 导入
        browse: { "zh": "浏览", "ja": "ブラウズ", "en": "Browse" },
        importDatabase: { "zh": "导入一个数据库文件", "ja": "データベースファイルをインポートする", "en": "Import a database file" },
        uploadFile: { "zh": "上传文件", "ja": "アップロードファイル", "en": "Upload File" },
        importError: { "zh": "导入失败", "ja": "インポートに失敗しました", "en": "Failed to import" },
        // 导出
        exportPath: { "zh": "导出路径", "ja": "エクスポートパス", "en": "Export Path" },
        exportAs: { "zh": "导出为", "ja": "新規エクスポート", "en": "Export as" },
        exportLanguage: { "zh": "导出语言", "ja": "エクスポート言語", "en": "Export Language" },
        exportMetadata: { "zh": "导出数据库元数据", "ja": "エクスポートメタデータ", "en": "Export Database Metadata" },
        exportColumnInfo: { "zh": "导出列定义", "ja": "エクスポート列情報", "en": "Export Column Info" },
        unfoldChildTable: { "zh": "展开子表", "ja": "子テーブルを展開する", "en": "Unfold Child Table" },
        dualTable: { "zh": "双层表", "ja": "二重テーブル", "en": "Dual Table" },
        columnDisplay: { "zh": "列显示", "ja": "列の表示", "en": "Column Display" },
        exporting: { "zh": "正在导出", "ja":"エクスポートしている", "en":"Expoting" },
        exportSuccess: { "zh": "导出成功", "ja": "エクスポート成功", "en": "Exported successfully"},
        // 删除
        deleteConfirm1: { "zh": "确认要删除", "ja": "", "en": "Are you sure to delete" },
        deleteConfirm2: { "zh": "吗？", "ja": "を削除しますか？", "en": "?" },
        // 保存
        saving: { "zh": "正在保存", "ja": "保存している", "en": "Saving" },
        saveSuccess: { "zh": "保存成功", "ja": "保存成功", "en": "Saved successfully" },
        // 关闭
        closeNotSaved: { "zh": "数据库尚未保存", "ja": "データベースはまだ保存されていません", "en": "Database is not saved yet" },
        closeWithoutSaving: { "zh": "不保存直接关闭", "ja": "保存せずに閉じる", "en": "Close without saving" },

        // 视图栏
        gridView: { "zh": "网格视图", "ja": "グリッドビュー", "en": "Grid View" },
        tableView: { "zh": "表格视图", "ja": "テーブルビュー", "en": "Table View" },
        statisticView: { "zh": "统计视图", "ja": "統計ビュー", "en": "Statistic View" },
        tableDisplayItems: { "zh": "表格显示项", "ja": "テーブル表示項目", "en": "Table Display Items" },
        gridLarge: { "zh": "网格:大", "ja": "グリッド:大", "en": "Grid:Large" },
        gridDefault: { "zh": "网格:默认", "ja": "グリッド:デフォルト", "en": "Grid:Default" },
        gridSmall: { "zh": "网格:小", "ja": "グリッド:小", "en": "Grid:Small" },
        sortBy: { "zh": "排序方式", "ja": "ソート順", "en": "Sort By" },
        groupSortBy: { "zh": "分组依据", "ja": "グループ分け", "en": "Group Sort By" },
        noGroup: { "zh": "不分组", "ja": "グループなし", "en": "No Group" },
        search: { "zh": "搜索", "ja": "検索", "en": "Search" },
        viewPrimaryItem: { "zh": "查看主表项", "ja": "プライマリアイテムのを確認する", "en": "View the Primary Item" }
    },
    getText(key: keyof typeof this.text) {
        return this.text[key][this.currentLang]
    }
}

export default languages