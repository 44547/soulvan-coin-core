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
- **CLI Tools** (`tools/mining/soulvan-miner-cli.js`)
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

### Removed
- N/A

## [Unreleased]
- Placeholder for upcoming items.
