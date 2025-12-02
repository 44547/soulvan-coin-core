package com.soulvan.core.model

import java.time.Instant
import java.util.UUID

enum class VoteValue {
    YES, NO, ABSTAIN
}

data class DaoVoteDTO(
    val voterId: UUID,
    val proposalId: String,
    val voteValue: VoteValue,
    val provenanceSignature: String,
    val timestamp: Instant = Instant.now()
) {
    init {
        require(proposalId.isNotBlank()) { "proposalId must not be blank" }
        require(provenanceSignature.isNotBlank()) { "provenanceSignature must not be blank" }
    }
}
