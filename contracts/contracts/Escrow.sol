// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RentWatchEscrow {
    struct PaymentRecord {
        bytes32 dataHash;
        uint256 timestamp;
        address lockedBy;
        bool released;
    }

    mapping(string => PaymentRecord) public records;

    event PaymentLocked(string leaseId, bytes32 dataHash, uint256 timestamp);
    event PaymentReleased(string leaseId, uint256 timestamp);
    event PaymentRefunded(string leaseId, uint256 timestamp);

    function lock(string calldata leaseId, bytes32 dataHash) external {
        require(records[leaseId].timestamp == 0, "Already locked");
        records[leaseId] = PaymentRecord(dataHash, block.timestamp, msg.sender, false);
        emit PaymentLocked(leaseId, dataHash, block.timestamp);
    }

    function release(string calldata leaseId) external {
        require(records[leaseId].timestamp != 0, "No record found");
        require(!records[leaseId].released, "Already released");
        records[leaseId].released = true;
        emit PaymentReleased(leaseId, block.timestamp);
    }

    function refund(string calldata leaseId) external {
        require(records[leaseId].timestamp != 0, "No record found");
        records[leaseId].released = true;
        emit PaymentRefunded(leaseId, block.timestamp);
    }

    function getRecord(string calldata leaseId) external view
        returns (bytes32, uint256, address, bool) {
        PaymentRecord memory r = records[leaseId];
        return (r.dataHash, r.timestamp, r.lockedBy, r.released);
    }
}
