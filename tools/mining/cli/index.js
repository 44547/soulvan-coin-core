#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');

const GATEWAY_URL = process.env.SOULVAN_GATEWAY_URL || 'http://127.0.0.1:8080';
const API_KEY = process.env.SOULVAN_API_KEY || '';

// RPC helper
async function rpcCall(method, params = {}) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }
  
  try {
    const response = await axios.post(`${GATEWAY_URL}/rpc`, {
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    }, { headers });
    
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    
    return response.data.result;
  } catch (error) {
    if (error.response) {
      throw new Error(`RPC Error: ${error.response.data.error?.message || error.response.statusText}`);
    }
    throw error;
  }
}

program
  .name('soulvan-cli')
  .description('Complete CLI for Soulvan blockchain')
  .version('2.0.0');

// Init command
program
  .command('init')
  .description('Initialize Soulvan environment')
  .action(async () => {
    const spinner = ora('Initializing Soulvan environment...').start();
    
    try {
      // Check gateway connectivity
      const result = await axios.get(`${GATEWAY_URL}/health`);
      spinner.succeed(chalk.green(`Connected to Soulvan Gateway (v${result.data.version})`));
      
      console.log(chalk.cyan('\n✓ Soulvan CLI initialized successfully'));
      console.log(chalk.gray(`Gateway: ${GATEWAY_URL}`));
      console.log(chalk.gray(`API Key: ${API_KEY ? '✓ Set' : '✗ Not set'}`));
      
    } catch (error) {
      spinner.fail(chalk.red(`Failed to connect to gateway: ${error.message}`));
      process.exit(1);
    }
  });

// Wallet commands
const wallet = program.command('wallet').description('Wallet management');

