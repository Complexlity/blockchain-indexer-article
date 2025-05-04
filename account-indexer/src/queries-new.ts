import { EvmChain, EvmTransaction } from "@moralisweb3/common-evm-utils";
import { RATE_LIMIT_WAIT_TIME, startMoralis } from "./config";
import { createPublicClient, formatEther, PublicClient, type Address } from "viem";

const Moralis = await startMoralis();
type TransactionResult = ReturnType<Awaited<ReturnType<typeof Moralis.EvmApi.transaction.getWalletTransactions>>["toJSON"]>["result"][0]

type BalanceHistory = {
    timestamp: Date;
    balanceEth: number;
    balanceWei: string;
    transactionHash?: string;
}
export async function getFilteredUserTransactions(address: Address, chain: EvmChain): Promise<TransactionResult[]> {
    const allUserTransactions: TransactionResult[] = [];
    console.log(`Fetching all transactions for address: ${address} on chain: ${chain.name}...`);
    let cursor;

    try {
        do {
            console.log("Fetching a page of transactions...");
            const response = await Moralis.EvmApi.transaction.getWalletTransactions({
                address: address,
                chain: chain,
                limit: 100,
                cursor: cursor,
                order: 'ASC'
            });

            const results = response.toJSON().result;
            allUserTransactions.push(...results);

            cursor = response.toJSON().cursor
            console.log("Current cursor:", cursor?.slice(0, 10));
            console.log(`Fetched ${results.length} transactions. Total fetched: ${allUserTransactions.length}. More pages? ${!!cursor}`);

            if (cursor) {
                console.log("Adding delay to avoid rate limiting...");
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log("Delay complete.");
            }
        } while (cursor);

        console.log(`Finished fetching transactions. Total transactions found: ${allUserTransactions.length}`);

        if (allUserTransactions.length === 0) {
            return allUserTransactions
        }

        // Filter out transactions with value <= 0
        // const filteredUserTransactions = allUserTransactions.filter(tx => Number(tx.value) > 0);

        return allUserTransactions
        // return allUserTransactions

    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return [];
    }
}

export async function getBalanceHistory<T extends PublicClient>(address: Address, transactions: TransactionResult[], client: T) {
    console.log("Fetching current balance...");
    const currentBalanceWei = await client.getBalance({ address: address });
    const currentBalanceEth = formatEther(currentBalanceWei);
    console.log(`Current balance: ${currentBalanceEth} ETH`);

    console.log("Calculating balance history...");
    const balanceHistory: BalanceHistory[] = [];

    let previousBalanceWei = currentBalanceWei;
    let i = 0;

    for (const tx of transactions) {
        const txTimestamp = new Date(tx.block_timestamp);
        const blockNumber = BigInt(tx.block_number);

        const balanceWeiAtBlockNumber = await client.getBalance({
            address: address, blockNumber
        });

        // Calculate the balance change
        const balanceChangeWei = previousBalanceWei - balanceWeiAtBlockNumber;
        const balanceChangeEth = parseFloat(formatEther(balanceChangeWei));

        // Only save to balance history if the balance change is significant
        if (Math.abs(balanceChangeEth) > 0.001) {
            balanceHistory.push({
                timestamp: txTimestamp,
                balanceEth: parseFloat(formatEther(balanceWeiAtBlockNumber)),
                balanceWei: balanceWeiAtBlockNumber.toString(),
                transactionHash: tx.hash,
            });
            previousBalanceWei = balanceWeiAtBlockNumber; // Update the previous balance
        }

        // Wait 5 seconds after every 30 get balance requests
        if (i % 30 === 0) {
            console.log("Waiting to avoid rate limiting issues");
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WAIT_TIME));
            console.log(`Waited ${RATE_LIMIT_WAIT_TIME / 1000} seconds to avoid rate limiting issues`);
        }
        i++;
    }

    const lastItem = balanceHistory[balanceHistory.length - 1];
    if (lastItem?.balanceWei !== currentBalanceWei.toString()) {
        // Insert the current balance if it's significantly different
        balanceHistory.push({
            timestamp: new Date(),
            balanceEth: parseFloat(currentBalanceEth),
            balanceWei: currentBalanceWei.toString(),
        });
    }

    return balanceHistory;
}
