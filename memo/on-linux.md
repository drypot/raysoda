# Install Linux

AWS 서비스 환경 설정에 관한 메모들.

## Domain Name

Route53 에서 도메인을 구매한다.

Route53 에서 호스팅 존을 생성한다.

호스팅 존에 A 레코드를 추가해서 도메인 주소와 서버 IP 를 연결한다.

혹시, 외부 DNS 를 써야할 경우 digitalocean 이 괜찮았다.

## Linux

리눅스 설치 메모 참고해서 쭉 설치.
사용자, 그룹 생성.

## Docker Install

https://docs.docker.com
https://docs.docker.com/engine/install/ubuntu/

## Nginx

https://github.com/drypot/nginx-conf-aws1

서버들 실행은 각 리포의 bin/d-***-run 을 참고.

## MySQL

https://github.com/drypot/mysql-conf-aws1

## Redis

https://github.com/drypot/redis-conf

## RaySoda 설치

RaySoda 코드 클론.

    $ git clone git@github.com:drypot/raysoda.git
    $ cd raysoda
    $ npm install

필요하면, config, config-live 파일을 추가한다.

실행되는지 확인.

    $ bin/raysoda

    또는 

    $ bin/raysoda-live

    ^C

도커 런타임 이미지를 빌드.

    $ bin/docker-build

RaySoda 컨테이너 실행.

    $ bin/docker-run ...

## MySQL DB

서비스에 필요한 디비는 자동 생성된다.
node.js web app server 가 실행될 때 
config 에 정의된 이름을 가지고 디비와 테이블들을 자동생성한다.

## 코드 업데이트

서버에 접속.

    $ ssh aws1
    $ cd /data/service/raysoda
    
서버 종료.

    $ bin/docker-stop-all

런타임 이미지 다시 만들 것이면.

    $ bin/docker-rm-all

코드 풀.

    $ git pull

호스트 라이브러리 업데이트. 필요하면.

    $ npm install

도커 런타임 이미지 빌드 필요하면.

    $ bin/docker-build

CSS 빌드. 필요하면.

    $ bin/sass

클라이언트 JS 빌드 필요하면.

    $ bin/esbuild

config 업데이트. 필요하면.

    config-live/...

테스트 런.

    $ bin/raysoda

    ^C

서비스 기동.

    $ bin/docker-restart ...

런타임 이미지 다시 만들었으면

    $ bin/docker-run-all

상태확인.

    $ docker ps

## OS 업데이트

서비스 중지.

디비 백업.

Linux 업데이트.

코드 업데이트. 위에 코드 업데이트 참고.

재부팅.

    $ reboot
