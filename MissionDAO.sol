// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SoulvanCoin.sol";

contract MissionDAO {
    struct Proposal {
        uint256 id;
        string title;
        string metadataURI; // IPFS/Arweave link to mission seed
        uint256 deadline;
        uint256 approveVotes;
        uint256 rejectVotes;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;

    SoulvanCoin public token;

    event ProposalCreated(uint256 id, string title, string metadataURI, uint256 deadline);
    event VoteCast(uint256 id, address voter, bool approve);
    event ProposalExecuted(uint256 id, bool approved);

    constructor(address _token) {
        token = SoulvanCoin(_token);
    }

    function createProposal(string memory _title, string memory _metadataURI, uint256 _duration) external {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            metadataURI: _metadataURI,
            deadline: block.timestamp + _duration,
            approveVotes: 0,
            rejectVotes: 0,
            executed: false
        });
        emit ProposalCreated(proposalCount, _title, _metadataURI, block.timestamp + _duration);
    }

    function vote(uint256 _id, bool _approve) external {
        require(block.timestamp < proposals[_id].deadline, "Voting closed");
        require(!hasVoted[_id][msg.sender], "Already voted");

        hasVoted[_id][msg.sender] = true;
        if (_approve) {
            proposals[_id].approveVotes++;
        } else {
            proposals[_id].rejectVotes++;
        }
        emit VoteCast(_id, msg.sender, _approve);
    }

    function executeProposal(uint256 _id) external {
        Proposal storage p = proposals[_id];
        require(block.timestamp >= p.deadline, "Voting not ended");
        require(!p.executed, "Already executed");

        p.executed = true;
        bool approved = p.approveVotes > p.rejectVotes;
        emit ProposalExecuted(_id, approved);
    }
}