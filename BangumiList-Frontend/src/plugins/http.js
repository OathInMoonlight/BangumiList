export default {
    url: "http://localhost",
    port: 3001,
    getData(api, callback) {
        fetch(this.url + ':' + this.port + '/' + api)
        .then(response => response.json())
        .then(rdata => callback(rdata))
        .catch(err => console.error(err))
    },
    postData(api, data, callback) {
        fetch(this.url + ':' + this.port + '/' + api, {
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