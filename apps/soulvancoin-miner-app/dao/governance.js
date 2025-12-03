/**
 * DAO Governance module
 * In-memory proposals and voting system
 */

class DAOGovernance {
  constructor() {
    this.proposals = [];
    this.nextId = 1;
  }

  createProposal(title, description, options = ['Yes', 'No']) {
    const proposal = {
      id: this.nextId++,
      title,
      description,
      options,
      votes: {},
      status: 'active',
      createdAt: Date.now(),
      createdBy: 'current_user',
      totalVotes: 0
    };

    // Initialize vote counts for each option
    options.forEach(option => {
      proposal.votes[option] = 0;
    });

    this.proposals.push(proposal);
    
    return {
      success: true,
      proposal
    };
  }

  vote(proposalId, option, voterAddress = 'demo_voter') {
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'active') {
      throw new Error('Proposal is not active');
    }

    if (!proposal.votes.hasOwnProperty(option)) {
      throw new Error('Invalid voting option');
    }

    // In a real system, we'd track individual voters
    // For demo, just increment the count
    proposal.votes[option]++;
    proposal.totalVotes++;

    return {
      success: true,
      message: `Vote recorded for option: ${option}`,
      proposal
    };
  }

  getProposal(proposalId) {
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    return proposal;
  }

  listProposals(status = null) {
    if (status) {
      return this.proposals.filter(p => p.status === status);
    }
    return this.proposals;
  }

  closeProposal(proposalId) {
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    proposal.status = 'closed';
    proposal.closedAt = Date.now();

    // Determine winning option
    let maxVotes = 0;
    let winner = null;
    
    Object.entries(proposal.votes).forEach(([option, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = option;
      }
    });

    proposal.result = winner;

    return {
      success: true,
      message: 'Proposal closed',
      proposal,
      winner
    };
  }

  getStats() {
    const total = this.proposals.length;
    const active = this.proposals.filter(p => p.status === 'active').length;
    const closed = this.proposals.filter(p => p.status === 'closed').length;
    const totalVotes = this.proposals.reduce((sum, p) => sum + p.totalVotes, 0);

    return {
      total,
      active,
      closed,
      totalVotes
    };
  }
}

module.exports = { DAOGovernance };
