package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/0xBirdFeeder/self-market/backend/db"
	"github.com/0xBirdFeeder/self-market/backend/structs"
	"github.com/0xBirdFeeder/self-market/backend/utils"
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

	var callback structs.ProofCallback
	fmt.Println(string(body))
	err = json.Unmarshal(body, &callback)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fmt.Println(callback)

	publicSignals := callback.PublicSignals
	address, ok := utils.GetUserIdentifier(publicSignals)
	if !ok {
		fmt.Println("unable to parse user identifier")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = p.db.SaveProof(address, string(body))
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (p *ProofService) GetProof(w http.ResponseWriter, r *http.Request) {
	address := r.URL.Query().Get("address")

	proof, err := p.db.GetProof(address)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
	}

	w.Write([]byte(proof))
}
