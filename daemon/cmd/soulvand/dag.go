package main

import (
	"fmt"
	"sync"
)

// DAGNode represents a node in the DAG with transaction details
type DAGNode struct {
	TxID     string
	Parents  []string
	Children []string
	Data     Transaction
}

// DAGLedger prototypes a DAG-based ledger for parallel transaction processing
func InitDAGLedger() error {
	fmt.Println("Initializing DAG-based ledger...")
	// TODO: Implement DAG ledger logic
	return nil
}

func AddDAGTransaction(txID string, parents []string) error {
	fmt.Println("Adding transaction to DAG:", txID, "with parents:", parents)
	// TODO: Implement DAG transaction logic
	return nil
}

var (
	dagNodes      = make(map[string]DAGNode)
	dagNodesMutex sync.RWMutex
)

// InsertDAGNode inserts a transaction node into the DAG
func InsertDAGNode(node DAGNode) {
	dagNodesMutex.Lock()
	dagNodes[node.ID] = node
	dagNodesMutex.Unlock()
}

// GetParents returns parent nodes for a given node
func GetParents(nodeID string) []string {
	dagNodesMutex.RLock()
	node, ok := dagNodes[nodeID]
	dagNodesMutex.RUnlock()
	if !ok {
		return nil
	}
	return node.Parents
}

// GetChildren returns child nodes for a given node
func GetChildren(nodeID string) []string {
	var children []string
	dagNodesMutex.RLock()
	for _, n := range dagNodes {
		for _, p := range n.Parents {
			if p == nodeID {
				children = append(children, n.ID)
			}
		}
	}
	dagNodesMutex.RUnlock()
	return children
}

// ResolveConflicts removes conflicting nodes
func ResolveConflicts(conflictIDs []string) {
	dagNodesMutex.Lock()
	for _, id := range conflictIDs {
		delete(dagNodes, id)
	}
	dagNodesMutex.Unlock()
}
