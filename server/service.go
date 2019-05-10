package main

import (
	"log"
	"github.com/loriket/server/errors"
)

type Service struct {
	repo *Repository
}

func (s *Service) checkUserNameFree(auth Auth) error {
	exists, err := s.repo.saltFileExists(auth)
	logError(err)

	if exists {
		return errors.INVALID_USER_NAME
	}

	return nil
}

func (s *Service) saltForUser(auth Auth) ([]byte, error) {
	salt, err := s.repo.readSaltFile(auth)

	if err != nil {
		logError(err)
		return nil, errors.INVALID_CREDENTIALS
	}

	return salt, nil
}

func (s *Service) checkDocumentExists(auth Auth, salt []byte) error {
	exists, err := s.repo.documentExists(auth, salt)
	logError(err)

	if !exists {
		return errors.INVALID_CREDENTIALS
	}

	return nil
}

func (s *Service) createSalt(auth Auth) ([]byte, error) {
	salt, err := s.repo.writeSaltFile(auth)
	logError(err)

	if err != nil {
		logError(err)
		return nil, errors.SERVER_ERROR
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
		return errors.SERVER_ERROR
	}

	return nil
}

func (s *Service) UpdateDocument(auth Auth, document []byte) error {
	salt, err := s.saltForUser(auth)
	if err != nil {
		return err
	}

	err = s.checkDocumentExists(auth, salt)
	if err != nil {
		return err
	}

	err = s.repo.writeDocument(document, auth, salt)
	if err != nil {
		logError(err)
		return errors.SERVER_ERROR
	}

	return nil
}

func (s *Service) GetDocument(auth Auth) ([]byte, error) {
	salt, err := s.saltForUser(auth)
	if err != nil {
		return nil, err
	}

	err = s.checkDocumentExists(auth, salt)
	if err != nil {
		return nil, err
	}

	document, err := s.repo.readDocument(auth, salt)
	if err != nil {
		logError(err)
		return nil, errors.SERVER_ERROR
	}

	return document, nil
}

func logError(err error) {
	if err != nil {
		log.Printf("[ERROR] %s", err.Error())
	}
}