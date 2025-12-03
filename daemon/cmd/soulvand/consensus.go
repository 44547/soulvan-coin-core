package main

import (
	"fmt"
	"sync"
)

// ConsensusEngine supports PoS, PoA, and hybrid consensus
func StartPoSConsensus() error {
	fmt.Println("Starting Proof-of-Stake consensus engine...")
	// TODO: Implement PoS logic
	return nil
}

func StartPoAConsensus() error {
	fmt.Println("Starting Proof-of-Authority consensus engine...")
	// TODO: Implement PoA logic
	return nil
}

func StartHybridConsensus() error {
	fmt.Println("Starting hybrid PoS/PoA consensus engine...")
	// TODO: Implement hybrid logic
	return nil
}

type Block struct {
	ID        string
	Height    int
	Timestamp int64
	Proposer  string
	Txs       []Transaction
	PrevHash  string
	Hash      string
}

type Transaction struct {
	ID        string
	From      string
	To        string
	Amount    float64
	Signature []byte
	Timestamp int64
}

type Validator struct {
	ID     string
	PubKey []byte
	Stake  float64
	Active bool
}

var (
	blockchain      = make(map[int]Block)
	blockchainMutex sync.RWMutex

	validators      = make(map[string]Validator)
	validatorsMutex sync.RWMutex
)

// SelectValidators returns a list of active validators for block proposal
func SelectValidators() []Validator {
	validatorsMutex.RLock()
	defer validatorsMutex.RUnlock()
	var selected []Validator
	for _, v := range validators {
		if v.Active {
			selected = append(selected, v)
		}
	}
	return selected
}

// ProposeBlock creates a new block from mempool transactions
func ProposeBlock(proposer string, height int, prevHash string) Block {
	blockchainMutex.Lock()
	defer blockchainMutex.Unlock()
	var txs []Transaction
	mempoolMutex.Lock()
	for _, tx := range mempool {
		txs = append(txs, tx)
	}
	mempool = make(map[string]Transaction) // clear mempool
	mempoolMutex.Unlock()
	block := Block{
		ID:        fmt.Sprintf("block-%d", height),
		Height:    height,
		Timestamp: 0, // set timestamp
		Proposer:  proposer,
		Txs:       txs,
		PrevHash:  prevHash,
		Hash:      "", // set hash
	}
	blockchain[height] = block
	return block
}

// VoteBlock simulates validator voting for a block
func VoteBlock(block Block) bool {
	votes := 0
	validatorsMutex.RLock()
	for _, v := range validators {
		if v.Active {
			votes++
		}
	}
	validatorsMutex.RUnlock()
	return votes > len(validators)/2 // simple majority
}

// FinalizeBlock marks a block as finalized
func FinalizeBlock(height int) {
	blockchainMutex.Lock()
	defer blockchainMutex.Unlock()
	if block, ok := blockchain[height]; ok {
		block.Hash = fmt.Sprintf("finalized-%d", height)
		blockchain[height] = block
	}
}
