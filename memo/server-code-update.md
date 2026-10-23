# Code Update

서버에 접속.

    $ ssh aws1
    $ cd /data/service/raysoda
    
서버 종료.

    $ bin/docker-stop-all

도커 이미지 다시 만들 것이면 일단 지운다.

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

