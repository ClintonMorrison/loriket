package main

import (
	"net/http"
	"fmt"
	"encoding/json"
	"io/ioutil"
)

const basePath = "/api"
const debugMode = true

func main() {
	err := createDataDirecty()
	if err != nil {
		panic(err)
	}

	http.HandleFunc(basePath + "/document", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// Read auth headers
		auth, err := AuthFromRequest(r)
		if err != nil {
			respondWithError(w, err)
			return
		}

		// Read body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			respondWithError(w, err)
			return
		}

		var response DocumentResponse

		// Call handler based on method
		switch r.Method {
		case "GET":
			response = getDocument(auth)
		case "PUT":
			response = putDocument(auth, body)
		case "POST":
			response = postDocument(auth, body)
		default:
			response = DocumentResponse{400, "Invalid request", ""}
			return
		}

		// Convert response into JSON
		w.WriteHeader(response.Code)
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			respondWithError(w, err)
			return
		}
		w.Write(jsonResponse)
	})

	http.ListenAndServe(":8080", nil)
}

func respondWithError(w http.ResponseWriter, err error) {
	w.WriteHeader(401)
	response := ErrorResponse{err.Error()}
	fmt.Println(err)

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		w.Write([]byte("{\"error\": \"error formatting error message\"}"))
		return
	}

	w.Write(jsonResponse)
}
