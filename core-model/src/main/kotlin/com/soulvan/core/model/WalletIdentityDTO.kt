package com.soulvan.core.model

import java.time.Instant
import java.util.UUID

data class WalletIdentityDTO(
    val walletId: UUID,
    val contributorPhotoHash: String,
    val publicKey: String,
    val createdAt: Instant = Instant.now()
) {
    init {
        require(contributorPhotoHash.isNotBlank()) { "contributorPhotoHash must not be blank" }
        require(publicKey.isNotBlank()) { "publicKey must not be blank" }
    }
}
