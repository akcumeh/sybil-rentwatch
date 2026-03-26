import hre from "hardhat";

async function main() {
    const connection = await hre.network.connect();
    const Contract = await connection.ethers.getContractFactory("RentWatchEscrow");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();
    console.log("Deployed to:", await contract.getAddress());
}

main().catch(console.error);
