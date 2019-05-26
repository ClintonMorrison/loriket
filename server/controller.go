package main

import (
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

type PasswordRequest struct {
	Password string `json:"password"`
	Document string `json:"document"`
}

type DocumentRequest struct {
	Password string `json:"password,omitempty"`
	Document string `json:"document"`
}


type Controller struct {
	service *Service
}

var invalidRequestResponse = DocumentResponse{400,"Invalid request.", ""}
var usernameTakenResponse = DocumentResponse{401,"Username already taken.", ""}
var invalidCredentialsResponse = DocumentResponse{401,"Invalid user or credentials.", ""}
var tooManyRequestsResponse = DocumentResponse{429,"Too many failed login attempts. Try again in a few hours.", ""}

var internalServerError = DocumentResponse{500, "Server error. Please try again later.", ""}

var fallbackErrorJSON, _ = json.Marshal(internalServerError)


func responseForError(err error) DocumentResponse {
	switch err {
	case ERROR_BAD_REQUEST:
		return invalidRequestResponse
	case ERROR_INVALID_USER_NAME:
		return usernameTakenResponse
	case ERROR_INVALID_CREDENTIALS:
		return invalidCredentialsResponse
	case ERROR_TOO_MANY_REQUESTS:
		return tooManyRequestsResponse
	case ERROR_SERVER_ERROR:
	default:
		return internalServerError
	}

	return internalServerError
}

func parseDocumentRequestBody(body []byte) (*DocumentRequest, error) {
	documentRequest := &DocumentRequest{}
	err := json.Unmarshal(body, documentRequest)
	if err != nil {
		logError(err)
		return nil, ERROR_BAD_REQUEST
	}

	return documentRequest, nil
}


func (c *Controller) postDocument(auth Auth, body []byte) DocumentResponse {
	request, err := parseDocumentRequestBody(body)
	if err != nil {
		return responseForError(err)
	}

	err = c.service.CreateDocument(auth, request.Document)
	if err != nil {
		return responseForError(err)
	}

	return DocumentResponse{201, "", ""}
}

func (c *Controller) putDocument(auth Auth, body []byte) DocumentResponse {
	request, err := parseDocumentRequestBody(body)
	if err != nil {
		return responseForError(err)
	}

	// Update password if password was given
	if len(request.Password) > 0 {
		err := c.service.UpdateDocumentAndPassword(auth, request.Password, request.Document)
		if err != nil {
			return responseForError(err)
		}
		return DocumentResponse{202, "", ""}
	}

	err = c.service.UpdateDocument(auth, request.Document)
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

func (c *Controller) deleteDocument(auth Auth) DocumentResponse {
	err := c.service.DeleteDocument(auth)
	if err != nil {
		return responseForError(err)
	}

	return DocumentResponse{204,"", ""}
}

func (c *Controller) parseRequest(w http.ResponseWriter, r *http.Request) (*Auth, []byte) {
	fmt.Printf("[REQUEST] %s %s | %s %s\n", r.Method, r.RequestURI, r.Header.Get("X-Forwarded-For"), r.Header.Get("User-Agent"))

	w.Header().Set("Content-Type", "application/text")

	// Read auth headers
	auth, err := AuthFromRequest(r)
	if err != nil {
		logDebug(err.Error())
		writeResponse(w, invalidRequestResponse)
		return nil, nil
	}

	// Read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		logDebug(err.Error())
		writeResponse(w, invalidRequestResponse)
		return nil, nil
	}

	return &auth, body
}


func (c *Controller) handleDocument(w http.ResponseWriter, r *http.Request) {
	auth, body := c.parseRequest(w, r)
	if auth == nil {
		return
	}

	var response DocumentResponse

	// Call handler based on method
	switch r.Method {
	case "GET":
		response = c.getDocument(*auth)
	case "PUT":
		response = c.putDocument(*auth, body)
	case "POST":
		response = c.postDocument(*auth, body)
	case "DELETE":
		response = c.deleteDocument(*auth)
	default:
		response = invalidRequestResponse
	}

	writeResponse(w, response)
}


func writeResponse(w http.ResponseWriter, response DocumentResponse) {
	fmt.Printf("   [RESPONSE] %d %s\n", response.Code, response.Error)
	w.WriteHeader(response.Code)

	jsonResponse, err := json.Marshal(response)

	if err != nil {
		w.WriteHeader(500)
		w.Write(fallbackErrorJSON)
		return
	}

	w.Write(jsonResponse)
}
