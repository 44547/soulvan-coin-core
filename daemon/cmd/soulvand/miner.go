package main

import (
    "context"
    "crypto/sha256"
    "encoding/binary"
    "fmt"
    "math/rand"
    "runtime"
    "sync/atomic"
    "time"
)

// AdvancedMinerConfig allows tuning of mining parameters.
type AdvancedMinerConfig struct {
    Header         []byte
    DifficultyBits uint32 // number of leading zero bits
    Workers        int
    ReportInterval time.Duration
    MaxAttempts    uint64 // optional: stop after N attempts (0 = unlimited)
}

// AdvancedMineBlock mines for a valid nonce using concurrency, reporting progress.
func AdvancedMineBlock(ctx context.Context, cfg AdvancedMinerConfig) (nonce uint64, hash []byte, attempts uint64, elapsed time.Duration, err error) {
    if cfg.Workers <= 0 {
        cfg.Workers = runtime.NumCPU()
    }
    if cfg.ReportInterval <= 0 {
        cfg.ReportInterval = 2 * time.Second
    }
    start := time.Now()
    var found int32
    var totalAttempts uint64
    result := make(chan struct {
        nonce uint64
        hash  []byte
    }, 1)
    stop := make(chan struct{})
    worker := func(id int) {
        r := rand.New(rand.NewSource(time.Now().UnixNano() + int64(id)))
        for {
            select {
            case <-stop:
                return
            default:
                n := r.Uint64()
                // Custom nonce encoding: pack nonce as 8 bytes, big-endian
                buf := make([]byte, len(cfg.Header)+8)
                copy(buf, cfg.Header)
                binary.BigEndian.PutUint64(buf[len(cfg.Header):], n)
                h := sha256.Sum256(buf)
                atomic.AddUint64(&totalAttempts, 1)
                if MeetsDifficulty(h[:], cfg.DifficultyBits) {
                    if atomic.CompareAndSwapInt32(&found, 0, 1) {
                        result <- struct {
                            nonce uint64
                            hash  []byte
                        }{nonce: n, hash: h[:]}
                        return
                    }
                }
                if cfg.MaxAttempts > 0 && atomic.LoadUint64(&totalAttempts) >= cfg.MaxAttempts {
                    return
                }
            }
        }
    }
    // Start workers
    for i := 0; i < cfg.Workers; i++ {
        go worker(i)
    }
    // Progress reporter
    ticker := time.NewTicker(cfg.ReportInterval)
    defer ticker.Stop()
loop:
    for {
        select {
        case res := <-result:
            close(stop)
            nonce, hash = res.nonce, res.hash
            break loop
        case <-ticker.C:
            fmt.Printf("[miner] Attempts: %d, Elapsed: %s\n", atomic.LoadUint64(&totalAttempts), time.Since(start))
        case <-ctx.Done():
            close(stop)
            err = ctx.Err()
            break loop
        default:
            if cfg.MaxAttempts > 0 && atomic.LoadUint64(&totalAttempts) >= cfg.MaxAttempts {
                close(stop)
                err = fmt.Errorf("max attempts reached")
                break loop
            }
            time.Sleep(10 * time.Millisecond)
        }
    }
    attempts = atomic.LoadUint64(&totalAttempts)
    elapsed = time.Since(start)
    return
}

// MeetsDifficulty checks if hash has at least 'difficulty' leading zero bits.
func MeetsDifficulty(hash []byte, difficulty uint32) bool {
    zeros := uint32(0)
    for _, b := range hash {
        for i := 7; i >= 0; i-- {
            if b&(1<<i) == 0 {
                zeros++
                if zeros >= difficulty {
                    return true
                }
            } else {
                return false
            }
        }
    }
    return false
}

// Example usage
func main() {
    cfg := AdvancedMinerConfig{
        Header:         []byte("custom block header"),
        DifficultyBits: 22, // adjust for your chain
        Workers:        runtime.NumCPU(),
        ReportInterval: 1 * time.Second,
        MaxAttempts:    0, // unlimited
    }
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    fmt.Printf("Starting advanced mining with %d workers, difficulty %d...\n", cfg.Workers, cfg.DifficultyBits)
    nonce, hash, attempts, elapsed, err := AdvancedMineBlock(ctx, cfg)
    if err != nil {
        fmt.Printf("Mining stopped: %v\n", err)
    } else {
        fmt.Printf("Block mined!\nNonce: %d\nHash: %x\nAttempts: %d\nElapsed: %s\n", nonce, hash, attempts, elapsed)
    }
}