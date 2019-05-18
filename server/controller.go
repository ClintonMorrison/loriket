package main

import (
	"github.com/loriket/server/errors"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"fmt"
)

type DocumentResponse struct {
	Code int `json:"-"`
	Error string `json:"error,omitempty"`
	Document string `json:"document,omitempty"`
}

type Controller struct {
	service *Service
}

var invalidRequestResponse = DocumentResponse{400,"Invalid request.", ""}
var usernameTakenResponse = DocumentResponse{401,"Username already taken.", ""}
var invalidCredentialsResponse = DocumentResponse{401,"Invalid user or credentials.", ""}
var internalServerError = DocumentResponse{500, "Server error. Please try again later.", ""}

var fallbackErrorJSON, _ = json.Marshal(internalServerError)


func responseForError(err error) DocumentResponse {
	switch err {
	case errors.INVALID_USER_NAME:
		return usernameTakenResponse
	case errors.INVALID_CREDENTIALS:
		return invalidCredentialsResponse
	case errors.SERVER_ERROR:
	default:
		return internalServerError
	}

	return internalServerError
}


func (c *Controller) postDocument(auth Auth, document []byte) DocumentResponse {
	err := c.service.CreateDocument(auth, document)
	if err != nil {
		return responseForError(err)
	}

	return DocumentResponse{201, "", ""}
}

func (c *Controller) putDocument(auth Auth, document []byte) DocumentResponse {
	err := c.service.UpdateDocument(auth, document)
	if err != nil {
		return responseForError(err)
	}

	return DocumentResponse{202, "", ""}
}

func (c *Controller) getDocument(auth Auth) DocumentResponse {
	document, err := c.service.GetDocument(auth)
	if err != nil {
		return responseForError(err)
	}

	return DocumentResponse{200,"", string(document)}
}

func (c *Controller) handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/text")
	if debugMode {
		w.Header().Set("Access-Control-Allow-Origin", "*") // TODO: for debugging
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // TODO: for debugging
		w.Header().Set("Access-Control-Allow-Methods", "PUT") // TODO: for debugging
	}

	if r.Method == "OPTIONS" {
		w.WriteHeader(200)
		return
	}

	// Read auth headers
	auth, err := AuthFromRequest(r)
	if err != nil {
		writeResponse(w, invalidRequestResponse)
		return
	}

	// Read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		writeResponse(w, invalidRequestResponse)
		return
	}

	var response DocumentResponse

	// Call handler based on method
	switch r.Method {
	case "GET":
		response = c.getDocument(auth)
	case "PUT":
		response = c.putDocument(auth, body)
	case "POST":
		response = c.postDocument(auth, body)
	default:
		response = invalidRequestResponse
		return
	}

	writeResponse(w, response)
}

func writeResponse(w http.ResponseWriter, response DocumentResponse) {
	fmt.Printf("Response: %d %s\n", response.Code, response.Error)
	w.WriteHeader(response.Code)

	jsonResponse, err := json.Marshal(response)

	if err != nil {
		w.WriteHeader(500)
		w.Write(fallbackErrorJSON)
		return
	}

	w.Write(jsonResponse)
}
