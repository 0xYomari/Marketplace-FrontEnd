const Moralis = require("moralis-v1/node")
require("dotenv").config()
const contractAddresses = require("./constants/contractAddress.json")
let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddress = contractAddresses[chainId][0]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with contract address ${contractAddress}`)

    let itemAddedOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemAdded(string,uint256, uint256, address, address, bool)",
        address: contractAddress,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "string",
                    name: "itemName",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "unit",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "listed",
                    type: "bool",
                },
            ],
            name: "ItemAdded",
            type: "event",
        },
        tableName: "ItemAdded",
    }
    let ItemToSellerOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemToSeller( address, string)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "itemName",
                    type: "string",
                },
            ],
            name: "ItemToSeller",
            type: "event",
        },
        tableName: "ItemToSeller",
    }
    let itemSoldToOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemSoldTo( address, string)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "itemName",
                    type: "string",
                },
            ],
            name: "ItemSoldTo",
            type: "event",
        },
        tableName: "ItemSoldTo",
    }
    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemAddedOptions, {
        useMasterKey: true,
    })
    const sellerResponse = await Moralis.Cloud.run("watchContractEvent", ItemToSellerOptions, {
        useMasterKey: true,
    })

    const buyerResponse = await Moralis.Cloud.run("watchContractEvent", itemSoldToOptions, {
        useMasterKey: true,
    })
    if (listedResponse.success && sellerResponse.success && buyerResponse.success) {
        console.log("Success! Database updated with watching events.")
    } else {
        console.log("Something went wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
