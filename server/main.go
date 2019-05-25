package main

import (
	"net/http"
	"fmt"
)

const documentApiPath = "/api/document"
const passwordApiPath = "/api/document/password"
const dataPath = "./data"
const address = ":8080"

func main() {
	repository := Repository{dataPath}
	lockoutTable := NewLockoutTable()
	service := Service{&repository, lockoutTable}
	controller := Controller{&service}

	repository.createDataDirectory()

	http.HandleFunc(documentApiPath, controller.handleDocument)
	http.HandleFunc(passwordApiPath, controller.handlePassword)
	fmt.Printf("Listening on http://localhost:%s\n", address)
	http.ListenAndServe(address, nil)
}
