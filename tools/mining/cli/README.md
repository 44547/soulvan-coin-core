# Soulvan CLI

Complete command-line interface for Soulvan blockchain - wallet management, music generation, photo avatars, and DAO voting.

## Installation

```bash
cd tools/mining/cli
npm install
npm link  # Makes 'soulvan-cli' and 'soulvan' available globally
```

## Quick Start

```bash
# Initialize
soulvan-cli init

# Create wallet with photo avatar
soulvan-cli wallet create --username johndoe --photo selfie.jpg --style cinematic

# Generate music
soulvan-cli music generate --genre trap --mood epic --tempo 140 --truck neon

# Create DAO proposal
soulvan-cli dao propose -c avatar_styles -t "Add vintage style" -d "Proposal to add vintage avatar style" -o "yes,no"

# Vote on proposal
soulvan-cli dao vote <proposal_id> yes --wallet <your_wallet>
```

## Commands

### Init
```bash
soulvan-cli init
```
Initialize and check gateway connectivity.

### Wallet Commands

**Create wallet:**
```bash
soulvan-cli wallet create [options]

Options:
  -u, --username <username>   Set username
  -p, --photo <path>          Path to photo for avatar generation
  -s, --style <style>         Avatar style (cinematic, neon, cyberpunk, anime, realistic, artistic)
```

**Get wallet info:**
```bash
soulvan-cli wallet info <address>
```

### Music Commands

**Generate music:**
```bash
soulvan-cli music generate [options]

Options:
  -g, --genre <genre>         Music genre (trap, afrobeats, techno, orchestral, jazz, reggaeton, k-pop, drill)
  -m, --mood <mood>           Mood/vibe (epic, dark, uplifting, romantic, mystical, chaotic)
  -t, --tempo <bpm>           Tempo in BPM (60-200)
  -l, --lyrics <text>         Lyrics for vocals
  -v, --vocal-style <style>   Vocal style (female pop, male rap, robotic, whisper, opera)
  --truck <style>             Truck visualization style
```

**Get music preferences:**
```bash
soulvan-cli music preferences
```

### DAO Commands

**Create proposal:**
```bash
soulvan-cli dao propose [options]

Required:
  -c, --category <category>    Category (avatar_styles, music_genres, truck_styles, feature_proposals)
  -t, --title <title>          Proposal title
  -d, --description <desc>     Proposal description
  -o, --options <options>      Comma-separated voting options

Optional:
  -w, --wallet <address>       Creator wallet address
```

**Vote on proposal:**
```bash
soulvan-cli dao vote <proposal_id> <option> [options]

Options:
  -w, --wallet <address>       Voter wallet address
```

**List proposals:**
```bash
soulvan-cli dao proposals [options]

Options:
  -c, --category <category>    Filter by category
  -s, --status <status>        Filter by status (active, closed)
```

**Get results:**
```bash
soulvan-cli dao results <proposal_id>
```

### RPC Command

**Direct RPC calls:**
```bash
soulvan-cli rpc <method> [params]

Examples:
  soulvan-cli rpc soulvan.version
  soulvan-cli rpc soulvan.wallet.info '{"wallet_address":"0x..."}'
```

## Environment Variables

- `SOULVAN_GATEWAY_URL` - Gateway URL (default: http://127.0.0.1:8080)
- `SOULVAN_API_KEY` - API key for authentication

## Complete Examples

### 1. Complete Onboarding Flow
```bash
# Create wallet with photo avatar and username
soulvan-cli wallet create \
  --username "alice" \
  --photo ~/photos/selfie.jpg \
  --style cinematic

# Output: Wallet address, avatar URL, identity details
```

### 2. Generate Custom Music Track
```bash
# Generate trap beat with vocals
soulvan-cli music generate \
  --genre trap \
  --mood epic \
  --tempo 140 \
  --lyrics "Ride the blockchain, feel the chain" \
  --vocal-style "female pop" \
  --truck neon

# Output: Beat URL, vocals URL, track details
```

### 3. DAO Voting Workflow
```bash
# 1. Create proposal
soulvan-cli dao propose \
  -c avatar_styles \
  -t "Add retro pixel art style" \
  -d "Community proposal to add 8-bit pixel art avatar style" \
  -o "yes,no,abstain" \
  -w 0xYourWallet

# 2. List proposals
soulvan-cli dao proposals --category avatar_styles

# 3. Vote
soulvan-cli dao vote abc123def456 yes --wallet 0xYourWallet

# 4. Check results
soulvan-cli dao results abc123def456
```

### 4. Combined SoulMateX Experience
```bash
# Complete onboarding with music
soulvan-cli wallet create --username "soul44" --photo pic.jpg --style neon
soulvan-cli music generate --genre afrobeats --mood uplifting --truck chrome
```

## Development

To test locally without npm link:
```bash
node index.js <command>
```

## RPC Methods Reference

### Wallet
- `soulvan.wallet.create` - Create wallet
- `soulvan.wallet.info` - Get wallet info

### Music
- `soulvan.music.preferences` - Get options
- `soulvan.music.generate` - Generate track
- `soulvan.music.beat` - Generate beat only
- `soulvan.music.vocals` - Generate vocals only

### Photo AI
- `soulvan.photo.styles` - Get avatar styles
- `soulvan.photo.generate` - Generate avatar

### DAO
- `soulvan.dao.proposal.create` - Create proposal
- `soulvan.dao.vote` - Cast vote
- `soulvan.dao.proposal.get` - Get proposal
- `soulvan.dao.proposals.list` - List proposals
- `soulvan.dao.results` - Get results
- `soulvan.dao.power` - Get voting power

### Combined
- `soulvan.onboard` - Complete onboarding (wallet + photo)

## License

MIT
