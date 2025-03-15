package db

import (
	"database/sql"
	"fmt"
)

type ProofDB struct {
	db *sql.DB
}

func Proof(db *sql.DB) *ProofDB {
	return &ProofDB{db}
}

func (p *ProofDB) CreateTables() error {

	_, err := p.db.Exec(`
		CREATE TABLE IF NOT EXISTS proofs(
			address TEXT PRIMARY KEY NOT NULL,
			raw TEXT
		);
	`)
	if err != nil {
		return fmt.Errorf("error creating proof tables: %s", err)
	}

	return nil
}

func (p *ProofDB) SaveProof(address string, raw string) error {

	_, err := p.db.Exec(`
		INSERT INTO proofs
			(address, raw)
		VALUES
			($1, $2)
		ON CONFLICT
			(address)
		DO UPDATE SET
			raw = $2
		WHERE
			address = $1;
	`, address, raw)
	if err != nil {
		return fmt.Errorf("error saving proof: %s", err)
	}

	return nil
}

func (p *ProofDB) GetProof(address string) (string, error) {
	row := p.db.QueryRow(`
		SELECT
			raw
		FROM
			proofs
		WHERE
			address = $1
		COLLATE NOCASE;
	`, address)

	var proof string

	err := row.Scan(&proof)
	if err != nil {
		return "", fmt.Errorf("error retrieving proof: %s", err)
	}

	return proof, nil
}
