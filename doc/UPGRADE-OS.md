# OS 업데이트

## 서비스 중지

    $ pm2 stop all

## 디비 백업

    $ sudo mysqldump -u drypot -p raysoda > backup_xxx.sql

## Linux 업데이트

    ...

## 전역 툴 업데이트

    ...

node 재설치했다면 pm2 부팅 스크립트도 재설치.

    $ pm2 unstartup
    $ pm2 startup

## 코드 업데이트

    $ git pull
    $ npm install

## 설정 업데이트

    config/...

## 테스트 런

    $ bin/run

## 재부팅

    $ reboot

