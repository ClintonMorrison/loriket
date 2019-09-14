package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type SessionResponseBody struct {
	SessionId string `json:"sessionId,omitempty"`
}

type SessionRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type SessionDeleteRequest struct {
	SessionId string `json:"sessionId"`
}


type SessionController struct {
	service *Service
	requestLogger *log.Logger
}

func parseSessionRequestBody(body []byte) (*SessionRequest, error) {
	sessionRequest := &SessionRequest{}
	err := json.Unmarshal(body, sessionRequest)
	if err != nil {
		return nil, ERROR_BAD_REQUEST
	}

	return sessionRequest, nil
}

func parseSessionDeleteRequestBody(body []byte) (*SessionDeleteRequest, error) {
	request := &SessionDeleteRequest{}
	err := json.Unmarshal(body, request)
	if err != nil {
		return nil, ERROR_BAD_REQUEST
	}

	return request, nil
}


func (c *SessionController) postSession(body []byte, ip string) Response {
	request, err := parseSessionRequestBody(body)
	if err != nil {
		return responseForError(err)
	}

	auth := Auth{request.Username, request.Password, ip}
	sessionId, err := c.service.Login(auth)
	if err != nil {
		return responseForError(err)
	}

	return Response{201, SessionResponseBody{sessionId}}
}


func (c *SessionController) deleteSession(body []byte, ip string) Response {
	request, err := parseSessionDeleteRequestBody(body)
	if err != nil {
		return responseForError(err)
	}

	c.service.Logout(request.SessionId)

	return Response{204, SessionResponseBody{request.SessionId}}
}

func (c *SessionController) parseRequest(w http.ResponseWriter, r *http.Request) []byte {
	w.Header().Set("Content-Type", "application/text")

	// Read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		writeResponse(r, w, invalidRequestResponse, c.requestLogger)
		return nil
	}

	return body
}


func (c *SessionController) handle(w http.ResponseWriter, r *http.Request) {
	ip := ipFromRequest(r)

	body := c.parseRequest(w, r)

	var response Response


	switch r.Method {
	case "POST":
		response = c.postSession(body, ip)
	case "DELETE":
		response = c.deleteSession(body, ip)
	default:
		response = invalidRequestResponse
	}

	writeResponse(r, w, response, c.requestLogger)
}
