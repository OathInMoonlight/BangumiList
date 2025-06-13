export default {
    url: "http://localhost",
    port: 3001,

    getData(api, callback) {
        fetch(this.url + ":" + this.port + "/" + api)
            .then(response => response.json())
            .then(rdata => callback(rdata))
            .catch(err => callback(err))
    },
    getFile(api, fileName, callback){
        try{
            window.open(this.url + ":" + this.port + "/" + api + "?fileName=" + fileName)
        }
        catch (err) {
            callback(err)
        }
    },
    postData(api, data, callback) {
        fetch(this.url + ":" + this.port + "/" + api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(rdata => callback(rdata))
            .catch(err => callback(err))
    },
    postFile(api, data, callback){
        const formData = new FormData()
        formData.append("fileName", data.fileName)
        formData.append("file", data.file)
        fetch(this.url + ":" + this.port + "/" + api, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(rdata => callback(rdata))
            .catch(err => callback(err))
    }
}