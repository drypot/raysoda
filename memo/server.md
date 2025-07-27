# Server

## Domain Name

Route53 에서 도메인을 구매한다.

Route53 에서 호스팅 존을 생성한다.

호스팅 존에 A 레코드를 추가해서 도메인 주소와 서버 IP 를 연결한다.

혹시, 외부 DNS 를 써야할 경우 digitalocean 이 괜찮았다.

## Install packages

현재 raysoda live 서버는 docker container 들을 좀 쓰고 있다.
nginx, mysql, redis,

node, imagemagick 등은 host os 에 바로 설치해서 쓰고 있다.
나중에 container 로 만들어야;

## Nginx / AWS Live

### 인증서

nginx 설정 파일들 클론.

    $ cd /data/nginx
    $ git clone https://github.com/drypot/nginx-conf-aws1
    $ cd nginx-conf-aws1

어플리케이션별 `bin/d-certbot-new-***.sh` 생성.

위 스크립트를 실행해서 인증서를 생성한다.

### nginx.conf

디렉토리 이동.

    $ cd sites

어플리케이션별 `***.conf` 를 생성한다.

사이트를 활성화하려면 `sites/enalbed` 폴더에 링크를 생성.

    $ ln -s ../abc.conf sites/enabled

필요한 웹사이트 public 디렉토리들을 생성한다.

nginx 설정을 리로딩한다.

    $ . bin/d-nginx-reload.sh

웹사이트 접근해 보고 정상적으로 Bad Gateway 오류 뜨는지 확인한다.

### Nginx / Mac 개발환경

<https://github.com/drypot/nginx-conf-mac>

nginx-conf-mac 프로젝트로 이동.

`/etc/hosts` 에 `***.test` 주소를 등록한다.

`sites/***.conf` 를 생성한다.

`sites/enalbed` 폴더로 링크를 생성한다.

    $ ln -s ../abc.conf sites/enabled

nginx 설정 테스트.

    $ nginx -t reload

nginx 설정 리로딩.

    $ nginx -s reload

## Redis

<https://github.com/drypot/redis-conf>

## MySQL

<https://github.com/drypot/mysql-conf-aws1>

서비스에 필요한 디비는 자동 생성된다.
node.js web app server 가 실행될 때 
config 에 정의된 이름을 가지고 디비와 테이블들을 자동생성한다.

## PM2 설치

[pm2.md](pm2.md) 참고

## Node 코드 설치

Node 코드 클론.

    $ git clone https://github.com/drypot/raysoda.git
    $ cd raysoda
    $ npm install

필요하면, config, config-live 파일을 추가한다.

실행.

    $ bin/raysoda

    또는 

    $ bin/raysoda-live

pm2 서비스로 등록.

    $ bin/pm2

    $ pm2 save

## Node 코드 업데이트

서버에 접속.

    $ ssh aws1
    
서버 종료.

    $ pm2 status
    $ pm2 stop all

코드 풀.

    $ cd /data/service/raysoda
    $ git pull

라이브러리 업데이트. 필요하면.

    $ npm install

CSS 빌드. 필요하면.

    $ bin/sass

클라이언트 JS 빌드. 필요하면.

    $ bin/rollup

config 업데이트. 필요하면.

    config-live/...

테스트 런.

    $ bin/raysoda

    ^C 로 중지.

서비스 기동.

    $ pm2 restart all
    $ pm2 status


## OS 업데이트

서비스 중지.

    $ pm2 stop all

디비 백업.

    $ cd /data/mysql/mysql-conf-aws1
    $ bin/d-shell.sh 
    $ mysqldump -u drypot -p raysoda > /backup/xxx.sql

    필요하면 sudo 넣는다.

    $ sudo mysqldump -u drypot -p raysoda > backup_xxx.sql

    다른 디비들도 다 백업한다.

Linux 업데이트.

    ...

전역 툴 업데이트.

    ...

node 재설치했다면 pm2 부팅 스크립트도 재설치.

    $ pm2 unstartup
    $ pm2 startup

코드 업데이트.

    ...

재부팅.

    $ reboot

## cron 설정

cron 으로 정기적으로 인증서를 업데이트할 수 있다.

[cron.md](cron.md) 참고.
