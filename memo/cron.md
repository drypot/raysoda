# cron

cron 으로 정기적으로 인증서를 업데이트할 수 있다.

## cron 설치 확인

크론이 설치되어 있는지 확인한다.

    $ sudo apt list -a cron

서비스 상태를 확인한다.

    $ sudo systemctl status cron

## crontab command

contab 내용을 볼 수 있다.

    $ crontab -l           <-- 현재 유저용
    $ sudo crontab -l      <-- root 유저용

contab 파일을 수정할 수 있다.

    $ crontab -e          <-- 현재 유저용
    $ sudo crontab -e     <-- root 유저용
    
현재 raysoda 서버의 crontab 은 drypot 유저권한으로 돌고 있다. 예.

    0 5 * * 2 /data/nginx/nginx-conf-aws1/bin/d-certbot-renew-cron.sh > /data/cron/certbot.log 2>&1

    30 5 * * 2 /data/nginx/nginx-conf-aws1/bin/d-nginx-reload-cron.sh > /data/cron/nginx.log 2>&1

## crontab file 예

예.

    30 17 * * 2 curl http://www.google.com
    
    30 : 30분. 
    17 : 오후 5시.
    *  : 
    *  : 
    2  : 매주 화요일.

각 필드의 값 범위.

    minute hour day_of_month month day_of_week  command_to_run
    0-59   0-23 1-31         1-12  0-6/SUN-SAT  command_to_run

    * : all.
    0,30 * * * * command : 매 시 0분, 30분.
    */15 * * * * : 15분마다.

메일 MTA 가 설치되어 있지 않으면 실행결과는 버려진다.

실행 오류를 로깅하려면 쉘 리다이렉션을 사용한다.

    0 5 * * 2 some.sh > /data/nginx/cron/certbot.log 2>&1

로그를 누적하려면 `>>` 을 사용한다.

    0 5 * * 2 some.sh >> /data/nginx/cron/certbot.log 2>&1

## cron log 확인

    $ cd /var/log
    $ sudo grep CRON syslog        # 오늘 것
    $ sudo grep CRON syslog.1      # 어제 것
    $ sudo zgrep CRON syslog.2.gz
    $ sudo zgrep CRON syslog.3.gz
    $ sudo zgrep CRON syslog.4.gz
    .
    .
    .
