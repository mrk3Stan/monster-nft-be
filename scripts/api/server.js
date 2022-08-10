require('dotenv').config()
const app = require('express')()
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')
const fse = require('fs-extra')
const config = require('config')

const { uploadToWeb3Storage, generateAndUploadJson } = require('./../storage/web3-storage.js')
const { mintNFT, getBalance, totalDDC, setUri } = require('./../bsnddc/ddc-721.js')
const { queryBsnDdc } = require('./../bsnddc/openapi-ddc')

const port = config.get('port')

const server = app.listen(port, function () {
    const host = server.address().address
    const port = server.address().port
    console.log(`App listening at http://${host}:${port}`)
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

app.use(cors())
app.use(bodyParser.json())  // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer({storage: fileStorage}).single('upload'))

app.get('/', (_, res) => {
    res.status(200).send("Monster Mint NFT!")
})

app.get('/mintcheck/:address', async (req, res) => {
    let balance = await getBalance(req.params.address)
    balance = balance.toBigInt()
    console.log(balance)
    if (balance > config.get('minMintingBalance')) {
        res.status(200).send(true)
    } else {
        res.status(200).send(false)
    }
})

app.post('/mint', async (req, res) => {
    const ddcUri = await uploadToWeb3Storage(`uploads/${req.file.originalname}`)
    const explorerLink = await mintNFT(ddcUri)
    const [jsonUri, ddcId] = await generateAndUploadJson(req.body, ddcUri)
    let explorerLink2 = ""
    if (ddcId !== 0) {
        explorerLink2 = await setUri(jsonUri, ddcId)
    }
    res.status(200).send(`Explorer URL - ${explorerLink} | ${explorerLink2}`)
})

app.get('/getbalance/:address', async (req, res) => {
    const balance = await getBalance(req.params.address)
    res.send(balance.toString())
})

app.get('/gettotalddc/:address', async function(req, res) {
    const _totalDDC = await totalDDC(req.params.address)
    res.send(_totalDDC.toString())
})

/**
 * query bsn ddc's of the account
 */
app.get('/qbsnddc', async function(req, res) {
    let data = await queryBsnDdc()
    res.send(data)
})