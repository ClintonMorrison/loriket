package storage

import "os"

func FileExists(filename string) (bool, error) {
	stats, err := os.Stat(filename)

	if os.IsNotExist(err) {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return !stats.IsDir(), nil
}
