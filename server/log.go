package main

import "fmt"

func logDebug(msg string) {
	if debugMode {
		fmt.Printf("[DEBUG] %s", msg)
	}
}

func logInfo(msg string) {
	fmt.Printf("[INFO] %s", msg)
}
