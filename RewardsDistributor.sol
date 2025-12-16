// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SoulvanCoin.sol";
import "./RemixDNA.sol";

contract RewardsDistributor {
    SoulvanCoin public token;
    RemixDNA public dna;
    address public dao;

    constructor(address _token, address _dao, address _dna) {
        token = SoulvanCoin(_token);
        dao = _dao;
        dna = RemixDNA(_dna);
    }

    /// @notice Distribute rewards based on Remix DNA lineage
    /// @param missionId The mission proposal ID
    /// @param totalReward The total reward pool for this mission
    function distributeRewards(uint256 missionId, uint256 totalReward) external {
        require(msg.sender == dao, "Only DAO can trigger rewards");

        RemixDNA.DNARecord[] memory records = dna.getDNA(missionId);
        require(records.length > 0, "No DNA records found");

        // Example weighting: 70% to original creator, 30% split among remixers
        uint256 originalShare = (totalReward * 70) / 100;
        uint256 remixShare = totalReward - originalShare;

        // First record assumed original creator
        token.mint(records[0].contributor, originalShare);

        if (records.length > 1) {
            uint256 perRemixer = remixShare / (records.length - 1);
            for (uint256 i = 1; i < records.length; i++) {
                token.mint(records[i].contributor, perRemixer);
            }
        }
    }
}