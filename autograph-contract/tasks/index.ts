import "@nomicfoundation/hardhat-toolbox-viem";
import { task, types } from 'hardhat/config'
import deploymentAddresses from '../../oldcontract/ignition/deployments/chain-31337/deployed_addresses.json'
import { Address } from "viem";

const dummyMessageArray = [
    'hello', 'world', 'welcome', 'to', 'my', 'very', 'good', 'flower', 'channel'
    , 'infact', 'pleasure', 'meeting', 'yourself'
]
const dummyLocationArray = [
    'Reyvjavik', 'Rome', 'Milan', 'Dallas', 'Cameroun', 'Cape Town', 'Bucharest',
    'Treste', 'Madrid', 'Sau Paulo', 'Paris'
]

function pickRandomItem<T,>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

task('sign', "This creates a new signature").addOptionalParam('delay', 'The wait time', 2, types.int).setAction(async (taskArgs, hre) => {
    const delayTime = taskArgs.delay

    const accounts = await hre.viem.getWalletClients()
    const autographContractAddress = deploymentAddresses["AutographModule#Autograph"] as Address
    const autographContract = await hre.viem.getContractAt("Autograph", autographContractAddress)


    async function delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time * 1000));

    }


    for (let i = 0; i < accounts.length; i++) {
        const currentAccount = accounts[i]
        const message = pickRandomItem(dummyMessageArray)
        const location = pickRandomItem(dummyLocationArray)
        console.log({ message, location, signer: currentAccount.account.address })
        if (!message || !location) {
            console.log("Messsage or location missing")
            continue
        }
        console.log(`Signature... ${i + 1}`)
        await autographContract.write.sign([message, location], {
            account: currentAccount.account
        })
        console.log("Delaying...")
        await delay(delayTime)
        console.log('Done')
    }

})