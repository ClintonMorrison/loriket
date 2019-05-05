package main

type ErrorResponse struct {
	Error string `json:"error"`
}

type DocumentResponse struct {
	Code int `json:"-"`
	Error string `json:"error,omitempty"`
	Document string `json:"document,omitempty"`
}
