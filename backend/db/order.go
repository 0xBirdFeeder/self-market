package db

import (
	"database/sql"
	"fmt"

	"github.com/ethereum/go-ethereum/core/types"
)

type OrderDB struct {
	db *sql.DB
}

func Order(db *sql.DB) *OrderDB {
	return &OrderDB{db}
}

func (o *OrderDB) SaveLog(log types.Log) {
	fmt.Println(log)
}
