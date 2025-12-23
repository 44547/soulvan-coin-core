package main

import (
	"fmt"
	"log"
	"sync"
)

type Wallet struct {
	mu      sync.RWMutex
	Balance float64
}

var wallet = &Wallet{}

func GetWalletBalance() float64 {
	wallet.mu.RLock()
	defer wallet.mu.RUnlock()
	return wallet.Balance
}

func SetWalletBalance(b float64) {
	wallet.mu.Lock()
	wallet.Balance = b
	wallet.mu.Unlock()
}

type WalletSession struct {
	SessionID string
	UserID    string
	Addresses []string
	MFAActive bool
	Hardware  bool
	Created   int64
	Expires   int64
}

var (
	walletSessions      = make(map[string]WalletSession)
	walletSessionsMutex sync.RWMutex
)

// StartWalletSession starts a new wallet session with error handling and logging
func StartWalletSession(sessionID, userID string) error {
	walletSessionsMutex.Lock()
	defer walletSessionsMutex.Unlock()
	if sessionID == "" || userID == "" {
		log.Printf("Invalid wallet session parameters: %s, %s", sessionID, userID)
		return fmt.Errorf("invalid parameters")
	}
	walletSessions[sessionID] = WalletSession{
		SessionID: sessionID,
		UserID:    userID,
		Addresses: []string{},
		MFAActive: false,
		Hardware:  false,
		Created:   0,
		Expires:   0,
	}
	log.Printf("Wallet session %s started for user %s", sessionID, userID)
	return nil
}

// EnableMFA enables MFA for a wallet session with logging
func EnableMFA(sessionID string) error {
	walletSessionsMutex.Lock()
	defer walletSessionsMutex.Unlock()
	session, ok := walletSessions[sessionID]
	if !ok {
		log.Printf("Wallet session %s not found for MFA", sessionID)
		return fmt.Errorf("session not found")
	}
	session.MFAActive = true
	walletSessions[sessionID] = session
	log.Printf("MFA enabled for wallet session %s", sessionID)
	return nil
}

// HardwareSign simulates hardware signing for a session with logging
// (removed duplicate definition)

// DeriveAddress simulates address derivation with logging
func DeriveAddress(sessionID, pubkey string) (string, error) {
	walletSessionsMutex.Lock()
	defer walletSessionsMutex.Unlock()
	session, ok := walletSessions[sessionID]
	if !ok {
		log.Printf("Wallet session %s not found for address derivation", sessionID)
		return "", fmt.Errorf("session not found")
	}
	if pubkey == "" {
		log.Printf("Invalid pubkey for address derivation in session %s", sessionID)
		return "", fmt.Errorf("invalid pubkey")
	}
	session.Addresses = append(session.Addresses, "addr-"+pubkey)
	walletSessions[sessionID] = session
	log.Printf("Address derived for wallet session %s: addr-%s", sessionID, pubkey)
	return session.Addresses[len(session.Addresses)-1], nil
}

// Universal wallet support stubs
func WalletConnectBridge(sessionID string) error {
	log.Printf("WalletConnect bridge stub for session %s", sessionID)
	return nil
}
func MetaMaskProviderShim(sessionID string) error {
	log.Printf("MetaMask provider shim stub for session %s", sessionID)
	return nil
}
func HardwareWalletSupport(sessionID string) error {
	log.Printf("Hardware wallet support stub for session %s", sessionID)
	return nil
}
