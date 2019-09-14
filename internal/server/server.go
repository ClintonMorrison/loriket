package server

import (
	"net/http"
	"fmt"
	"github.com/ClintonMorrison/lorikeet/internal/storage"
)

const documentApiPath = "/api/documents"
const sessionApiPath = "/api/sessions"

func Run(
	dataPath string,
	address string,
	logPath string,
	requestLogFilename string,
	errorLogFilename string) {

	storage.CreateDirectory(logPath)

	// Request logger
	requestLogger, err := createLogger(requestLogFilename, "[REQUEST] ")
	if err != nil {
		panic(err)
	}

	// Error logger
	errorLogger, err := createLogger(errorLogFilename, "[ERROR] ")
	if err != nil {
		panic(err)
	}

	repository := &Repository{dataPath}
	lockoutTable := NewLockoutTable()
	sessionStore := NewSessionStore()
	service := &Service{repository, lockoutTable, sessionStore, errorLogger}
	documentController := DocumentController{service, requestLogger}
	sessionController := SessionController{service, requestLogger}

	repository.createDataDirectory()

	http.HandleFunc(documentApiPath, documentController.handle)
	http.HandleFunc(sessionApiPath, sessionController.handle)
	fmt.Printf("Listening on http://localhost%s\n", address)
	err = http.ListenAndServe(address, nil)
	if err != nil {
		panic(err)
	}
}

