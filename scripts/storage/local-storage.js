const fse = require('fs-extra')

async function createJsonFile(reqBody, ddcUri, ddcId) {
    const jsonData = ` { "ddcUri": "${ddcUri}", "ddcId": ${ddcId}, "attributes": ${JSON.stringify(reqBody)} }`
    console.log(jsonData)
    const jsonFile = `temp/${ddcId}.json`
    fse.outputFile(jsonFile, jsonData, (err) => {
        if (err) {
            throw err
        }
        console.log("JSON data is saved.")
    })
    return jsonFile
}

module.exports = { createJsonFile }