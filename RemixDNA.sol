// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RemixDNA {
    struct DNARecord {
        uint256 missionId;
        address contributor;
        string assetHash;     // IPFS/Arweave hash of asset
        string lineageHash;   // Hash of parent remix lineage
        uint256 timestamp;
    }

    mapping(uint256 => DNARecord[]) public missionDNA;

    event DNAAnchored(uint256 missionId, address contributor, string assetHash, string lineageHash);

    function anchorDNA(
        uint256 _missionId,
        address _contributor,
        string memory _assetHash,
        string memory _lineageHash
    ) external {
        DNARecord memory record = DNARecord({
            missionId: _missionId,
            contributor: _contributor,
            assetHash: _assetHash,
            lineageHash: _lineageHash,
            timestamp: block.timestamp
        });
        missionDNA[_missionId].push(record);
        emit DNAAnchored(_missionId, _contributor, _assetHash, _lineageHash);
    }

    function getDNA(uint256 _missionId) external view returns (DNARecord[] memory) {
        return missionDNA[_missionId];
    }
}