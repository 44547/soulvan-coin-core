package com.soulvan.core.cli

import com.soulvan.core.model.CoinMetadataDTO
import com.soulvan.core.model.DaoVoteDTO
import com.soulvan.core.model.VoteValue
import com.soulvan.core.model.WalletIdentityDTO
import java.nio.file.Files
import java.nio.file.Path
import java.security.KeyPairGenerator
import java.security.MessageDigest
import java.util.Base64
import java.util.UUID

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        printUsage()
        return
    }

    when (args[0]) {
        "init" -> handleInit(args.drop(1))
        "remix" -> handleRemix(args.drop(1))
        "vote" -> handleVote(args.drop(1))
        else -> printUsage()
    }
}

private fun printUsage() {
    println("soulvan-cli commands:")
    println("  init  --photo <path> --name <ContributorName>")
    println("  remix --input <file> --style <style> --battle <battleId?>")
    println("  vote  --proposal <proposalId> --value <YES|NO|ABSTAIN>")
}

private fun handleInit(args: List<String>) {
    val photoPath = getOption(args, "--photo") ?: return println("--photo is required")
    val name = getOption(args, "--name") ?: return println("--name is required")

    val keyPairGen = KeyPairGenerator.getInstance("RSA")
    keyPairGen.initialize(2048)
    val keyPair = keyPairGen.generateKeyPair()

    val publicKeyEncoded = Base64.getEncoder().encodeToString(keyPair.public.encoded)
    val walletId = UUID.randomUUID()

    val photoHash = hashFile(Path.of(photoPath))

    val walletIdentity = WalletIdentityDTO(
        walletId = walletId,
        contributorPhotoHash = photoHash,
        publicKey = publicKeyEncoded
    )

    val provenanceSignature = hashString("$walletId:$photoHash:$publicKeyEncoded:$name")

    val coinMetadata = CoinMetadataDTO(
        contributorId = walletId,
        cinematicAssetHash = photoHash,
        remixDNA = "GENESIS",
        originalityScore = 100,
        provenanceSignature = provenanceSignature
    )

    println("WalletIdentityDTO:")
    println(walletIdentity)
    println("\nCoinMetadataDTO:")
    println(coinMetadata)
}

private fun handleRemix(args: List<String>) {
    val input = getOption(args, "--input") ?: return println("--input is required")
    val style = getOption(args, "--style") ?: "default"
    val battleId = getOption(args, "--battle")

    val assetHash = hashFile(Path.of(input))

    val remixDNA = "STYLE:$style:ASSET:$assetHash"
    val originalityScore = (assetHash.hashCode().absoluteValue % 101)

    val contributorId = UUID.randomUUID()
    val provenanceSignature = hashString("$contributorId:$assetHash:$remixDNA:$originalityScore")

    val coinMetadata = CoinMetadataDTO(
        contributorId = contributorId,
        cinematicAssetHash = assetHash,
        remixDNA = remixDNA,
        originalityScore = originalityScore,
        battleId = battleId,
        provenanceSignature = provenanceSignature
    )

    println("Remix CoinMetadataDTO:")
    println(coinMetadata)
}

private fun handleVote(args: List<String>) {
    val proposalId = getOption(args, "--proposal") ?: return println("--proposal is required")
    val valueRaw = getOption(args, "--value") ?: return println("--value is required")

    val voteValue = try {
        VoteValue.valueOf(valueRaw.uppercase())
    } catch (e: IllegalArgumentException) {
        println("Invalid vote value. Use YES, NO, or ABSTAIN.")
        return
    }

    val voterId = UUID.randomUUID()
    val provenanceSignature = hashString("$voterId:$proposalId:$voteValue")

    val vote = DaoVoteDTO(
        voterId = voterId,
        proposalId = proposalId,
        voteValue = voteValue,
        provenanceSignature = provenanceSignature
    )

    println("DaoVoteDTO:")
    println(vote)
}

private fun getOption(args: List<String>, name: String): String? {
    val index = args.indexOf(name)
    if (index == -1 || index + 1 >= args.size) return null
    return args[index + 1]
}

private fun hashFile(path: Path): String {
    val bytes = Files.readAllBytes(path)
    return hashBytes(bytes)
}

private fun hashString(input: String): String = hashBytes(input.toByteArray())

private fun hashBytes(bytes: ByteArray): String {
    val digest = MessageDigest.getInstance("SHA-256")
    val hash = digest.digest(bytes)
    return hash.joinToString(separator = "") { "%02x".format(it) }
}

private val Int.absoluteValue: Int
    get() = if (this < 0) -this else this
