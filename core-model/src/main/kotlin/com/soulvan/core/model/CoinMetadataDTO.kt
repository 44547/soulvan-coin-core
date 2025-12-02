package com.soulvan.core.model

import java.util.UUID

data class CoinMetadataDTO(
    val contributorId: UUID,
    val cinematicAssetHash: String,
    val remixDNA: String,
    val originalityScore: Int,
    val campaignId: String? = null,
    val battleId: String? = null,
    val provenanceSignature: String
) {
    init {
        require(originalityScore in 0..100) { "originalityScore must be between 0 and 100" }
        require(cinematicAssetHash.isNotBlank()) { "cinematicAssetHash must not be blank" }
        require(remixDNA.isNotBlank()) { "remixDNA must not be blank" }
        require(provenanceSignature.isNotBlank()) { "provenanceSignature must not be blank" }
    }
}
