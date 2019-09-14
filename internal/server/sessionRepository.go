package server

import "time"

type session struct {
	auth Auth
	expiresAt time.Time
}

type SessionRepository struct {
	sessions map[string]session
}

func NewSessionStore() *SessionRepository {
	return &SessionRepository{sessions: make(map[string]session, 0)}
}

func (s *SessionRepository) Grant(auth Auth) (string, error) {
	salt, err := makeSalt()
	if err != nil {
		return "", err
	}

	sessionId := string(salt)
	expiresAt := time.Now().Add(time.Hour * 24)

	s.sessions[sessionId] = session{auth: auth, expiresAt: expiresAt}

	return sessionId, nil
}

func (s *SessionRepository) Revoke(sessionId string) {
	delete(s.sessions, sessionId)
}

func (s *SessionRepository) Get(sessionId string) *session {
	session := s.sessions[sessionId]

	if session.auth.username == "" || session.expiresAt.Before(time.Now()) {
		s.Revoke(sessionId)
		return nil
	}

	return &session
}
