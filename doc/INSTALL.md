# Install

mariadb, redis, imagemagick, 등 필요.

## Nginx

Mac 개발환경용 Nginx 설정 예

    server {
      listen 8080;
      server_name raysoda.test;
      root /Users/drypot/projects/raysoda/raysoda/public;
    
      client_max_body_size 10m;
    
      location / {
        try_files $uri @app;
      }
    
      location @app {
        proxy_pass http://localhost:8050;
        proxy_set_header Host $http_host;
      }
    }
    
    server {
      listen 8080;
      server_name file.raysoda.test;
      root /Users/drypot/projects/raysoda/raysoda/upload/raysoda/public;
    }

## ImageMagick

libpng 별도 설치 필요(?)

    $ pacman -S imagemagick

## Clone Source

클론.

    $ git clone https://github.com/drypot/raysoda.git
    $ cd raysoda
    $ npm install

실행.

    $ node code/main/main.js -c config/raysoda-dev.json


## 서비스로 등록

    /etc/systemd/system/raysoda.service

    [Unit]
    Description=Rapixel
    Requires=nginx.service mariadb.service redis.service
    After=nginx.service mariadb.service redis.service

    [Service]
    User=drypot
    Restart=always
    RestartSec=15
    WorkingDirectory=/data/web/raysoda
    ExecStart=/usr/bin/node code/main/main.js -c config/raysoda-live.json
    Environment=NODE_ENV=production
    Environment=MAGICK_CONFIGURE_PATH=/data/im

    [Install]
    WantedBy=multi-user.target

설치

    $ sudo systemctl daemon-reload
    $ sudo systemctl status raysoda
    $ sudo systemctl enable raysoda
    $ sudo systemctl start raysoda

* Group 을 지정하지 않으면 유저 기본 그룹을 사용.
* StandardOutput 을 지정하지 않으면 journal 을 사용.
* syslog 를 지정하면 syslog 에도 쌓이고 journal 에도 쌓인다. journal 에는 기본적으로 쌓임.
* [Install] 파트는 enable, disable 명령에서 사용한다.


## ImageImagick

'convert -list configure' 명령으로 CONFIGURE_PATH 확인한 후 policy.xml 에 다음을 추가한다.

    <policymap>
      <policy domain="coder" rights="none" pattern="URL" />
      <policy domain="coder" rights="none" pattern="EPHEMERAL" />
      <policy domain="coder" rights="none" pattern="HTTPS" />
      <policy domain="coder" rights="none" pattern="MVG" />
      <policy domain="coder" rights="none" pattern="MSL" />
      <policy domain="coder" rights="none" pattern="TEXT" />
      <policy domain="coder" rights="none" pattern="SHOW" />
      <policy domain="coder" rights="none" pattern="WIN" />
      <policy domain="coder" rights="none" pattern="PLT" />
    </policymap>


## 관리자 계정

웹 페이지에서는 관리자 설정을 할 수 없다. 서버 콘솔에서 아래 코드를 실행한다.

    $ node code/user-script/set-admin.js -c config/raysoda-live.json 'admin@gmail.com'

