# Install

mysql, redis, imagemagick 등 설치.

## Nginx

Mac 개발환경용 Nginx 설정 예\
<https://github.com/drypot/nginx-conf-mac>

AWS 라이브 Nginx 설정 예\
<https://github.com/drypot/nginx-conf-aws1>

## 코드 설치, 실행

클론.

    $ git clone https://github.com/drypot/raysoda.git
    $ cd raysoda
    $ npm install

실행.

    $ bin/app

pm2 서비스로 등록.

    $ bin/pm2

    $ pm2 save

