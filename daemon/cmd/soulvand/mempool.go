package main

import "sync"

type Mempool struct {
	mu sync.RWMutex
	TxCount int
}

var mempool = &Mempool{}

func GetMempoolTxCount() int {
	mempool.mu.RLock()
	defer mempool.mu.RUnlock()
	return mempool.TxCount
}

func AddTxToMempool() {
	mempool.mu.Lock()
	mempool.TxCount++
	mempool.mu.Unlock()
}

func RemoveTxFromMempool() {
	mempool.mu.Lock()
	if mempool.TxCount > 0 {
		mempool.TxCount--
	}
	mempool.mu.Unlock()
}
