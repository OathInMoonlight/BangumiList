import type { LanguageType, DatabaseData } from "./dataTypes"
import type { GlobalTheme } from "naive-ui"

export interface Languages {
    langList: { label: string, value: LanguageType }[],
    currentLang: LanguageType,
    text: { [ key: string ]: { [ lang in LanguageType ]: string } },
    getText(key: keyof typeof this.text): string
}

export interface Global {
    lang: Languages,
    settingPage: boolean,
    globalZoom: number,
    darkMode: GlobalTheme | null,
    primaryColor: string,
    page: "open" | "edit" | "contents" | "newRow" | "row",

    databaseLoaded: boolean,
    databaseSaved: boolean,
    databaseData: DatabaseData | null,
    isChildTable: boolean,

    contentsType: "grid" | "table" | "statistic",
    gridSize: "small" | "default" | "large",
    filterText: string

    selectedRow: { primary: number | null, child: number | null },

    errorDialog: (dialog: DialogApiInjection, errorMessage: unknown) => void
}