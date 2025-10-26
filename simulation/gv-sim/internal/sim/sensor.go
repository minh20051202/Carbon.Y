package internal

import "github.com/google/uuid"

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
