# Monster Mint NFT
Proof of concept using BSN DDC smart contracts and its OpenApi.
## Features

- DDC721
- BSN OpenAPI
- IPFS

## Installation

Requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i
node ./scripts/api/server.js
```

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8082
```
Create .env on the project root directory
Provide the following keys with your own value:
- MONSTER_TOKEN
- BSN_DDC_API_TOKEN
- PRIVATE_KEY

You would also need to update your own cnfiguration in config/default.json.
