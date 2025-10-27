package sim

import (
	"encoding/json"

	jcs "github.com/cyberphone/json-canonicalization/go/src/webpki.org/jsoncanonicalizer"
)

func Canonicalize(v any) ([]byte, error) {
	raw, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	return jcs.Transform(raw)
}

func CanonicalizeAndHash(plain Plain) (canon []byte, b3hex string, err error) {
	canon, err = Canonicalize(plain)
	if err != nil {
		return nil, "", err
	}
	return canon, Blake3Hex(canon), nil
}
