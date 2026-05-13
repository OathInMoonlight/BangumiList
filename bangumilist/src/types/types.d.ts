import type { LanguageType, DatabaseData } from "./dataTypes"
import type { GlobalTheme } from "naive-ui"

export interface Languages {
    langList: { label: string, value: LanguageType }[],
    currentLang: LanguageType,
    text: { [ key: string ]: { [ lang in LanguageType ]: string } },
    getText(key: keyof typeof this.text): string
}

export type FirstLetterType =
    "a" | "b" | "c" | "d" |
    "e" | "f" | "g" | "h" |
    "i" | "j" | "k" | "l" |
    "m" | "n" | "o" | "p" |
    "q" | "r" | "s" | "t" |
    "u" | "v" | "w" | "x" |
    "y" | "z" | "#"

export interface LanguageTool {
    detectLanguage: (letter: string) => LanguageType | "#",
    getTextLength: (text: string) => number,
    getPinyinInitial: (letter: string) => FirstLetterType,
    getKanaInitial: (letter: string) => FirstLetterType,
    getAlphabetInitial: (letter: string) => FirstLetterType,
    getFirstLetter: (text: string) => FirstLetterType
}

export interface Global {
    lang: Languages,
    settingPage: boolean,
    globalZoom: number,
    darkMode: GlobalTheme | null,
    primaryColor: string,
    page: "open" | "edit" | "contents" | "newRow" | "row" | "import" | "export",

    databaseLoaded: boolean,
    databaseSaved: boolean,
    databaseData: DatabaseData | null,
    isChildTable: boolean,

    contentsType: "grid" | "table" | "statistic",
    gridSize: "small" | "default" | "large",
    filterText: string

    selectedRow: { primary: number | null, child: number | null },

    errorDialog: (dialog: DialogApiInjection, errorMessage: unknown) => void,
    langTool: LanguageTool
}