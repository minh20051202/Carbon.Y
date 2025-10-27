package sim

import (
	"crypto/ed25519"
	cryptoRand "crypto/rand"
	"encoding/base64"
	"encoding/hex"

	"lukechampine.com/blake3"
)

type Keypair struct {
	Pub  ed25519.PublicKey
	Priv ed25519.PrivateKey
}

func NewKeyPair() Keypair {
	pub, priv, err := ed25519.GenerateKey(cryptoRand.Reader)
	if err != nil {
		panic(err)
	}
	return Keypair{Pub: pub, Priv: priv}
}

func Sign(priv ed25519.PrivateKey, msg []byte) string {
	sig := ed25519.Sign(priv, msg)
	return base64.StdEncoding.EncodeToString(sig)
}

func Blake3Hex(b []byte) string {
	sum := blake3.Sum256(b)
	return hex.EncodeToString(sum[:])
}
