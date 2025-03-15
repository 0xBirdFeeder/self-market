package utils

import (
	"fmt"
	"math/big"
)

const VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX = 20

func GetUserIdentifier(publicSignals []string) (string, bool) {

	bigInt := new(big.Int)
	_, ok := bigInt.SetString(publicSignals[VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX], 10)

	return castToUserIdentifier(bigInt), ok
}

func castToUserIdentifier(i *big.Int) string {
	return fmt.Sprintf("0x%040x", i)
}
