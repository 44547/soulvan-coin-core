# Soulvan Core

Soulvan Core is a cinematic, contributor‑centric cultural operating system built around Soulvan Coin, Remix DNA provenance, and prestige‑weighted governance on TON.

This repository contains a minimal NestJS API scaffold plus Kotlin/JVM models, providing:

- Wallet‑verified contributor onboarding
- Remix submission with originality scoring and DNA ledger hooks
- DAO voting with prestige‑weighted Soulvan Coin utility
- Missions and Replay Vault integration for ceremonies and lineage

## Quickstart

```bash
npm install
npm run start:dev
# API on http://localhost:3000
```

## API Overview

- POST/GET `/contributors` — create/list contributors (TON signature guard on POST)
- POST/GET `/remixes` — submit/list remixes (TON signature guard on POST)
- POST `/dao/votes` — cast votes (TON signature guard)
- POST `/missions` — create missions (TON signature guard)
- POST `/missions/:id/entries` — submit mission entries (TON signature guard)

### Contributor Onboarding
- Identity methods: `PHOTO | WALLET | SOCIAL`
- Prestige scoring via `PrestigeService`
- Emits `contributor.created` for Codex Viewer overlays

### Remix Submission & DNA
- DTOs enforce hashes, tags, types (`VISUAL | AUDIO | VIDEO | CODE`)
- Originality score via AI engine (stubbed)
- `AssetKind.REMIX` recorded to DNA ledger and events emitted (`remix.created`)

### DAO Voting
- `VoteChoice: FOR | AGAINST | ABSTAIN`
- Weight = TON balance + prestige * 10 (admin‑only overrides)
- Emits `vote.cast` for Codex Viewer ceremonies

### Missions & Replay Vault (Phase 4)
- Create missions with regional themes (Nyeri, Cairo, Lagos, …)
- Submit entries → originality → prestige impact → replay emit
- Replay service hooks into analytics + Codex Viewer lineage

## Modules

- `src/contributor` — controller, module, service, DTOs
- `src/remix` — controller, module, service, DTOs
- `src/dao` — controller (votes), module, DTOs
- `src/mission` — controller, module, services (MissionService, ReplayService, PrestigeScoring)
- `src/prestige` — `PrestigeService`
- `src/auth` — `TonSignatureGuard`
- `src/common/dto` — shared enums/types
- `src/app.module.ts`, `src/main.ts` — bootstrap

## Frontend SDK (Codex Viewer)

A typed client wraps REST + GraphQL to feed the Codex Viewer UI:

- REST: `/codex/metrics`, `/contributors`, `/remixes`, `/dao/proposals`, `/dao/votes`
- GraphQL snapshot: metrics, contributors page, remix lineage graph, active/closed proposals with prestige‑weighted tallies

## Security

- TON wallet signature via `x-wallet-signature` header guarded in controllers
- Future: verify signatures using TON cryptography libs

## Roadmap (Phases 4–7)

- Phase 4: Missions + Replay Vault (implemented scaffolds)
- Phase 5: Remix DNA ledger anchoring + Soulvan Coin utility (staking, unlockables)
- Phase 6: DAO templates + Guild challenges (prestige rewards, ripple maps)
- Phase 7: Global cultural packs and contributor ceremonies (region assets, fireworks)

## Development

```bash
# build
npm run build
# start (compiled)
npm run start
```

## License

Proprietary; do not redistribute without permission.
