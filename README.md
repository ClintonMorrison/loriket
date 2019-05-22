# Lorikeet
This is a password manager web app, created with Golang and React. It uses client-side and server-side AES encryption.


## Setup
### Running the Go server

The server runs on port 8080.

### Running webpack
For frontend development:
```
npm run start
```

The webpack dev server runs on port 3000.

### Building for production
```
# Server
cd ./lorikeet/server
go build
./server

# Frontend
cd ./lorikeet/frontend
npm run build
```


## Architecture

User passwords are saved as encrypted JSON documents on the server. 
