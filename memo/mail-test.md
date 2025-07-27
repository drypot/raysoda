# Mail Test

Mac 에서 메일 발송 테스트하는 경우.\
Mac 에는 postfix가 기본 설치되어 있다.\
자세한 Postfix 세팅은 리눅스 관련 메모 참고.

## postfix 실행

실행.

    $ sudo postfix start

종료.

    $ sudo postfix stop

설정 리로드.

    $ sudo postfix reload

## hosts

`hosts` 파일에 적당히 이름을 하나 만든다.

    127.0.0.1 mail.test

## Virtual Alias 설정

아래 virual alias 파일을 만든다.

    /etc/postfix/virtual-drypot
    
    @mail.test drypot

`main.cf` 에 항목을 추가한다.

    /etc/postfix/main.cf
    
    virtual_alias_maps = hash:/etc/postfix/virtual-drypot

설정을 적용한다.

    $ sudo postmap /etc/postfix/virtual-drypot
    $ sudo postfix reload

## 메일 발송 테스트

Postfix 시작.

    $ sudo postfix start

`mail` 명령으로.

    $ mail -s "mail test" drypot@mail.test

노드 스크립트로. 명령을 입력하면 도움말이 나온다.

    $ bin/send-test-mail
    $ bin/send-test-reset-mail

메일 확인.

    $ mail

Postfix 종료.

    $ sudo postfix stop
