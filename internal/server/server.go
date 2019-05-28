package server

import (
	"net/http"
	"fmt"
)

const documentApiPath = "/api/document"

func Run(dataPath string, address string) {
	repository := &Repository{dataPath}
	lockoutTable := NewLockoutTable()
	service := &Service{repository, lockoutTable}
	controller := Controller{service}

	repository.createDataDirectory()

	http.HandleFunc(documentApiPath, controller.handleDocument)
	fmt.Printf("Listening on http://localhost:%s\n", address)
	err := http.ListenAndServe(address, nil)
	if err != nil {
		panic(err)
	}
}

