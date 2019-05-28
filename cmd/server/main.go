package main

import (
	"github.com/ClintonMorrison/lorikeet/internal/server"
	"github.com/ClintonMorrison/lorikeet/internal/config"
)

func main() {
	server.Run(config.DATA_PATH, config.SERVER_ADDRESS)
}
