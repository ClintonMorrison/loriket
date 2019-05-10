package errors

type Type string

const (
	INVALID_USER_NAME Type = "INVALID_USER_NAME"
	SERVER_ERROR Type = "SERVER_ERROR"
	INVALID_CREDENTIALS Type = "INVALID_CREDENTIALS"
)

func (t Type) Error() string {
	return string(t)
}
