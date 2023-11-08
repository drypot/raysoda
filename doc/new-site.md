# 새 사이트 오픈하는 절차

## Domain Name

Route53 에서 도메인을 구매한다.

Route53 에서 호스팅 존을 생성해서 세팅해도 될 것인데,
현재는 Lightsail 에서 DNS 까지 관리하고 있다.

호스팅 존에 A 레코드를 추가해서 도메인 주소와 서버 IP 를 연결한다.

혹시, 외부 DNS 를 써야할 경우 digitalocean 이 괜찮았다.

## nginx-conf-aws1

nginx-conf-aws1 프로젝트 열어서 nginx 세팅을 준비해야 한다.

로컬에서 스크립트 만들고 서버로 푸쉬하든지,
서버에서 만들어 다 작업하고 커밋, 푸쉬하든지,

bin/d-certbot-new-***.sh 생성.
위 스크립트를 실행해서 인증서를 생성한다.

sites/***.conf 를 생성한다.

sites/enalbed 폴더로 링크를 생성한다.

    $ ln -s ../abc.conf sites/enabled

필요한 웹사이트 public 디렉토리들을 생성한다.

nginx 설정을 리로딩한다.

    $ . bin/d-nginx-reload.sh

웹사이트 접근해 보고 정상적으로 Bad Gateway 오류 뜨는지 확인한다.

## nginx-conf-mac

nginx-conf-mac 프로젝트로 이동.

/etc/hosts 에 ***.test 주소를 등록한다.

sites/***.conf 를 생성한다.

sites/enalbed 폴더로 링크를 생성한다.

    $ ln -s ../abc.conf sites/enabled

nginx 설정 테스트.

    $ nginx -t reload

nginx 설정 리로딩.

    $ nginx -s reload

## raysoda

raysoda 플로젝트로 와서 실제 코드를 추가한다.

config, config-live 파일을 추가한다.

서버 코드 추가, 테스트는 dev-server.md 문서를 참고.

클라이언트 코드 추가, 테스트는 dev-client 문서를 참고.

추가될 디비 생성은 신경쓰지 않아도 된다.
서버 코드에서 config 에 정의된 이름을 가지고 디비와 테이블들이 자동 생성한다.



