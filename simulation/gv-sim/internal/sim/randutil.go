package sim

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/rand"

	"github.com/xeipuuv/gojsonschema"
)

type Rander interface {
	Float64() float64
	Intn(n int) int
}

func NewRand(seed int64) *rand.Rand {
	return rand.New(rand.NewSource(seed))
}

func clampI32(v, lo, hi int32) int32 {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

func boundedJitter(rng Rander, lo, hi, fraction float64) float64 {
	base := (lo + hi) / 2
	amp := (hi - lo) / 2
	j := (rng.Float64()*2 - 1) * (amp * fraction)
	v := base + j
	if v < lo {
		v = lo
	}
	if v > hi {
		v = hi
	}
	return v
}

func toLowerHex(b []byte) string {
	dst := make([]byte, hex.EncodedLen(len(b)))
	hex.Encode(dst, b)
	return string(dst)
}

func RandHex(rng Rander, nBytes int) string {
	buf := make([]byte, nBytes)
	for i := range buf {
		buf[i] = byte(rng.Intn(256))
	}
	h := sha256.Sum256(buf)
	out := toLowerHex(h[:])
	if len(out) >= nBytes*2 {
		return out[:nBytes*2]
	}
	return (out + out)[:nBytes*2]
}

func ValidateSensorPlain(plain Plain) error {
	schemaLoader := gojsonschema.NewReferenceLoader("file:///home/0xKaBG/Projects/carbon.y/simulation/gv-sim/schema/sensor_plain.schema.json")
	documentLoader := gojsonschema.NewGoLoader(plain)
	result, err := gojsonschema.Validate(schemaLoader, documentLoader)
	if err != nil {
		return err
	}
	if !result.Valid() {
		return fmt.Errorf("sensor payload validation failed: %v", result.Errors())
	}
	return nil
}

func ValidateSensorEnvelope(env Envelope) error {
	schemaLoader := gojsonschema.NewReferenceLoader("file:///home/0xKaBG/Projects/carbon.y/simulation/gv-sim/schema/sensor_envelope.schema.json")
	documentLoader := gojsonschema.NewGoLoader(env)
	result, err := gojsonschema.Validate(schemaLoader, documentLoader)
	if err != nil {
		panic(err.Error())
	}
	if !result.Valid() {
		return fmt.Errorf("sensor envelope validation failed: %v", result.Errors())
	}
	return nil
}
