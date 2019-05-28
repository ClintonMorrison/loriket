package main

import (
	"github.com/ClintonMorrison/lorikeet/internal/backup"
	"time"
	"fmt"
	"os"
	"github.com/ClintonMorrison/lorikeet/internal/config"
)

func main() {

	// Make directory for backups
	err := os.Mkdir(config.DATA_PATH, 0700)
	if err != nil && !os.IsExist(err) {
		panic(err)
	}

	timeStamp := time.Now().Format(time.RFC3339)
	outputPath := fmt.Sprintf("%s/backup-%s.tar.gz", config.BACKUP_PATH, timeStamp)

	backup.ToTarball(config.DATA_PATH, outputPath)
}
