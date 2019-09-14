package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type DocumentBody struct {
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


type DocumentController struct {
	service *Service
	requestLogger *log.Logger
}


func parseDocumentRequestBody(body []byte) (*DocumentRequest, error) {
	documentRequest := &DocumentRequest{}
	err := json.Unmarshal(body, documentRequest)
	if err != nil {
		return nil, ERROR_BAD_REQUEST
	}

	return documentRequest, nil
}


func (c *DocumentController) postDocument(auth Auth, body []byte) Response {
	request, err := parseDocumentRequestBody(body)
	if err != nil {
		return responseForError(err)
	}

	err = c.service.CreateDocument(auth, request.Document)
	if err != nil {
		return responseForError(err)
	}

	return Response{201, DocumentBody{""}}
}

func (c *DocumentController) putDocument(auth Auth, body []byte) Response {
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

		return Response{202, DocumentBody{""}}
	}

	err = c.service.UpdateDocument(auth, request.Document)
	if err != nil {
		return responseForError(err)
	}

	return Response{202, DocumentBody{""}}
}

func (c *DocumentController) getDocument(auth Auth) Response {
	document, err := c.service.GetDocument(auth)
	if err != nil {
		return responseForError(err)
	}

	return Response{200, DocumentBody{string(document)}}
}

func (c *DocumentController) deleteDocument(auth Auth) Response {
	err := c.service.DeleteDocument(auth)
	if err != nil {
		return responseForError(err)
	}

	return Response{204,DocumentBody{}}
}

func (c *DocumentController) parseRequest(w http.ResponseWriter, r *http.Request) (*Auth, []byte) {
	w.Header().Set("Content-Type", "application/text")

	// Read auth headers
	auth, err := AuthFromRequest(r)
	if err != nil {
		writeResponse(r, w, invalidRequestResponse, c.requestLogger)
		return nil, nil
	}

	// Read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		writeResponse(r, w, invalidRequestResponse, c.requestLogger)
		return nil, nil
	}

	return &auth, body
}


func (c *DocumentController) handle(w http.ResponseWriter, r *http.Request) {
	auth, body := c.parseRequest(w, r)
	if auth == nil {
		return
	}

	var response Response

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

	writeResponse(r, w, response, c.requestLogger)
}