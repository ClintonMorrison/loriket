package main

import (
	"github.com/ClintonMorrison/lorikeet/internal/config"
	"github.com/ClintonMorrison/lorikeet/internal/server"
)

func main() {
	server.Run(
		config.DATA_PATH,
		config.SERVER_ADDRESS,
		config.LOG_PATH,
		config.REQUEST_LOG_PATH,
		config.ERROR_LOG_PATH)
}
