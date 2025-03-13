package db

import "database/sql"

type ProofDB struct {
	db *sql.DB
}

func Proof(db *sql.DB) *ProofDB {
	return &ProofDB{db}
}
