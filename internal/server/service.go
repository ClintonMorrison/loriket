package server

import (
	"log"
)

type Service struct {
	repo *Repository
	lockoutTable *LockoutTable
	sessionRepository *SessionRepository
	errorLogger *log.Logger
}

func (s *Service) UpdateDocument(auth Auth, document string) error {
	salt, err := s.checkAuth(auth)
	if err != nil {
		return err
	}

	err = s.repo.writeDocument([]byte(document), auth, salt)
	if err != nil {
		s.logError(err)
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
		s.logError(err)
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
		s.logError(err)
		return ERROR_SERVER_ERROR
	}

	err = s.repo.deleteSaltFile(auth)
	if err != nil {
		s.logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}

func (s *Service) UpdateDocumentAndPassword(auth Auth, newPassword string, document string) error {
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
		s.logError(err)
		return ERROR_SERVER_ERROR
	}

	err = s.repo.writeDocument([]byte(document),  newAuth, salt)
	if err != nil {
		s.logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}

func (s *Service) CreateDocument(auth Auth, document string) error {
	err := s.checkUserNameFree(auth)
	if err != nil {
		return err
	}

	salt, err := s.createSalt(auth)
	if err != nil {
		return err
	}

	err = s.repo.writeDocument([]byte(document), auth, salt)
	if err != nil {
		s.logError(err)
		return ERROR_SERVER_ERROR
	}

	return nil
}

func (s *Service) Login(auth Auth) (string, error) {

	_, err := s.checkAuth(auth)

	if err != nil {
		return "", err
	}

	sessionToken, err := s.sessionRepository.Grant(auth)
	if err != nil {
		return "", ERROR_SERVER_ERROR
	}

	return sessionToken, nil
}

func (s *Service) Logout(sessionId string) {
	s.sessionRepository.Revoke(sessionId)
}

func (s *Service) AuthForSession(sessionId string) *Auth {
	session := s.sessionRepository.Get(sessionId)
	if session == nil {
		return nil
	}

	return &session.auth
}

func (s *Service) checkUserNameFree(auth Auth) error {
	allowed := s.lockoutTable.shouldAllow(auth.ip, "")
	if !allowed {
		return ERROR_TOO_MANY_REQUESTS
	}

	exists, err := s.repo.saltFileExists(auth)
	s.logError(err)

	if exists {
		s.lockoutTable.logFailure(auth.ip, "")
		return ERROR_INVALID_USER_NAME
	}

	return nil
}


func (s *Service) saltForUser(auth Auth) ([]byte, error) {
	salt, err := s.repo.readSaltFile(auth)

	if err != nil {
		s.logError(err)
		return nil, ERROR_INVALID_CREDENTIALS
	}

	return salt, nil
}

func (s *Service) checkDocumentExists(auth Auth, salt []byte) error {
	exists, err := s.repo.documentExists(auth, salt)
	s.logError(err)

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
	s.logError(err)

	if err != nil {
		s.logError(err)
		return nil, ERROR_SERVER_ERROR
	}

	return salt, nil
}

func (s *Service) logError(err error) {
	if err != nil {
		s.errorLogger.Printf("%s\n", err.Error())
	}
}