wallet
  .command('create')
  .description('Create a new wallet with optional photo avatar')
  .option('-u, --username <username>', 'Username')
  .option('-p, --photo <path>', 'Path to photo for avatar generation')
  .option('-s, --style <style>', 'Avatar style (cinematic, neon, cyberpunk, anime, realistic, artistic)', 'cinematic')
  .action(async (options) => {
    const spinner = ora('Creating wallet...').start();
    
    try {
      let params = {
        username: options.username
      };
      
      if (options.photo) {
        // Read and encode photo
        const photoPath = path.resolve(options.photo);
        if (!fs.existsSync(photoPath)) {
          throw new Error(`Photo not found: ${photoPath}`);
        }
        
        const imageData = fs.readFileSync(photoPath);
        const image_base64 = imageData.toString('base64');
        
        params = {
          image_base64,
          style: options.style,
          username: options.username
        };
        
        spinner.text = 'Creating wallet with photo avatar...';
        const result = await rpcCall('soulvan.onboard', params);
        
        spinner.succeed(chalk.green('Wallet created with photo avatar!'));
        console.log(chalk.cyan('\nWallet Details:'));
        console.log(chalk.white(`Address: ${result.wallet.address}`));
        console.log(chalk.white(`Username: ${result.wallet.username || 'N/A'}`));
        console.log(chalk.white(`Avatar: ${result.identity?.avatar_url || 'N/A'}`));
        console.log(chalk.white(`Avatar Style: ${result.identity?.style || 'N/A'}`));
        
      } else {
        const result = await rpcCall('soulvan.wallet.create', params);
        
        spinner.succeed(chalk.green('Wallet created!'));
        console.log(chalk.cyan('\nWallet Details:'));
        console.log(chalk.white(`Address: ${result.address}`));
        console.log(chalk.white(`Username: ${result.username || 'N/A'}`));
      }
      
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

wallet
  .command('info <address>')
  .description('Get wallet information')
  .action(async (address) => {
    const spinner = ora('Fetching wallet info...').start();
    
    try {
      const result = await rpcCall('soulvan.wallet.info', { wallet_address: address });
      
      spinner.succeed(chalk.green('Wallet info retrieved!'));
      console.log(chalk.cyan('\nWallet Details:'));
      console.log(chalk.white(`Address: ${result.address}`));
      console.log(chalk.white(`Username: ${result.username || 'N/A'}`));
      console.log(chalk.white(`Avatar: ${result.avatar_url || 'N/A'}`));
      console.log(chalk.white(`Verified: ${result.verified ? '✓' : '✗'}`));
      console.log(chalk.cyan('\nBalances:'));
      for (const [currency, amount] of Object.entries(result.balance)) {
        console.log(chalk.white(`  ${currency}: ${amount}`));
      }
      
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Music commands
const music = program.command('music').description('SoulvanMusic AI');

music
  .command('generate')
  .description('Generate music track')
  .option('-g, --genre <genre>', 'Music genre', 'trap')
  .option('-m, --mood <mood>', 'Mood/vibe', 'epic')
  .option('-t, --tempo <bpm>', 'Tempo in BPM', '120')
  .option('-l, --lyrics <text>', 'Lyrics for vocals')
  .option('-v, --vocal-style <style>', 'Vocal style', 'female pop')
  .option('--truck <style>', 'Truck visualization style', 'neon')
  .action(async (options) => {
    const spinner = ora('Generating music...').start();
    
    try {
      const params = {
        genre: options.genre,
        mood: options.mood,
        tempo: parseInt(options.tempo),
        lyrics: options.lyrics,
        vocal_style: options.vocalStyle,
        language: 'en'
      };
      
      const result = await rpcCall('soulvan.music.generate', params);
      
      spinner.succeed(chalk.green('Music generated!'));
      console.log(chalk.cyan('\nTrack Details:'));
      console.log(chalk.white(`Genre: ${result.genre}`));
      console.log(chalk.white(`Mood: ${result.mood}`));
      console.log(chalk.white(`Tempo: ${result.tempo} BPM`));
      console.log(chalk.white(`Beat URL: ${result.beat_url}`));
      if (result.vocals_url) {
        console.log(chalk.white(`Vocals URL: ${result.vocals_url}`));
      }
      console.log(chalk.gray(`\nTruck Style: ${options.truck}`));
      
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

music
  .command('preferences')
  .description('Get supported music options')
  .action(async () => {
    try {
      const result = await rpcCall('soulvan.music.preferences');
      
      console.log(chalk.cyan('\nSupported Options:'));
      console.log(chalk.white(`Genres: ${result.genres.join(', ')}`));
      console.log(chalk.white(`Moods: ${result.moods.join(', ')}`));
      console.log(chalk.white(`Languages: ${result.languages.join(', ')}`));
      console.log(chalk.white(`Vocal Styles: ${result.vocal_styles.join(', ')}`));
      console.log(chalk.white(`Tempo Range: ${result.tempo_range[0]}-${result.tempo_range[1]} BPM`));
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// DAO commands
const dao = program.command('dao').description('DAO voting and governance');

dao
  .command('propose')
  .description('Create a DAO proposal')
  .requiredOption('-c, --category <category>', 'Category (avatar_styles, music_genres, truck_styles, feature_proposals)')
  .requiredOption('-t, --title <title>', 'Proposal title')
  .requiredOption('-d, --description <desc>', 'Proposal description')
  .requiredOption('-o, --options <options>', 'Comma-separated voting options')
  .option('-w, --wallet <address>', 'Creator wallet address', 'anonymous')
  .action(async (options) => {
    const spinner = ora('Creating proposal...').start();
    
    try {
      const params = {
        category: options.category,
        title: options.title,
        description: options.description,
        options: options.options.split(',').map(o => o.trim()),
        creator_wallet: options.wallet
      };
      
      const result = await rpcCall('soulvan.dao.proposal.create', params);
      
      spinner.succeed(chalk.green('Proposal created!'));
      console.log(chalk.cyan('\nProposal Details:'));
      console.log(chalk.white(`ID: ${result.id}`));
      console.log(chalk.white(`Title: ${result.title}`));
      console.log(chalk.white(`Category: ${result.category}`));
      console.log(chalk.white(`Options: ${result.options.join(', ')}`));
      console.log(chalk.gray(`\nCreated: ${result.created_at}`));
      
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

dao
  .command('vote <proposal_id> <option>')
  .description('Vote on a proposal')
  .option('-w, --wallet <address>', 'Voter wallet address', 'anonymous')
  .action(async (proposal_id, option, options) => {
    const spinner = ora('Casting vote...').start();
    
    try {
      const result = await rpcCall('soulvan.dao.vote', {
        proposal_id,
        option,
        voter_wallet: options.wallet
      });
      
      spinner.succeed(chalk.green('Vote cast successfully!'));
      console.log(chalk.cyan('\nVote Details:'));
      console.log(chalk.white(`Vote ID: ${result.vote_id}`));
      console.log(chalk.white(`Proposal: ${result.proposal_id}`));
      console.log(chalk.white(`Option: ${result.option}`));
      console.log(chalk.cyan('\nCurrent Results:'));
      for (const [opt, count] of Object.entries(result.current_results)) {
        console.log(chalk.white(`  ${opt}: ${count} votes`));
      }
      
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

dao
  .command('proposals')
  .description('List active proposals')
  .option('-c, --category <category>', 'Filter by category')
  .option('-s, --status <status>', 'Filter by status', 'active')
  .action(async (options) => {
    try {
      const result = await rpcCall('soulvan.dao.proposals.list', {
        category: options.category,
        status: options.status
      });
      
      if (result.length === 0) {
        console.log(chalk.yellow('No proposals found'));
        return;
      }
      
      console.log(chalk.cyan(`\nFound ${result.length} proposal(s):\n`));
      result.forEach(p => {
        console.log(chalk.white(`ID: ${p.id}`));
        console.log(chalk.white(`Title: ${p.title}`));
        console.log(chalk.white(`Category: ${p.category}`));
        console.log(chalk.white(`Status: ${p.status}`));
        console.log(chalk.gray(`Created: ${p.created_at}`));
        console.log('');
      });
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

dao
  .command('results <proposal_id>')
  .description('Get proposal results')
  .action(async (proposal_id) => {
    try {
      const result = await rpcCall('soulvan.dao.results', { proposal_id });
      
      console.log(chalk.cyan('\nProposal Results:'));
      console.log(chalk.white(`Title: ${result.title}`));
      console.log(chalk.white(`Total Votes: ${result.total_votes}`));
      console.log(chalk.white(`Winner: ${result.winner || 'N/A'}`));
      console.log(chalk.cyan('\nDetailed Results:'));
      for (const [option, data] of Object.entries(result.results)) {
        console.log(chalk.white(`  ${option}: ${data.count} votes (${data.percentage}%)`));
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// RPC command
program
  .command('rpc <method> [params...]')
  .description('Call any RPC method directly')
  .action(async (method, params) => {
    try {
      let parsedParams = {};
      if (params && params.length > 0) {
        parsedParams = JSON.parse(params.join(' '));
      }
      
      const result = await rpcCall(method, parsedParams);
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
