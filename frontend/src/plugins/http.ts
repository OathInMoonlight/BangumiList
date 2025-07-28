import type { Http } from "@/plugins/types"

const http: Http = {
    url: "http://localhost",
    port: 3001,

    getData(api, mainDataRow, callback) {
        fetch(`${this.url}:${this.port}/${api}?mainDataRow=${mainDataRow}`)
            .then(response => response.json())
            .then(result => callback("success", result))
            .catch(error => callback(error.message, null))
    },
    postData(api, mainDataRow, data, callback) {
        fetch(`${this.url}:${this.port}/${api}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ mainDataRow, data })
        })
            .then(response => response.json())
            .then(result => callback("success", result))
            .catch(error => callback(error.message, null))
    },
    getFile(api, mainDataRow, callback) {
        try {
            window.open(`${this.url}:${this.port}/${api}?mainDataRow=${mainDataRow}`)
        }
        catch (error) {
            if(error instanceof Error) {
                callback(error.message, null)
            } else {
                callback(String(error), null)
            }
        }
    },
    postFile(api, mainDataRow, file, callback) {
        fetch(`${this.url}:${this.port}/${api}`, {
            method: "POST",
            body: file
        })
            .then(response => response.json())
            .then(result => callback("success", result))
            .catch(error => callback(error.message, null))
    }
}

export default http