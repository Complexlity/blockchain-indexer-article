import fs from 'fs';
import { supportedChains } from './config';
import { getBalanceHistory, getFilteredUserTransactions } from './queries-new';
// const ADDRESS = "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401" //Dummy Address
// const ADDRESS = "0xe06Dacf8a98CBbd9692A17fcb8e917a6cb5e65ED"
const ADDRESS = "0x8ff47879d9eE072b593604b8b3009577Ff7d6809"


const filteredUserTransactions = await getFilteredUserTransactions(ADDRESS, supportedChains.base.moralisChain)
//@ts-ignore
const balanceHistory = await getBalanceHistory(ADDRESS, filteredUserTransactions, supportedChains.base.viemPublicClient)
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}
fs.writeFileSync(`./data/new-${ADDRESS}.json`, JSON.stringify(balanceHistory, null, 2), 'utf-8');


