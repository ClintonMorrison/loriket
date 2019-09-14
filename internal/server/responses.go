package server

import (
	"encoding/json"
	"log"
	"net/http"
)

type Response struct {
	Code int
	Body interface{}
}

type ErrorBody struct {
	Error string `json:"error,omitempty"`
}


var invalidRequestResponse = Response{400,ErrorBody{"Invalid request."}}
var usernameTakenResponse = Response{401,ErrorBody{"Username already taken."}}
var invalidCredentialsResponse = Response{401,ErrorBody{"Invalid user or credentials."}}
var tooManyRequestsResponse = Response{429,ErrorBody{"Too many failed attempts. Try again in a few hours."}}
var internalServerError = Response{500, ErrorBody{"Server error. Please try again later."}}

var fallbackErrorJSON, _ = json.Marshal(internalServerError)

func responseForError(err error) Response {
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

func logRequest(r *http.Request, response Response, logger *log.Logger) {
	ip := r.Header.Get("X-Forwarded-For")
	result := "OK"


	errorBody, isErrorResponse := response.Body.(ErrorBody)
	if isErrorResponse {
		result = errorBody.Error
	}

	logger.Printf(
		"%s %s | %d [%s] | %s\n",
		r.Method, r.RequestURI,
		response.Code, result,
		ip)
}

func writeResponse(r *http.Request, w http.ResponseWriter, response Response, logger *log.Logger) {
	logRequest(r, response, logger)
	w.WriteHeader(response.Code)

	jsonResponse, err := json.Marshal(response.Body)

	if err != nil {
		w.WriteHeader(500)
		_, _ = w.Write(fallbackErrorJSON)
		return
	}

	_, _ = w.Write(jsonResponse)
}
