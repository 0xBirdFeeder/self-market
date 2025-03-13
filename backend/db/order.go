package db

import "database/sql"

type OrderDB struct {
	db *sql.DB
}

func Order(db *sql.DB) *OrderDB {
	return &OrderDB{db}
}
