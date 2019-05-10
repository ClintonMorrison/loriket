package main

import (
	"net/http"
)

const apiPath = "/api/document"
const debugMode = true
const dataPath = "./data"
const address = ":8080"

func main() {
	repository := Repository{dataPath}
	service := Service{&repository}
	controller := Controller{&service}

	repository.createDataDirectory()

	http.HandleFunc(apiPath, controller.handle)
	http.ListenAndServe(address, nil)
}
