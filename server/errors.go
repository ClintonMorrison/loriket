package main

type ErrorType string

const (
	ERROR_INVALID_USER_NAME   ErrorType = "INVALID_USER_NAME"
	ERROR_SERVER_ERROR        ErrorType = "SERVER_ERROR"
	ERROR_INVALID_CREDENTIALS ErrorType = "INVALID_CREDENTIALS"
	ERROR_TOO_MANY_REQUESTS   ErrorType = "TOO_MANY_REQUESTS"
)

func (t ErrorType) Error() string {
	return string(t)
}
