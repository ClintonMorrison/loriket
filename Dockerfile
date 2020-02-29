FROM ubuntu 

RUN \
  apt-get update && \
  apt-get install -y golang-go && \
  apt-get install -y nginx

ENV GOPATH /opt/go

COPY ./nginx.conf /etc/nginx

COPY ./ui/build /opt/go/src/github.com/ClintonMorrison/lorikeet/ui/build
COPY ./cmd /opt/go/src/github.com/ClintonMorrison/lorikeet/cmd
COPY ./internal /opt/go/src/github.com/ClintonMorrison/lorikeet/internal
COPY ./backup_and_run.sh /opt/go/src/github.com/ClintonMorrison/lorikeet/backup_and_run.sh

WORKDIR /opt/go/src/github.com/ClintonMorrison/lorikeet
RUN go build -o server cmd/server/main.go
RUN go build -o doBackup cmd/backup/main.go
RUN go build -o doRestore cmd/restore/main.go

CMD ["sh", "./start.sh"]
