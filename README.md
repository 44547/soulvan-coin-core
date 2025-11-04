# Soulvan Core 2.0

Epic ARPG with kingdom-building and blockchain-linked progression.

## Download

Go to the [Releases](../../releases) page and download:
- `SoulvanCore_Windows_x86_64.zip` for the desired version (e.g., `v2.0.0`)

Direct link (replace version if needed):
- https://github.com/44547/soulvan-coin-core/releases/download/v2.0.0/SoulvanCore_Windows_x86_64.zip

## Build and Release (CI)

- Workflow: `.github/workflows/build-and-release.yml`
- Triggers:
  - Push a tag like `v2.0.0`
  - Manual dispatch with a `version` input

### One-time setup

1. Add Unity license to repo secrets as `UNITY_LICENSE` (see game-ci activation docs)
2. Ensure the Unity project is in `unity/`
3. Confirm `unity/ProjectSettings/ProjectVersion.txt` is correct

### Outputs

- CI artifact: `SoulvanCore_Windows_x86_64-<version>` (14-day retention)
- Release asset: `SoulvanCore_Windows_x86_64.zip`

## Modules

- Contracts (core): `contracts/` (SVC, Reserve, EnchantedGear, Seasonal & themed DAOs)
- Backend bridge (Node/TS): `backend/`
- Unity HDRP project: `unity/`

See `CHANGELOG.md` for what's new in 2.0.0.
