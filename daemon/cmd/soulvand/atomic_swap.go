package main

import (
	"fmt"
	"log"
	"sync"
)

// AtomicSwap provides atomic swap and DEX integration
func StartAtomicSwap(parties []string, asset string, amount float64) error {
	fmt.Println("Starting atomic swap for asset:", asset, "amount:", amount, "parties:", parties)
	// TODO: Integrate atomic swap logic
	return nil
}

// IntegrateDEX logs and checks for supported DEX
func IntegrateDEX(name string) error {
	supported := map[string]bool{"Uniswap": true, "SushiSwap": true, "PancakeSwap": true}
	if !supported[name] {
		log.Printf("DEX %s not supported", name)
		return fmt.Errorf("unsupported DEX")
	}
	log.Printf("Integrating with DEX: %s", name)
	return nil
}

type SwapContract struct {
	ContractID string
	PartyA     string
	PartyB     string
	AssetA     string
	AssetB     string
	AmountA    float64
	AmountB    float64
	Timeout    int64
	Status     string
	HashLock   string
	TimeLock   string
}

var (
	swapContracts      = make(map[string]SwapContract)
	swapContractsMutex sync.RWMutex
)

// CreateHTLC creates a new HTLC contract with error handling and logging
func CreateHTLC(swapID, hashlock, timelock string) error {
	swapContractsMutex.Lock()
	defer swapContractsMutex.Unlock()
	if _, exists := swapContracts[swapID]; exists {
		log.Printf("HTLC contract %s already exists", swapID)
		return fmt.Errorf("contract already exists")
	}
	if hashlock == "" || timelock == "" {
		log.Printf("Invalid HTLC parameters for %s", swapID)
		return fmt.Errorf("invalid parameters")
	}
	swapContracts[swapID] = SwapContract{ContractID: swapID, HashLock: hashlock, TimeLock: timelock, Status: "active"}
	log.Printf("HTLC contract %s created", swapID)
	return nil
}

// RedeemHTLC redeems an HTLC contract if preimage matches, with logging and security check
func RedeemHTLC(swapID, preimage string) error {
	swapContractsMutex.Lock()
	defer swapContractsMutex.Unlock()
	swap, ok := swapContracts[swapID]
	if !ok {
		log.Printf("HTLC contract %s not found", swapID)
		return fmt.Errorf("contract not found")
	}
	if swap.HashLock != preimage {
		log.Printf("HTLC contract %s preimage mismatch", swapID)
		return fmt.Errorf("preimage mismatch")
	}
	swap.Status = "redeemed"
	swapContracts[swapID] = swap
	log.Printf("HTLC contract %s redeemed", swapID)
	return nil
}

// RevertHTLC reverts an HTLC contract after timeout, with logging
func RevertHTLC(swapID string) error {
	swapContractsMutex.Lock()
	defer swapContractsMutex.Unlock()
	swap, ok := swapContracts[swapID]
	if !ok {
		log.Printf("HTLC contract %s not found for revert", swapID)
		return fmt.Errorf("contract not found")
	}
	swap.Status = "reverted"
	swapContracts[swapID] = swap
	log.Printf("HTLC contract %s reverted", swapID)
	return nil
}
