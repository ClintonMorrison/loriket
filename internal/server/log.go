package server

import "fmt"


func logDebug(msg string) {
	fmt.Printf("[DEBUG] %s", msg)
}

func logInfo(msg string) {
	fmt.Printf("[INFO] %s", msg)
}
