package order

import (
	"database/sql"
	"fmt"
	"time"
)

type OrderBook struct {
	db *sql.DB
}

func NewOrderListener(db *sql.DB) *OrderBook {
	return &OrderBook{db}
}

func (o *OrderBook) StartOrderListener() {
	for {
		fmt.Println("querying events")
		time.Sleep(5 * time.Second)
	}
}
