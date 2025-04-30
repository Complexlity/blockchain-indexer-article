import fs from 'fs';
import { supportedChains } from './config';
import { getBalanceHistory, getFilteredUserTransactions } from './queries';
const ADDRESS = "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401" //Dummy Address


const filteredUserTransactions = await getFilteredUserTransactions(ADDRESS, supportedChains.base.moralisChain)

//@ts-ignore
const balanceHistory = await getBalanceHistory(ADDRESS, filteredUserTransactions, supportedChains.base.viemPublicClient)
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}
fs.writeFileSync(`./data/${ADDRESS}.json`, JSON.stringify(balanceHistory, null, 2), 'utf-8');


