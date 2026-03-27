// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RentWatchEscrow {
    struct PaymentRecord {
        bytes32 dataHash;
        uint256 timestamp;
        address lockedBy;
    }

    mapping(string => PaymentRecord) public records;
    address public owner;

    event PaymentLocked(
        string indexed paymentId,
        string leaseId,
        bytes32 dataHash,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function lock(
        string calldata paymentId,
        string calldata leaseId,
        bytes32 dataHash
    ) external onlyOwner {
        require(records[paymentId].timestamp == 0, "Already recorded");
        records[paymentId] = PaymentRecord(dataHash, block.timestamp, msg.sender);
        emit PaymentLocked(paymentId, leaseId, dataHash, block.timestamp);
    }

    function getRecord(string calldata paymentId)
        external
        view
        returns (bytes32, uint256, address)
    {
        PaymentRecord memory r = records[paymentId];
        return (r.dataHash, r.timestamp, r.lockedBy);
    }
}
