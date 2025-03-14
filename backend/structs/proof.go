package structs

type ProofRequest struct {
	Proof         map[string]interface{} `json:"proof"`
	PublicSignals map[int]int64          `json:"publicSignals"`
}
