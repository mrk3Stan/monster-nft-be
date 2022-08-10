require('dotenv').config()
const { env } = require('process')
const { Web3Storage, getFilesFromPath } = require('web3.storage')
const { createJsonFile } = require('./../storage/local-storage.js')
const { queryBsnDdc } = require('./../bsnddc/openapi-ddc')

const jsonQuery = require('json-query')

async function uploadToWeb3Storage(path) {
    const token = env.MONSTER_TOKEN
    if (!token) {
        return console.error('A token is needed. You can create one on https://web3.storage')
    }
    const storage = new Web3Storage({ token })
    const files = await getFilesFromPath(path)
    const fileName = files[0].name
    console.log(`Uploading ${fileName} files`)
    const cid = await storage.put(files, {name: fileName})
    console.log('Content added with CID:', cid)
    return `https://${cid}.ipfs.dweb.link${fileName}`
}

async function generateAndUploadJson(reqBody, ddcUri) {
    try {
        const ddcData = await queryBsnDdc()
        console.log(ddcData)
        console.log(`ddcUri - ${ddcUri}`)
        const result = jsonQuery(`data[**][*ddcUri=${ddcUri}]`, { data: ddcData }).value
        const ddcId = result[0]['ddcId']
        const jsonFile = await createJsonFile(reqBody, ddcUri, ddcId)
        const jsonUri = await uploadToWeb3Storage(jsonFile)
        return [jsonUri, ddcId]
    } catch (err) {
        console.log(err)
        return [ddcUri, 0]
    }
}

module.exports = { uploadToWeb3Storage, generateAndUploadJson }