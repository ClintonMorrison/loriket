package main

import (
	"os"
	"io/ioutil"
	"fmt"
)

const dataPath = "./data"

func createDataDirecty() error {
	err := os.Mkdir(dataPath, 0700)

	if os.IsExist(err) {
		return nil
	}

	if err != nil {
		return err
	}

	return nil
}

func pathForDocument(auth Auth) (string, error) {
	signature, error := auth.Signature()
	if error != nil {
		return "", error
	}

	return fmt.Sprintf("%s/%s.txt", dataPath, signature), nil
}

func pathForSalt(auth Auth) string {
	return fmt.Sprintf("%s/%s.salt.txt", dataPath, auth.email)
}

func fileExists(filename string) (bool, error) {
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
func saltFileExists(auth Auth) (bool, error) {
	filename := pathForSalt(auth)
	return fileExists(filename)
}


func writeSaltFile(auth Auth) ([]byte, error) {
	fileName := pathForSalt(auth)

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

func readSaltFile(auth Auth) ([]byte, error) {
	fileName := pathForSalt(auth)
	salt, err := ioutil.ReadFile(fileName)
	if err != nil {
		return salt, err
	}

	return salt, nil
}

//
// Document Files
//
func documentExists(auth Auth) (bool, error) {
	filename, err := pathForDocument(auth)
	if err != nil {
		return false, err
	}

	return fileExists(filename)
}

func writeDocument(data []byte, auth Auth) error {
	filename, err := pathForDocument(auth)
	if err != nil {
		return err
	}

	saltedPassword, err := auth.SaltedPassword()
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

func readDocument(auth Auth) ([]byte, error) {
	data := make([]byte, 0)
	filename, err := pathForDocument(auth)
	if err != nil {
		return data, err
	}

	data, err = ioutil.ReadFile(filename)
	if err != nil {
		return data, err
	}

	saltedPassword, err := auth.SaltedPassword()
	data, err = ioutil.ReadFile(filename)
	if err != nil {
		return data, err
	}

	decrypted := decrypt(data, []byte(saltedPassword))

	return decrypted, nil
}
