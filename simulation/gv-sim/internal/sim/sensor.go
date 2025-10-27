package sim

import (
	"time"

	"github.com/google/uuid"
)

type Plain struct {
	SensorID      string  `json:"sensorId"`
	TsUTC         string  `json:"tsUtc"`
	BootID        string  `json:"bootId"`
	Nonce         int64   `json:"nonce"`
	Gas           string  `json:"gas"`
	Reading       float64 `json:"reading"`
	Unit          string  `json:"unit"`
	Basis         string  `json:"basis"`
	CalibCertHash string  `json:"calibCertHash"`
	ClockDriftMs  int32   `json:"clockDriftMs"`
}

type Envelope struct {
	Plain
	LineB3 string `json:"lineB3"`
	SigB64 string `json:"sigB64"`
}

type Sensor struct {
	ID     string
	BootID string
	nextN  int64

	Unit    string
	Gas     string
	Basis   string
	RangeLo float64
	RangeHi float64

	Keys Keypair
}

const domainPrefix = "Carbon.Y|reading|"

func NewSensor(id, unit, gas, basis string, lo, hi float64) Sensor {
	return Sensor{
		ID:      id,
		BootID:  uuid.New().String(),
		Unit:    unit,
		Gas:     gas,
		Basis:   basis,
		RangeLo: lo,
		RangeHi: hi,
		Keys:    NewKeyPair(),
	}
}

func (s *Sensor) nextPlain(rng Rander, at time.Time) (Plain, error) {
	reading := boundedJitter(rng, s.RangeLo, s.RangeHi, 0.1) // ±10% of half-range
	drift := clampI32(int32(rng.Intn(240001)-120000), -120000, 120000)

	p := Plain{
		SensorID:      s.ID,
		TsUTC:         at.UTC().Format(time.RFC3339Nano),
		BootID:        s.BootID,
		Nonce:         s.nextN,
		Gas:           s.Gas,
		Reading:       reading,
		Unit:          s.Unit,
		Basis:         s.Basis,
		CalibCertHash: RandHex(rng, 32),
		ClockDriftMs:  drift,
	}
	if err := ValidateSensorPlain(p); err != nil {
		return Plain{}, err
	}
	s.nextN++
	return p, nil
}

func GenerateEnvelope(rng Rander, sensor *Sensor, start time.Time) (Envelope, error) {
	plain, err := sensor.nextPlain(rng, start)
	if err != nil {
		return Envelope{}, err
	}
	canon, lineB3, err := CanonicalizeAndHash(plain)
	if err != nil {
		return Envelope{}, err
	}
	sig := Sign(sensor.Keys.Priv, append([]byte(domainPrefix), canon...))
	env := Envelope{
		Plain:  plain,
		LineB3: lineB3,
		SigB64: sig,
	}
	if err := ValidateSensorEnvelope(env); err != nil {
		return Envelope{}, err
	}
	return env, nil
}

func (s *Sensor) NextNonceForDebug() int64 { return s.nextN }

func (s *Sensor) SimulateBoot() {
	s.BootID = uuid.New().String()
	s.nextN = 0
}
