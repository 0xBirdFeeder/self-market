package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/0xBirdFeeder/self-market/backend/db"
)

type ProofService struct {
	db *db.ProofDB
}

func NewProofService(db *db.ProofDB) *ProofService {
	return &ProofService{db}
}

func (p *ProofService) ProofCallback(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var jsonBlob map[string]interface{}
	fmt.Println(string(body))
	err = json.Unmarshal(body, &jsonBlob)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fmt.Println(jsonBlob)

	w.WriteHeader(http.StatusOK)
}
