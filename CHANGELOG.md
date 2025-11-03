# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-11-01
### Added
- Project versioning via `VERSION` file.
- Starter `CHANGELOG.md` and `UPGRADE_GUIDE.md`.
- README announcement for v2.0.0.
- **Mining Gateway API** (`tools/mining/soulvan_mining_api.py`)
  - RESTful blockchain endpoints (`/blockchain/info`, `/blockchain/besthash`, `/block/byheight/<n>`)
  - Mining endpoints (`/mining/info`, `/mining/template`, `/mining/submit`)
  - Real-time stats streaming via Server-Sent Events
  - TON address configuration management with validation
  - API key authentication for sensitive operations
  - Security controls for mutating blockchain operations
  - Download endpoint (`/download/app`) for distribution packages
  - **SoulvanMusic AI integration** - Music generation via RPC methods
    - `soulvan.music.preferences` - Get supported music options
    - `soulvan.music.generate` - Generate complete music tracks
    - `soulvan.music.beat` - Generate beats (trap, afrobeats, techno, etc.)
    - `soulvan.music.vocals` - Synthesize vocals in multiple languages
    - Support for 8 genres, 6 moods, 5 languages, 5 vocal styles
  - **Wallet & Identity integration** - Onboarding and photo AI
    - `soulvan.wallet.create` - Create new wallets
    - `soulvan.wallet.info` - Query wallet information
    - `soulvan.photo.styles` - Get supported avatar styles
    - `soulvan.photo.generate` - Generate AI-powered avatars from photos
    - `soulvan.onboard` - Complete onboarding (wallet + avatar in one call)
    - Support for 6 avatar styles: cinematic, neon, cyberpunk, anime, realistic, artistic
  - **DAO Voting System** - Decentralized governance
    - `soulvan.dao.proposal.create` - Create DAO proposals
    - `soulvan.dao.vote` - Cast votes on proposals
    - `soulvan.dao.proposals.list` - List proposals
    - `soulvan.dao.results` - Get voting results
    - `soulvan.dao.power` - Check voting power
    - Support for avatar styles, music genres, truck styles, and feature proposals
- **Enhanced CLI** (`tools/mining/cli/`)
  - Complete NPM-based CLI with commander.js
  - Wallet commands: create with photo, get info
  - Music commands: generate tracks, get preferences
  - DAO commands: propose, vote, list, results
  - Direct RPC access for any method
  - Colored output with chalk and ora spinners
  - Global installation support (`soulvan-cli` or `soulvan`)
- **Legacy CLI Tools** (`tools/mining/soulvan-miner-cli.js`)
  - Node.js command-line interface for miners
  - Commands for blockchain info, block queries, mining info, and templates
- **Test Infrastructure**
  - Pytest-based test suite (`test_api.py`)
  - Unit tests for API endpoints and helpers
  - Development requirements (`requirements-dev.txt`)
- **Docker Support**
  - Dockerfile for containerized gateway
  - docker-compose.yml for easy deployment
- **Documentation**
  - Comprehensive `tools/mining/README.md` with examples
  - Enhanced `tools/mining/cli/README.md` with CLI documentation
  - API endpoint documentation
  - Security guidelines
- **Utility Scripts** (`scripts/`)
  - `setup.sh` - Complete project setup with Gradle build
  - `quickstart.sh` - Quick Python/Node.js environment setup
  - `soulvan-cli.sh` - CLI wrapper for RPC calls
  - `test-api.sh` - Comprehensive API testing
  - `bootstrap_gradle_wrapper.sh` - Gradle wrapper bootstrapping

### Changed
- Project metadata prepared for 2.0.0 release.
- Gateway now includes complete DAO voting infrastructure
- All features integrated into blockchain core via RPC methods

### Removed
- N/A

## [Unreleased]
- Placeholder for upcoming items.
