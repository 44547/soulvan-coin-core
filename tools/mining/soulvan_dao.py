"""
Soulvan DAO - Decentralized Autonomous Organization voting system
Integrated with blockchain for identity style voting and governance
"""

from typing import Dict, List, Any
from datetime import datetime
import hashlib
import json

# DAO voting categories
VOTING_CATEGORIES = {
    "avatar_styles": ["cinematic", "neon", "cyberpunk", "anime", "realistic", "artistic"],
    "music_genres": ["trap", "afrobeats", "techno", "orchestral", "jazz", "reggaeton", "k-pop", "drill"],
    "truck_styles": ["neon", "chrome", "stealth", "anime", "cyberpunk"],
    "feature_proposals": []  # Community proposals
}

# Active proposals storage (in-memory, would be on-chain in production)
PROPOSALS = {}
VOTES = {}

def create_proposal(category: str, title: str, description: str, options: List[str], creator_wallet: str) -> Dict[str, Any]:
    """
    Create a new DAO proposal for voting
    
    Args:
        category: Voting category (avatar_styles, music_genres, truck_styles, feature_proposals)
        title: Proposal title
        description: Detailed description
        options: List of voting options
        creator_wallet: Wallet address of proposal creator
    
    Returns:
        Proposal details with ID and metadata
    """
    proposal_id = hashlib.sha256(f"{title}{datetime.now().isoformat()}{creator_wallet}".encode()).hexdigest()[:16]
    
    proposal = {
        "id": proposal_id,
        "category": category,
        "title": title,
        "description": description,
        "options": options,
        "creator": creator_wallet,
        "created_at": datetime.now().isoformat(),
        "status": "active",
        "votes": {option: 0 for option in options},
        "voters": []
    }
    
    PROPOSALS[proposal_id] = proposal
    return proposal

def cast_vote(proposal_id: str, option: str, voter_wallet: str) -> Dict[str, Any]:
    """
    Cast a vote on a proposal
    
    Args:
        proposal_id: ID of the proposal
        option: Selected voting option
        voter_wallet: Wallet address of voter
    
    Returns:
        Vote confirmation with updated proposal state
    """
    if proposal_id not in PROPOSALS:
        raise ValueError(f"Proposal {proposal_id} not found")
    
    proposal = PROPOSALS[proposal_id]
    
    if proposal["status"] != "active":
        raise ValueError(f"Proposal {proposal_id} is not active")
    
    if option not in proposal["options"]:
        raise ValueError(f"Invalid option: {option}")
    
    # Check if already voted
    if voter_wallet in proposal["voters"]:
        raise ValueError(f"Wallet {voter_wallet} has already voted on this proposal")
    
    # Record vote
    proposal["votes"][option] += 1
    proposal["voters"].append(voter_wallet)
    
    vote_record = {
        "proposal_id": proposal_id,
        "option": option,
        "voter": voter_wallet,
        "timestamp": datetime.now().isoformat()
    }
    
    vote_id = hashlib.sha256(f"{proposal_id}{option}{voter_wallet}".encode()).hexdigest()[:16]
    VOTES[vote_id] = vote_record
    
    return {
        "vote_id": vote_id,
        "proposal_id": proposal_id,
        "option": option,
        "success": True,
        "current_results": proposal["votes"]
    }

def get_proposal(proposal_id: str) -> Dict[str, Any]:
    """Get proposal details by ID"""
    if proposal_id not in PROPOSALS:
        raise ValueError(f"Proposal {proposal_id} not found")
    return PROPOSALS[proposal_id]

def list_proposals(category: str = None, status: str = "active") -> List[Dict[str, Any]]:
    """
    List all proposals, optionally filtered by category and status
    
    Args:
        category: Filter by category (optional)
        status: Filter by status (active, closed, executed)
    
    Returns:
        List of proposals
    """
    proposals = list(PROPOSALS.values())
    
    if category:
        proposals = [p for p in proposals if p["category"] == category]
    
    if status:
        proposals = [p for p in proposals if p["status"] == status]
    
    return proposals

def get_proposal_results(proposal_id: str) -> Dict[str, Any]:
    """Get current voting results for a proposal"""
    if proposal_id not in PROPOSALS:
        raise ValueError(f"Proposal {proposal_id} not found")
    
    proposal = PROPOSALS[proposal_id]
    total_votes = sum(proposal["votes"].values())
    
    # Calculate percentages
    results = {}
    for option, count in proposal["votes"].items():
        percentage = (count / total_votes * 100) if total_votes > 0 else 0
        results[option] = {
            "count": count,
            "percentage": round(percentage, 2)
        }
    
    # Determine winner
    winner = max(proposal["votes"].items(), key=lambda x: x[1])[0] if total_votes > 0 else None
    
    return {
        "proposal_id": proposal_id,
        "title": proposal["title"],
        "total_votes": total_votes,
        "results": results,
        "winner": winner,
        "status": proposal["status"]
    }

def close_proposal(proposal_id: str) -> Dict[str, Any]:
    """Close a proposal and finalize results"""
    if proposal_id not in PROPOSALS:
        raise ValueError(f"Proposal {proposal_id} not found")
    
    proposal = PROPOSALS[proposal_id]
    proposal["status"] = "closed"
    proposal["closed_at"] = datetime.now().isoformat()
    
    results = get_proposal_results(proposal_id)
    return results

def get_voting_power(wallet_address: str) -> Dict[str, Any]:
    """
    Get voting power for a wallet (could be based on token holdings in production)
    
    Args:
        wallet_address: Wallet address
    
    Returns:
        Voting power details
    """
    # Placeholder: In production, this would check token balance
    return {
        "wallet": wallet_address,
        "voting_power": 1,
        "delegated_to": None,
        "proposals_voted": len([v for v in VOTES.values() if v["voter"] == wallet_address])
    }
