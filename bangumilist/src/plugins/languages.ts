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
        submit: { "zh": "提交", "ja": "送信", "en": "Submit" },
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
        saveDatabaseAs: {"zh": "数据库另存为", "ja": "データベースを新規保存", "en": "Save Database As" },
        closeDatabase: { "zh": "关闭数据库", "ja": "データベースを閉じる", "en": "Close Database" },
        plus: { "zh": "新建", "ja": "新規作成", "en": "New" },
        import: { "zh": "导入", "ja": "インポート", "en": "Import" },
        edit: { "zh": "编辑", "ja": "編集", "en": "Edit" },
        export: { "zh": "导出", "ja": "エクスポート", "en": "Export" },
        delete: { "zh": "删除", "ja": "削除", "en": "Delete" },
        clickOrDragToOpen: { "zh": "点击或者拖动文件到该区域来打开", "ja": "クリックまたはファイルをここにドラッグして開く", "en": "Click or Drag File Here to Open" },

        // 新建
        databaseName: { "zh": "数据库名", "ja": "データベース名", "en": "Database Name" },
        databasePath: { "zh": "数据库路径", "ja": "データベースパス", "en": "Database Path" },
        doubleTable: { "zh": "双层表", "ja": "二重テーブル", "en": "Double Table" },
        timeStamp: { "zh": "时间戳", "ja": "タイムスタンプ", "en": "Time Stamp" },
        firstTimeStamp: { "zh": "主时间戳", "ja": "主要タイムスタンプ", "en": "First Time Stamp" },
        secondTimeStamp: { "zh": "次要时间戳", "ja": "第二タイムスタンプ", "en": "Second Time Stamp" },
        column: { "zh": "列", "ja": "列", "en": "Column" },
        columnKey: { "zh": "列键", "ja": "列キー", "en": "Column Key" },
        columnType: { "zh": "列类型", "ja": "列タイプ", "en": "Column Type" },
        columnSortMap: { "zh": "列排序方式", "ja": "列ソート順", "en": "Column Sort Map" },
        columnNameZH: { "zh": "列名(中文)", "ja": "列名(中国語)", "en": "Column Name (Chinese)" },
        columnNameJA: { "zh": "列名(日本語)", "ja": "列名(日本語)", "en": "Column Name (Japanese)" },
        columnNameEN: { "zh": "列名(English)", "ja": "列名(英語)", "en": "Column Name (English)" },
        columnTextAlign: { "zh": "列对齐方式", "ja": "列の配置", "en": "Column Text Align" },
        leftAlign: { "zh": "左对齐", "ja": "左揃え", "en": "Left Align" },
        centerAlign: { "zh": "居中对齐", "ja": "中央揃え", "en": "Center Align" },
        rightAlign: { "zh": "右对齐", "ja": "右揃え", "en": "Right Align" },
        columnWidthType: { "zh": "列宽度类型", "ja": "列幅タイプ", "en": "Column Width Type" },
        tight: { "zh": "紧凑", "ja": "タイト", "en": "Tight" },
        flex: { "zh": "自适应", "ja": "フレックス", "en": "Flex" },
        columnDisplayType: { "zh": "列显示类型", "ja": "列表示タイプ", "en": "Column Display Type" },
        textType: { "zh": "文本类型", "ja": "テキストタイプ", "en": "Text Type" },
        boolType: { "zh": "布尔类型", "ja": "ブールタイプ", "en": "Boolean Type" },
        tagType: { "zh": "标签类型", "ja": "タグタイプ", "en": "Tag Type" },
        columnFrameColor: { "zh": "列框架颜色", "ja": "列フレームカラー", "en": "Column Frame Color" },
        noFrameColor: { "zh": "无框架颜色", "ja": "フレームカラーなし", "en": "No Frame Color" },
        columnGroupType: { "zh": "列分组类型", "ja": "列グループタイプ", "en": "Column Group Type" },
        alphabet: { "zh": "按首字母分组", "ja": "アルファベット順でグループ化", "en": "Group by Alphabet" },
        columnDisplayIndex: { "zh": "列显示索引", "ja": "列表示インデックス", "en": "Column Display Index" },
        addNewColumn: { "zh": "添加新列", "ja": "新しい列を追加", "en": "Add New Column" },
        deleteColumn: { "zh": "删除列", "ja": "列を削除", "en": "Delete Column" },
        newError: { "zh": "新建失败", "ja": "新規作成に失敗しました", "en": "Failed to create new item" },
        // 提交
        notEmpty: { "zh": "可填项目不能为空", "ja": "空欄は空にできません", "en": "Blank cannot be empty" },
        noConflict: { "zh": "列键不能与已有的列冲突", "ja": "列キーは既存の列と競合できません", "en": "Cannot conflict with existing column keys" },
        notValidName: { "zh": "列名不合法", "ja": "列名が無効です", "en": "Invalid column name" },
        // 导入
        importDatabase: { "zh": "导入一个数据库文件", "ja": "データベースファイルをインポートする", "en": "Import a database file" },
        uploadFile: { "zh": "上传文件", "ja": "アップロードファイル", "en": "Upload File" },
        importError: { "zh": "导入失败", "ja": "インポートに失敗しました", "en": "Failed to import" },
        // 导出
        exportDatabase: { "zh": "导出一个数据库文件", "ja": "データベースファイルをエクスポートする", "en": "Export a database file" },
        exportSelect: { "zh": "选择导出的数据库", "ja": "エクスポートするデータベースを選択してください", "en": "Please select the database to export" },
        exportError: { "zh": "导出失败", "ja": "エクスポートに失敗しました", "en": "Failed to export" },
        // 删除
        deleteErrorText: { "zh":"请选择要删除的数据库", "ja":"削除するデータベースを選択してください", "en":"Please select the database to delete" },
        deleteConfirm1: { "zh": "确认要删除", "ja": "", "en": "Are you sure to delete" },
        deleteConfirm2: { "zh": "吗？", "ja": "を削除しますか？", "en": "?" },
        deleteFile: { "zh": "同时删除文件本体", "ja": "ファイル本体も削除する", "en": "Also delete the file itself" },
        deleteError: { "zh": "删除失败", "ja": "削除に失敗しました", "en": "Failed to delete" },
        // 编辑
        editErrorText: { "zh":"请选择要编辑的数据库", "ja":"編集するデータベースを選択してください", "en":"Please select the database to edit" },
        editError: { "zh": "编辑失败", "ja": "編集に失敗しました", "en": "Failed to edit" },
        // 保存
        saveSuccess: { "zh": "保存成功", "ja": "保存成功", "en": "Saved successfully" },
        // 关闭
        closeNotSaved: { "zh": "数据库尚未保存", "ja": "データベースはまだ保存されていません", "en": "Database is not saved yet" },

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

        // 表格
        loading: { "zh": "加载中", "ja": "読み込み中", "en": "Loading" },
        getError: { "zh": "获取数据失败", "ja": "データの取得に失敗しました", "en": "Failed to get data" }
    },
    getText(key: keyof typeof this.text) {
        return this.text[key][this.currentLang]
    }
}

export default languages