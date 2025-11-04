# Soulvan Core 2.0

Highlights
- Multi-platform builds (Windows, Linux, macOS) with downloadable zips per platform
- Unity CI via game-ci, artifact caching, and centralized release packaging
- README updated with direct download links and platform guidance

Breaking changes
- Artifact names standardized to SoulvanCore_<platform>.zip

Setup
- Ensure UNITY_LICENSE is configured as a repository secret
- Unity project path: `unity/`

Known issues
- macOS builds may require quarantine removal on first run: `xattr -dr com.apple.quarantine <app>`
