import { ethers } from 'ethers';
import contractABI from '@/contracts/RentWatchEscrow.json';

function getContract() {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
    return new ethers.Contract(
        process.env.CONTRACT_ADDRESS!,
        contractABI.abi,
        signer
    );
}

export async function lockPaymentOnChain(
    leaseId: string,
    paymentData: object
): Promise<string> {
    const dataHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(paymentData))
    );

    const contract = getContract();
    const tx = await contract.lock(leaseId, dataHash);
    await tx.wait();

    return tx.hash;
}

export async function releasePaymentOnChain(leaseId: string): Promise<string> {
    const contract = getContract();
    const tx = await contract.release(leaseId);
    await tx.wait();
    return tx.hash;
}