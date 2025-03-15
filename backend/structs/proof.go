package structs

type ProofCallback struct {
	Proof         Proof    `json:"proof"`
	PublicSignals []string `json:"publicSignals"`
}

type Proof struct {
	A        []string   `json:"a"`
	B        [][]string `json:"b"`
	C        []string   `json:"c"`
	Protocol string     `json:"protocol"`
	Curve    string     `json:"curve"`
}
