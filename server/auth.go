package main

import (
	"net/http"
	"errors"
)

type Auth struct {
	email string
	password string
}

func (a Auth) SaltedPassword() (string, error) {
	salt, err := readSaltFile(a)
	if err != nil {
		return "", err
	}

	data := make([]byte, 0)
	data = append(data, []byte(a.password)...)
	data = append(data, salt...)


	return hash(data), nil
}

func (a Auth) Signature() (string, error) {
	data := make([]byte, 0)

	saltedPassword, err := a.SaltedPassword()
	if err != nil {
		return "", err
	}

	data = append(data, []byte(a.email)...)
	data = append(data, []byte(saltedPassword)...)

	return hash(data), nil
}

func AuthFromRequest(r *http.Request) (Auth, error) {
	email, password, ok := r.BasicAuth()
	if !ok {
		return Auth{}, errors.New("invalid authorization header")
	}

	return Auth{email, password}, nil
}