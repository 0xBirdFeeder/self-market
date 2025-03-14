package utils

import (
	"fmt"
	"math/big"
)

const VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX = 20

func GetUserIdentifier(publicSignals map[int]int64) string {
	return castToUserIdentifier(big.NewInt(publicSignals[VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX]))
}

func castToUserIdentifier(i *big.Int) string {
	return fmt.Sprintf("0x%040x", i)
}
