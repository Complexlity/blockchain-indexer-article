import { EvmChain } from '@moralisweb3/common-evm-utils';
import Moralis from "moralis";
import fs from 'fs';
import { createPublicClient, formatEther, http, type Address } from "viem";
import { base } from "viem/chains";
const chain = EvmChain.BASE;

