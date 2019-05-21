package main

import (
	"net/http"
)

const documentApiPath = "/api/document"
const passwordApiPath = "/api/document/password"
const dataPath = "./data"
const address = ":8080"

func main() {
	repository := Repository{dataPath}
	service := Service{&repository}
	controller := Controller{&service}

	repository.createDataDirectory()

	http.HandleFunc(documentApiPath, controller.handleDocument)
	http.HandleFunc(passwordApiPath, controller.handlePassword)
	http.ListenAndServe(address, nil)
}
