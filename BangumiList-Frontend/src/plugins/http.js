export default {
    url: "http://localhost",
    port: 3001,
    async getData(api, callback) {
        await fetch(this.url + ":" + this.port + "/" + api)
            .then(response => response.json())
            .then(rdata => callback(rdata))
            .catch(err => console.error(err))
    },
    async postData(api, data, callback) {
        await fetch(this.url + ":" + this.port + "/" + api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(rdata => callback(rdata))
            .catch(err => console.error(err))
    }
}