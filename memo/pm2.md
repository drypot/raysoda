
# PM2

## Install PM2

PM2 설치.

    $ npm install pm2 -g

PM2 업그레이드.

    $ npm install pm2@latest -g

## Run My Code

내 코드 실행.

    $ pm2 start app.js

    $ pm2 start app2.js --name myapi -- --port 1520

## List

프로세스 확인.

    $ pm2 list

## Managing

프로세스 관리.

    $ pm2 stop app_name
    $ pm2 restart app_name
    $ pm2 reload app_name
    $ pm2 delete app_name
    
    $ pm2 log app_name
    
전체 프로세스 관리.

    $ pm2 stop all
    $ pm2 restart all
    $ pm2 reload all
    $ pm2 del all

## Start Up Script

현재 돌아가는 앱들을 부팅시 재시작할 수 있다.

### install start up script

systemd 스타트업 스크립트를 얻는다.

    $ pm2 startup

화면에 설명대로 덤프된 코드를 실행하면 된다.

Node 를 업데이트하면 pm2 스타트업 스크립트도 업데이트해야 한다.

    $ pm2 unstartup
    $ pm2 startup

### save

현재 작동중인 프로세스 목록을 저장한다.

    $ pm2 save

아래 위치에 저장된다.

    $PM2_HOME/.pm2/dump.pm2

### Resurrect

save 된 프로세스들을 수동으로 재기동할 수 있다.

    $ pm2 resurrect

### uninstall

systemd 세팅을 언인스톨.

    $ pm2 unstartup systemd

### systemd 확인

스타트업 스크립트가 잘 세팅되었는지 확인할 수 있다.

    $ systemctl list-units
    
pm2-drypot.service가 있어야 한다.

로그 확인.

    $ journalctl -u pm2-drypot

설정 확인.

    $ systemctl cat pm2-drypot
    