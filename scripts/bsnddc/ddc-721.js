require('dotenv').config()
const { ethers } = require("ethers")
const config = require('config')

const DDC721_ABI = [
    "function mint(address, string memory) external",
    "function balanceOf(address) external view returns (uint256)",
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)",
    "function ddcURI(uint256) external view returns (string memory)",
    "function ownerOf(uint256) public view override returns (address)"
]
const provider = new ethers.providers.JsonRpcProvider(`${config.get('BSNDDC.gatewayUrlBase')}/api/${config.get('projectId')}/rpc`)
const ddc721Contract = new ethers.Contract(config.get('BSNDDC.DDC721Address'), DDC721_ABI, provider)
const privateKey = process.env.PRIVATE_KEY
const wallet = new ethers.Wallet(privateKey, provider)

const mintNFT = async (_ddcURI) => {
    try {
        console.log(`chain address - ${config.get("chainAddress")}`)
        const tx = await ddc721Contract.connect(wallet).mint(config.get('chainAddress'), _ddcURI)
        // await tx.wait()
        console.log(tx)
        return `${config.get('BSNDDC.explorerUrlBase')}/tx/${tx.hash}`
    } catch (err) {
        console.log(err)
        return err
    }
}

const setUri = async (_ddcId, _ddcUri) => {
    try {
        const tx = await ddc721Contract.connect(wallet).setURI(_ddcId, _ddcURI)
        console.log(tx)
        return `${config.get('BSNDDC.explorerUrlBase')}/tx/${tx.hash}`
    } catch (err) {
        console.log(err)
        return err
    }
}

const getBalance = async (_address) => {
    let balance = await provider.getBalance(_address)
    return balance
}

const totalDDC = async (_address) => {
    const totalDDC = await ddc721Contract.balanceOf(_address)
    return totalDDC
}

module.exports = { mintNFT, getBalance, totalDDC, setUri }