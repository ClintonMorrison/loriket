package main

import (
	"os"
	"io/ioutil"
	"fmt"
)


type Repository struct {
	dataPath string
}

func (r *Repository) createDataDirectory() {
	err := os.Mkdir(r.dataPath, 0700)

	if err == nil || os.IsExist(err) {
		return
	}

	panic(err)
}

func (r *Repository)  pathForDocument(auth Auth, salt []byte) (string, error) {
	signature, error := auth.Signature(salt)
	if error != nil {
		return "", error
	}

	return fmt.Sprintf("%s/%s.txt", r.dataPath, signature), nil
}

func (r *Repository)  pathForSalt(auth Auth) string {
	return fmt.Sprintf("%s/%s.salt.txt", r.dataPath, auth.email)
}

func (r *Repository)  fileExists(filename string) (bool, error) {
	stats, err := os.Stat(filename)

	if os.IsNotExist(err) {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return !stats.IsDir(), nil
}

//
// Salt Files
//
func (r *Repository)  saltFileExists(auth Auth) (bool, error) {
	filename := r.pathForSalt(auth)
	return r.fileExists(filename)
}


func (r *Repository)  writeSaltFile(auth Auth) ([]byte, error) {
	fileName := r.pathForSalt(auth)

	salt, err := makeSalt()
	if err != nil {
		return salt, err
	}

	err = ioutil.WriteFile(fileName, salt, 0644)
	if err != nil {
		return salt, err
	}

	return salt, nil
}

func (r *Repository)  readSaltFile(auth Auth) ([]byte, error) {
	fileName := r.pathForSalt(auth)
	salt, err := ioutil.ReadFile(fileName)
	if err != nil {
		return salt, err
	}

	return salt, nil
}

//
// Document Files
//
func (r *Repository)  documentExists(auth Auth, salt []byte) (bool, error) {
	filename, err := r.pathForDocument(auth, salt)
	if err != nil {
		return false, err
	}

	return r.fileExists(filename)
}

func (r *Repository)  writeDocument(data []byte, auth Auth, salt []byte) error {
	filename, err := r.pathForDocument(auth, salt)
	if err != nil {
		return err
	}

	saltedPassword, err := auth.SaltedPassword(salt)
	if err != nil {
		return err
	}

	encrypted, err := encrypt(data, []byte(saltedPassword))
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(filename, encrypted, 0644)
	if err != nil {
		return nil
	}

	return nil
}

func (r *Repository)  readDocument(auth Auth, salt []byte) ([]byte, error) {
	data := make([]byte, 0)
	filename, err := r.pathForDocument(auth, salt)
	if err != nil {
		return data, err
	}

	data, err = ioutil.ReadFile(filename)
	if err != nil {
		return data, err
	}

	saltedPassword, err := auth.SaltedPassword(salt)
	data, err = ioutil.ReadFile(filename)
	if err != nil {
		return data, err
	}

	decrypted := decrypt(data, []byte(saltedPassword))

	return decrypted, nil
}
