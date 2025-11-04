# Changelog

## [2.0.0] - 2025-11-04

### Added
- Multi-platform builds for Windows, Linux, and macOS
- GitHub Actions workflow for automated building and releasing
- Unity CI integration via game-ci
- Artifact caching for faster builds
- Centralized release packaging with all platforms in single GitHub Release
- Direct download links for all supported platforms
- Release notes template

### Changed
- Standardized artifact names to SoulvanCore_<platform>.zip format
- Updated README with multi-platform download guidance

### Technical
- Unity project path: `unity/`
- Workflow triggers: tag push (v*.*.*) or manual dispatch
- Required secret: UNITY_LICENSE
