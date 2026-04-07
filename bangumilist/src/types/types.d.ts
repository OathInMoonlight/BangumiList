import type { LanguageType } from "./dataTypes"

export interface Languages {
    langList: { label: string, value: LanguageType }[],
    currentLang: LanguageType,
    text: { [ key: string ]: { [ lang in LanguageType ]: string } },
    getText(key: keyof typeof this.text): string
}

export interface Global {
    lang: Languages,
    globalZoom: number,
    primaryColor: string,
    contentsType: "grid" | "table",
    gridSize: "small" | "default" | "large",
    filterText: string,
    settingPage: boolean
}