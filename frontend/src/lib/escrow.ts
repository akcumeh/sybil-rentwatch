import { ethers } from 'ethers';
import EscrowABI from '@/contracts/RentWatchEscrow.json';

function getContract() {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer   = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
    return new ethers.Contract(process.env.CONTRACT_ADDRESS!, EscrowABI.abi, signer);
}

export async function lockPaymentOnChain(
    paymentId: string,
    leaseId: string,
    paymentData: object
): Promise<string> {
    const dataHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(paymentData))
    );
    const contract = getContract();
    const tx = await contract.lock(paymentId, leaseId, dataHash);
    await tx.wait();
    return tx.hash as string;
}

export async function getOnChainRecord(paymentId: string): Promise<{
    dataHash: string;
    timestamp: number;
    lockedBy: string;
}> {
    const contract = getContract();
    const [dataHash, timestamp, lockedBy] = await contract.getRecord(paymentId);
    return {
        dataHash:  dataHash as string,
        timestamp: Number(timestamp),
        lockedBy:  lockedBy as string,
    };
}
