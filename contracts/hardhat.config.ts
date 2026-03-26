import { defineConfig, configVariable } from "hardhat/config";
import HardhatToolbox from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
    plugins: [HardhatToolbox],
    solidity: "0.8.20",
    networks: {
        sepolia: {
            type: "http",
            url: configVariable("SEPOLIA_RPC_URL"),
            accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
        },
    },
});
