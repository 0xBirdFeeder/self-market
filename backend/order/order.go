package order

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/0xBirdFeeder/self-market/backend/db"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

type OrderBook struct {
	db *db.OrderDB
}

func NewOrderListener(db *db.OrderDB) *OrderBook {
	return &OrderBook{db}
}

func (o *OrderBook) StartOrderListener() {
	client, err := ethclient.Dial("wss://forno.celo.org/ws")
	if err != nil {
		log.Fatal(err)
	}

	contract := os.Getenv("MARKET_CONTRACT")
	fmt.Println("market contract: ", contract)
	if contract == "" {
		log.Fatal("MARKET_CONTRACT must be defined in .env")
	}

	contractAddress := common.HexToAddress(contract)
	query := ethereum.FilterQuery{
		Addresses: []common.Address{contractAddress},
	}

	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatal(err)
	}

	for {
		select {
		case err := <-sub.Err():
			fmt.Println("reconnecting")
			sub, err = client.SubscribeFilterLogs(context.Background(), query, logs)
			if err != nil {
				log.Fatal(err)
			}
			// fmt.Println("error parsing log:", err)
		case vLog := <-logs:
			o.db.SaveLog(vLog) // pointer to event log
		}
	}
}
