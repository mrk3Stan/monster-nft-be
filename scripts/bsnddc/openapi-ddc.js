require('dotenv').config()
const { env } = require('process')
const config = require('config')

const queryBsnDdc = async () => {
    const response = await fetch(`${config.get('BSNDDC.OpenApi.urlBase')}/ddcoai/sys/v1/ddcsearch/ddc/searches`, { 
        method: 'POST', 
        headers: { 'apiToken': env.BSN_DDC_API_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "data": {
                "ddcIdOrDdcOwner": config.get('chainAddress'),
                "ddcType": 721,
                "opbChainId": 4
            },
            "page": { "pageNum": 1, "pageSize": 100 }
        })
    })
    const data = await response.json()
    return data
}

module.exports = { queryBsnDdc }