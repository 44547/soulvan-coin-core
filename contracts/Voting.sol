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
        require(!voted[msg.sender][proposalId], "Already voted");
        proposals[proposalId].voteCount++;
        voted[msg.sender][proposalId] = true;
    }
}