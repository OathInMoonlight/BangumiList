import type { LanguageTool, FirstLetterType } from "../types/types"

const languageTool: LanguageTool = {
    detectLanguage(letter) {
        const kanaRegex = /[\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9F]/ // 平假名 + 片假名 + 半角片假名
        const hanziRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/ // 中日韩统一表意文字 + 扩展A
        const visibleAsciiRegex = /^[\x20-\x7E]+$/ // 只包含可见 ASCII 字符

        if (kanaRegex.test(letter)) {
            return "ja"
        } else if (hanziRegex.test(letter)) {
            return "zh"
        } else if (visibleAsciiRegex.test(letter)) {
            return "en"
        } else {
            return "#"
        }
    },
    getTextLength(text) {
        if(typeof text !== "string") {
            return 0
        }
        const singleLine = (line: string) => {
            let length = 0
            for(let i = 0; i < line.length && i < 512; i++) {
                const lang = this.detectLanguage(line[i])
                if(lang === "en" || lang === "#") {
                    length += 1
                } else {
                    length += 2
                }
            }
            return length
        }
        if(text.includes("\n") || text.includes("\r")) {
            return Math.max(...text.split(/\r\n|\r|\n/).map(singleLine))
        } else {
            return singleLine(text)
        }
    },
    getPinyinInitial(letter) {
        const alphabet = "abcdefghjklmnopqrstwxyz".split("") as FirstLetterType[]
        const initialHanzi = "驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳".split("")
        const collator = new Intl.Collator("zh")

        for (let i = 0; i < initialHanzi.length; i++) {
            if (collator.compare(letter, initialHanzi[i]) <= 0) {
                return alphabet[i]
            }
        }
        return "#"
    },
    getKanaInitial(letter) {
        const kana: { [ key: string ]: FirstLetterType } = {
            "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
            "ア": "a", "イ": "i", "ウ": "u", "エ": "e", "オ": "o",
            "ｱ": "a", "ｲ": "i", "ｳ": "u", "ｴ": "e", "ｵ": "o",

            "か": "k", "き": "k", "く": "k", "け": "k", "こ": "k",
            "カ": "k", "キ": "k", "ク": "k", "ケ": "k", "コ": "k",
            "ｶ": "k", "ｷ": "k", "ｸ": "k", "ｹ": "k", "ｺ": "k",

            "が": "g", "ぎ": "g", "ぐ": "g", "げ": "g", "ご": "g",
            "ガ": "g", "ギ": "g", "グ": "g", "ゲ": "g", "ゴ": "g",

            "さ": "s", "し": "s", "す": "s", "せ": "s", "そ": "s",
            "サ": "s", "シ": "s", "ス": "s", "セ": "s", "ソ": "s",
            "ｻ": "s", "ｼ": "s", "ｽ": "s", "ｾ": "s", "ｿ": "s",

            "ざ": "z", "じ": "z", "ず": "z", "ぜ": "z", "ぞ": "z",
            "ザ": "z", "ジ": "z", "ズ": "z", "ゼ": "z", "ゾ": "z",

            "た": "t", "ち": "t", "つ": "t", "て": "t", "と": "t",
            "タ": "t", "チ": "t", "ツ": "t", "テ": "t", "ト": "t",
            "ﾀ": "t", "ﾁ": "t", "ﾂ": "t", "ﾃ": "t", "ﾄ": "t",

            "だ": "d", "ぢ": "d", "づ": "d", "で": "d", "ど": "d",
            "ダ": "d", "ヂ": "d", "ヅ": "d", "デ": "d", "ド": "d",

            "な": "n", "に": "n", "ぬ": "n", "ね": "n", "の": "n",
            "ナ": "n", "ニ": "n", "ヌ": "n", "ネ": "n", "ノ": "n",
            "ﾅ": "n", "ﾆ": "n", "ﾇ": "n", "ﾈ": "n", "ﾉ": "n",

            "は": "h", "ひ": "h", "ふ": "h", "へ": "h", "ほ": "h",
            "ハ": "h", "ヒ": "h", "フ": "h", "ヘ": "h", "ホ": "h",
            "ﾊ": "h", "ﾋ": "h", "ﾌ": "h", "ﾍ": "h", "ﾎ": "h",

            "ば": "b", "び": "b", "ぶ": "b", "べ": "b", "ぼ": "b",
            "バ": "b", "ビ": "b", "ブ": "b", "ベ": "b", "ボ": "b",

            "ぱ": "p", "ぴ": "p", "ぷ": "p", "ぺ": "p", "ぽ": "p",
            "パ": "p", "ピ": "p", "プ": "p", "ペ": "p", "ポ": "p",

            "ま": "m", "み": "m", "む": "m", "め": "m", "も": "m",
            "マ": "m", "ミ": "m", "ム": "m", "メ": "m", "モ": "m",
            "ﾏ": "m", "ﾐ": "m", "ﾑ": "m", "ﾒ": "m", "ﾓ": "m",

            "や": "y", "ゆ": "y", "よ": "y",
            "ヤ": "y", "ユ": "y", "ヨ": "y",
            "ﾔ": "y", "ﾕ": "y", "ﾖ": "y",

            "ら": "r", "り": "r", "る": "r", "れ": "r", "ろ": "r",
            "ラ": "r", "リ": "r", "ル": "r", "レ": "r", "ロ": "r",
            "ﾗ": "r", "ﾘ": "r", "ﾙ": "r", "ﾚ": "r", "ﾛ": "r",

            "わ": "w", "ゐ": "w", "ゑ": "w", "を": "w", "ん": "n",
            "ワ": "w", "ヰ": "w", "ヱ": "w", "ヲ": "w", "ン": "n",
            "ﾜ": "w", "ｦ": "w", "ﾝ": "n",

            "ゔ": "v", "ヴ": "v",

            "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o",
            "ァ": "a", "ィ": "i", "ゥ": "u", "ェ": "e", "ォ": "o",
            "ｧ": "a", "ｨ": "i", "ｩ": "u", "ｪ": "e", "ｫ": "o",

            "ゃ": "y", "ゅ": "y", "ょ": "y",
            "ャ": "y", "ュ": "y", "ョ": "y",
            "ｬ": "y", "ｭ": "y", "ｮ": "y",

            "ゎ": "w", "ヮ": "w", "ヵ": "k", "ヶ": "k",
            "ヷ": "w", "ヸ": "w", "ヹ": "w", "ヺ": "w",

            "っ": "#", "ッ": "#", "ｯ": "#",
            "ー": "#", "〜": "#"
        }
        return kana[letter]
    },
    getAlphabetInitial(letter) {
        if(/[A-Za-z]/.test(letter)) {
            return letter.toLowerCase() as FirstLetterType
        }
        return "#"
    },
    getFirstLetter(text) {
        const initialInText = text[0]
        switch (this.detectLanguage(initialInText)) {
            case "zh":
                return this.getPinyinInitial(initialInText)
            case "ja":
                return this.getKanaInitial(initialInText)
            case "en":
                return this.getAlphabetInitial(initialInText)
            default:
                return "#"
        }
    }
}

export default languageTool