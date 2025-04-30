import { createConfig } from "ponder";
import { http } from "viem";
import { baseSepolia } from "viem/chains";
import { AutographAbi } from "./abis/AutographAbi";
export default createConfig({
  networks: {
    baseSepolia: {
      chainId: baseSepolia.id,
      transport: http(),
    },
  },
  contracts: {
    Autograph: {
      network: "baseSepolia",
      abi: AutographAbi,
      address: "0x1852a7e0b37d8a08762053ea93bc140a5c58509f",
      //explorer: https://sepolia.basescan.org/address/0x1852a7e0b37d8a08762053ea93bc140a5c58509f#code

      //Block just before the contract was deployed. By default it starts from 0
      startBlock: 24946615
    }
  }
});
