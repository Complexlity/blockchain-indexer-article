import { expect } from 'chai';
import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';

describe('Autograph', function () {
    async function deployAutographContract() {
        const [signer] = await hre.viem.getWalletClients();
        const publicClient = await hre.viem.getPublicClient();

        const AutographContract = await hre.viem.deployContract('Autograph');

        return { AutographContract, signer, publicClient };
    }

    it('should emit Signature event when signed', async function () {
        const { AutographContract, signer, publicClient } = await loadFixture(deployAutographContract);

        const message = 'Hello from Web3!';
        const location = 'New York City';

        const tx = await AutographContract.write.sign([message, location], {
            account: signer.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

        const events = await publicClient.getContractEvents({
            address: AutographContract.address,
            abi: AutographContract.abi,
            eventName: 'Signature',
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
        });

        expect(events.length).to.equal(1);
        const event = events[0].args;

        expect(event.signer?.toLowerCase()).to.equal(signer.account.address.toLowerCase());
        expect(event.message).to.equal(message);
        expect(event.location).to.equal(location);
        expect(event.timestamp).to.be.a('bigint');
        expect(Number(event.timestamp)).to.be.greaterThan(0);
    });
});
