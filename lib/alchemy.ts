import { Alchemy, Network } from "alchemy-sdk";

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key
    network: Network.ETH_SEPOLIA, // Replace with the desired network
}

const alchemy = new Alchemy(settings);

export default alchemy;


