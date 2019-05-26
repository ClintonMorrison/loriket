package main

type TypedError string

const (
	ERROR_BAD_REQUEST         TypedError = "BAD_REQUEST"
	ERROR_INVALID_USER_NAME   TypedError = "INVALID_USER_NAME"
	ERROR_SERVER_ERROR        TypedError = "SERVER_ERROR"
	ERROR_INVALID_CREDENTIALS TypedError = "INVALID_CREDENTIALS"
	ERROR_TOO_MANY_REQUESTS   TypedError = "TOO_MANY_REQUESTS"
)

func (t TypedError) Error() string {
	return string(t)
}
