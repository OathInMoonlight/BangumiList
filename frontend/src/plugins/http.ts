import type { Http } from "@/plugins/types"

const http: Http = {
    url: "http://localhost",
    port: 3001,

    async getData(api, mainDataRow) {
        try {
            const response = await fetch(`${this.url}:${this.port}/${
                api}?mainDataRow=${JSON.stringify(mainDataRow)}`)
            return { status: "success", result: await response.json() }
        } catch (error) {
            return { status: String(error) }
        }
    },
    async postData(api, mainDataRow, data) {
        try {
            await fetch(`${this.url}:${this.port}/${api}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ mainDataRow, data })
            })
            return { status: "success" }
        } catch (error) {
            return { status: String(error) }
        }
    },
    async getFile(api, mainDataRow) {
        try {
            await window.open(`${this.url}:${this.port}/${api}?mainDataRow=${mainDataRow}`)
            return { status: "success" }
        } catch (error) {
            return { status: String(error) }
        }
    },
    async postFile(api, file) {
        try {
            await fetch(`${this.url}:${this.port}/${api}`, {
                method: "POST",
                body: file
            })
            return { status: "success" }
        } catch (error) {
            return { status: String(error) }
        }
    }
}

export default http