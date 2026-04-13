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

    databaseLoaded: boolean,
    databaseData: DatabaseData | null,
    isChildTable: boolean,


    contentsType: "grid" | "table" | "statistic",
    gridSize: "small" | "default" | "large",
    filterText: string
}