# Docker

## RaySoda Docker Scripts

`bin/docker-*` 코드들 참고.

## Nginx, MySQL, Redis Docker Scripts

각자 리포 `bin` 폴더에 따로 있다.

https://github.com/drypot/nginx-conf-aws1
https://github.com/drypot/mysql-conf-aws1
https://github.com/drypot/redis-conf

## bin

써야할 도커 스크립트들은 여기저기 리포의 bin 에 다 만들어 두었으니까,
각 bin 디렉토리의 docker 스크립트들을 확인하자.
아래는 참고로만.

## Basics

도커 버전 확인.

    $ docker version

설치된 이미지들.

    $ docker images

동작중인 컨테이너 확인.

    $ docker ps

이미지 다운로드.

    $ docker pull nginx:latest

새 컨테이너 생성, 실행.

    $ docker run --name test -d -p 8080:80 nginx:latest

    --name test  : 컨테이너 이름
    -d           : detached
    -p 8080:80   : map host 8080 port -> container 80, publish,
    nginx:latest : 사용할 이미지

컨테이너 안의 shell 에 접속.

    $ docker exec -it test bash

    -it : 컨테이너와 stdio 를 연결할 때 항상 주는 옵션
    test : 컨테이너 이름
    bash : 컨테이너 안에서 실행할 명령

    # exit
    
컨테이너 실행 중지.

    $ docker stop test

컨테이터 삭제.

    $ docker rm test


### 이미지 빌드 예

Dockerfile 을 준비.

    $ cat Dockerfile

    FROM alpine
    LABEL maintainer="nigelpoulton@hotmail.com"
    RUN apk add --update nodejs npm curl
    COPY . /src
    WORKDIR /src
    RUN  npm install
    EXPOSE 8080
    ENTRYPOINT ["node", "./app.js"]

이미지를 빌드.

    $ docker build -t test:latest .

    -t     : --tag
    test   : 이미지 이름, Repo,
    latest : 이미지 태그
    .      : 현재 디렉토리를 기준

컨테이너 생성, 실행.

    $ docker run -d \
    --name web1 \
    --publish 8080:8080 \
    test:latest

컨테이너 중지.

    $ docker stop web1

컨테이터 삭제.

    $ docker rm web1
