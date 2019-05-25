package main

import (
	"log"
)

type Service struct {
	repo *Repository
	lockoutTable *LockoutTable
}

func (s *Service) checkUserNameFree(auth Auth) error {
	exists, err := s.repo.saltFileExists(auth)
	logError(err)

	if exists {
		return ERROR_INVALID_USER_NAME
	}

	return nil
}

func (s *Service) saltForUser(auth Auth) ([]byte, error) {
	salt, err := s.repo.readSaltFile(auth)

	if err != nil {
		logError(err)
		return nil, ERROR_INVALID_CREDENTIALS
	}

	return salt, nil
}

func (s *Service) checkDocumentExists(auth Auth, salt []byte) error {
	exists, err := s.repo.documentExists(auth, salt)
	logError(err)

	if !exists {
		return ERROR_INVALID_CREDENTIALS
	}

	return nil
}

func (s *Service) checkAuth(auth Auth) ([]byte, error) {
	allowed := s.lockoutTable.shouldAllow(auth.ip, auth.username)
	if !allowed {
		return nil, ERROR_TOO_MANY_REQUESTS
	}

	salt, err := s.saltForUser(auth)
	if err != nil {
		s.lockoutTable.logFailure(auth.ip, auth.username)
		return nil, err
	}

	err = s.checkDocumentExists(auth, salt)
	if err != nil {
		s.lockoutTable.logFailure(auth.ip, auth.username)
		return nil, err
	}

	return salt, nil
}

func (s *Service) createSalt(auth Auth) ([]byte, error) {
	salt, err := s.repo.writeSaltFile(auth)
	logError(err)

	if err != nil {
		logError(err)
		return nil, ERROR_SERVER_ERROR
	}

	return salt, nil
}

func (s *Service) CreateDocument(auth Auth, document []byte) error {
	err := s.checkUserNameFree(auth)
	if err != nil {
		return err
	}

	salt, err := s.createSalt(auth)
	if err != nil {
		return err
	}

	err = s.repo.writeDocument(document, auth, salt)
	if err != nil {
		logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}

func (s *Service) UpdateDocument(auth Auth, document []byte) error {
	salt, err := s.checkAuth(auth)
	if err != nil {
		return err
	}

	err = s.repo.writeDocument(document, auth, salt)
	if err != nil {
		logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}

func (s *Service) GetDocument(auth Auth) ([]byte, error) {
	salt, err := s.checkAuth(auth)
	if err != nil {
		return nil, err
	}

	document, err := s.repo.readDocument(auth, salt)
	if err != nil {
		logError(err)
		return nil, ERROR_SERVER_ERROR
	}

	return document, nil
}

func (s *Service) DeleteDocument(auth Auth) (error) {
	salt, err := s.checkAuth(auth)
	if err != nil {
		return err
	}

	err = s.repo.deleteDocument(auth, salt)
	if err != nil {
		logError(err)
		return ERROR_SERVER_ERROR
	}

	err = s.repo.deleteSaltFile(auth)
	if err != nil {
		logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}

func (s *Service) UpdatePassword(auth Auth, newPassword []byte, document []byte) error {
	salt, err := s.saltForUser(auth)
	if err != nil {
		return err
	}

	err = s.checkDocumentExists(auth, salt)
	if err != nil {
		return err
	}

	newAuth := Auth{auth.username, string(newPassword), auth.ip}
	err = s.repo.moveDocument(auth, salt, newAuth)
	if err != nil {
		logError(err)
		return ERROR_SERVER_ERROR
	}

	err = s.repo.writeDocument(document,  newAuth, salt)
	if err != nil {
		logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}


func logError(err error) {
	if err != nil {
		log.Printf("[ERROR] %s", err.Error())
	}
}