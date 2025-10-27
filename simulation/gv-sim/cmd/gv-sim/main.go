package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"gv-sim/internal/sim"
)

func postEnvelope(client *http.Client, url string, env sim.Envelope) error {
	body, err := json.Marshal(env)
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("do: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("non-2xx: %s", resp.Status)
	}
	return nil
}

func main() {
	var (
		urlFlag   = flag.String("url", "http://localhost:8080/api/envelopes", "POST endpoint for envelopes")
		intervalS = flag.Int("interval", 5, "seconds between sends in loop mode")
		seed      = flag.Int64("seed", time.Now().UnixNano(), "RNG seed")
	)
	flag.Parse()

	log.SetFlags(0)
	fmt.Println("GV-SIM REPL. Type 'help' for commands.")

	// Prepare sensors (3 CO2 devices)
	sensors := []*sim.Sensor{
		newSensor("co2-rs485-00001"),
		newSensor("co2-rs485-00002"),
		newSensor("co2-rs485-00003"),
	}
	rng := sim.NewRand(*seed)

	client := &http.Client{Timeout: 10 * time.Second}
	endpoint := *urlFlag
	interval := time.Duration(*intervalS) * time.Second
	looping := false
	ticker := time.NewTicker(24 * time.Hour) // dummy; will reset when loop starts
	ticker.Stop()

	// REPL
	in := bufio.NewScanner(os.Stdin)
	printHelp := func() {
		fmt.Println(`Commands:
  send              - send one envelope per sensor (immediately)
  loop              - start continuous sending every interval
  stop              - stop continuous mode
  url <endpoint>    - set POST endpoint (current: ` + endpoint + `)
  interval <sec>    - set loop interval seconds (current: ` + fmt.Sprint(int(interval.Seconds())) + `)
  boot              - simulate power cycle (new bootId, nonce=0) for all sensors
  show              - show current config
  help              - show this help
  quit/exit         - leave`)
	}

	printShow := func() {
		fmt.Println("Endpoint:", endpoint)
		fmt.Println("Interval:", interval)
		fmt.Println("Looping :", looping)
		for _, s := range sensors {
			fmt.Printf("  - %s bootId=%s nextNonce=%d\n", s.ID, s.BootID, s.NextNonceForDebug())
		}
	}

	sendOnce := func() {
		now := time.Now().UTC().Truncate(time.Millisecond)
		for _, s := range sensors {
			env, err := sim.GenerateEnvelope(rng, s, now)
			if err != nil {
				log.Printf("[%s] generate error: %v", s.ID, err)
				continue
			}
			if err := postEnvelope(client, endpoint, env); err != nil {
				log.Printf("[%s] POST %s -> %v", s.ID, endpoint, err)
			} else {
				log.Printf("[%s] POST %s -> ok (nonce=%d ts=%s)", s.ID, endpoint, env.Nonce, env.TsUTC)
			}
		}
	}

	printHelp()
	for {
		fmt.Print("> ")
		if !in.Scan() {
			break
		}
		line := strings.TrimSpace(in.Text())
		if line == "" {
			continue
		}
		parts := strings.Fields(line)
		cmd := strings.ToLower(parts[0])

		switch cmd {
		case "help", "h", "?":
			printHelp()

		case "show":
			printShow()

		case "send":
			sendOnce()

		case "loop":
			if looping {
				fmt.Println("already looping")
				continue
			}
			looping = true
			ticker.Reset(interval)
			fmt.Println("loop started (interval:", interval, ")")
			// loop goroutine
			go func() {
				for range ticker.C {
					if looping {
						sendOnce()
					}
				}
			}()

		case "stop":
			if !looping {
				fmt.Println("not looping")
				continue
			}
			looping = false
			ticker.Stop()
			fmt.Println("loop stopped")

		case "url":
			if len(parts) < 2 {
				fmt.Println("usage: url <endpoint>")
				continue
			}
			endpoint = parts[1]
			fmt.Println("set endpoint =", endpoint)

		case "interval":
			if len(parts) < 2 {
				fmt.Println("usage: interval <seconds>")
				continue
			}
			sec, err := time.ParseDuration(parts[1] + "s")
			if err != nil || sec <= 0 {
				fmt.Println("invalid seconds")
				continue
			}
			interval = sec
			if looping {
				ticker.Reset(interval)
			}
			fmt.Println("set interval =", interval)

		case "boot":
			for _, s := range sensors {
				s.SimulateBoot() // new bootId and reset nonce
			}
			fmt.Println("boot cycled all sensors")

		case "quit", "exit":
			if looping {
				ticker.Stop()
			}
			fmt.Println("bye")
			return

		default:
			fmt.Println("unknown command; type 'help'")
		}
	}
}

// helper to make a CO2 sensor
func newSensor(id string) *sim.Sensor {
	s := sim.NewSensor(id, "CO2", "ppm", "dry", 380, 1200)
	return &s
}
