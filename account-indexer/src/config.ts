import { EvmChain } from '@moralisweb3/common-evm-utils';
import Moralis from "moralis";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { config } from 'dotenv'

config()


const BALANCE_REQUEST_WAIT_TIME = 2000
const NUMBER_OF_BALANCE_REQUESTS_BEFORE_LIMIT = 30
const TRANSACTIONS_REQUESTS_WAIT_TIME = 500
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;


if (!MORALIS_API_KEY) {
    throw new Error("Moralis API Key is not set. Please set the MORALIS_API_KEY environment variable or replace the placeholder.");
}
if (!ALCHEMY_API_KEY) {
    console.warn("warning: Alchemy API Key is not set. Some features may not work as expected.");
}

const startMoralis = async () => {
    console.log("Starting Moralis...");
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    })
    console.log("Moralis started successfully.");
    return Moralis

}

const basePublicClient = createPublicClient({
    chain: base,
    transport: http(ALCHEMY_API_KEY ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` : ""),
})

const supportedChains = {
    base: {
        moralisChain: EvmChain.BASE,
        viemPublicClient: basePublicClient,
    }
}

export { startMoralis, supportedChains, BALANCE_REQUEST_WAIT_TIME, NUMBER_OF_BALANCE_REQUESTS_BEFORE_LIMIT, TRANSACTIONS_REQUESTS_WAIT_TIME };

