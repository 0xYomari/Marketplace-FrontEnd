import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import contractAddress from "../constants/contractAddress.json"
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../constants/subgraphQuery"

export default function Home() {
    //We will index the events off-chain and then read from our database.
    // Setup a server to listen for those events to be fired, and we will add them to a database.

    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = contractAddress[chainString][0]

    // const { loading, error, data: listedItems } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl"> Listed Items</h1>
            <div className="flex flex-wrap"></div>
        </div>
    )
}
