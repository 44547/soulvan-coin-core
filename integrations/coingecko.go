package integrations

import "fmt"

// CoinGeckoAdapter provides basic structure for CoinGecko price fetch
func CoinGeckoPrice(symbol string) (float64, error) {
	fmt.Println("Fetching price from CoinGecko for symbol:", symbol)
	// TODO: Implement CoinGecko API call
	return 0, nil
}
