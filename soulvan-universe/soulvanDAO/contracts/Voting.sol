// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Proposal {
        uint id;
        string description;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => mapping(uint => bool)) public voted;

    function createProposal(string memory desc) public {
        proposals.push(Proposal(proposals.length, desc, 0));
    }

    function vote(uint proposalId) public {
        require(proposalId < proposals.length, "Invalid proposal");
        require(!voted[msg.sender][proposalId], "Already voted");
        proposals[proposalId].voteCount++;
        voted[msg.sender][proposalId] = true;
    }
}
