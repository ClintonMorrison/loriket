package main

import "log"

func logError(err error) {
	if err != nil {
		log.Printf("[ERROR] %s", err.Error())
	}
}

func checkUserNameFree(auth Auth) (*DocumentResponse) {
	exists, err := saltFileExists(auth)
	logError(err)

	if exists {
		return &DocumentResponse{401,"Username already taken", ""}
	}

	return nil
}

func checkDocumentExists(auth Auth) *DocumentResponse {
	exists, err := documentExists(auth)
	logError(err)

	if !exists {
		return &DocumentResponse{401,"Invalid user or credentials", ""}
	}

	return nil
}

func createUser(auth Auth) *DocumentResponse {
	_, err := writeSaltFile(auth)
	logError(err)

	if err != nil {
		return &DocumentResponse{500, "Error creating salt", ""}
	}

	return nil
}

func postDocument(auth Auth, document []byte) DocumentResponse {
	errResponse := checkUserNameFree(auth)
	if errResponse != nil {
		return *errResponse
	}

	errResponse = createUser(auth)
	if errResponse != nil {
		return *errResponse
	}

	err := writeDocument(document, auth)
	if err != nil {
		logError(err)
		return DocumentResponse{500, "Error writing document", ""}
	}

	return DocumentResponse{201, "", ""}
}

func putDocument(auth Auth, document []byte) DocumentResponse {
	errResponse := checkDocumentExists(auth)
	if errResponse != nil {
		return *errResponse
	}

	err := writeDocument(document, auth)
	if err != nil {
		logError(err)
		return DocumentResponse{500, "Error writing document", ""}
	}

	return DocumentResponse{202, "", ""}
}

func getDocument(auth Auth) DocumentResponse {
	errResponse := checkDocumentExists(auth)
	if errResponse != nil {
		return *errResponse
	}

	document, err := readDocument(auth)
	if err != nil {
		log.Printf("[ERROR] %s", err.Error())
		return DocumentResponse{500,"Error reading document", ""}
	}

	return DocumentResponse{200,"", string(document)}
}
