# RaySoda Disk Full

## 2024-12-19

레이소다 서버에 로그인이 안 된다는 메일이 도착.

확인해 보니 루트 디스크가 꽉차있다;
어떻게 하지 하다가
nginx, mysql, redis 도커 컨테이너를 모두 중지시켰다 재실행 시켰다.

    ./d-rm.sh
    ./d-run.sh
    
일단 정상이 되었다.
추후 어디가 문제였는지 확인해 봐야겠다.

## 2025-07-27

GPT 와 함께 문제의 원인을 찾아보기로

실행중인 도커 컨테이너들을 리스트:

    $ docker ps
    CONTAINER ID   IMAGE                                   
    4d9492678bab   redis:6.2.0                             
    6b2a056a4424   groonga/mroonga:mysql8023_mroonga1100   
    bde1bc92bda2   nginx:1.19.7                            

이 목록에서 container id 를 사용할 것이다.

각 컨테이너 shell 로 들어가 본다.

    $ docker exec -it <container_id> bash

컨테이너 shell 에서 디스크 사용량을 확인한다.

    $ du -sh /*

    -s : summary. 하위 디렉토리별 상세 내역 없이 요약만 출력
    -h : human-readable. 바이트 대신 K, M, G 단위로 보기 쉽게 표시

문제를 확인하고 수정해본다.

근데 딱히 이상한 점을 발견하지 못함;

다음 명령 결과 확인해 보라고 하는데

    $ sudo du -sh /var/lib/docker/overlay2/*
        
디렉터리가 없다고 나온다.
AI 들이 잘못된 정보 말하는 건지 4년도 넘은 나의 Ubuntu 와 Docker 문제인지 알 수가 없다.

나중에 OS 업데이트하고 나서 다시 확인해 봐야지;

## 2025-07-29

redis 컨테이너 죽였다 살려봤는데 df 결과에 변화가 없다.
다른 것도 해봐야지;

nginx 컨테이너가 범인이었다.
merged 가 74G 먹고 있다가 13G 로 떨어졌다;

왜 이러는지 나중에 다시 살펴봐야;

## 2025-08-09

콘솔 로그 보기를 nginx 에 시전했더니 엑세스 로그가 가득 쌓이고 있다;
아, 이래서 디스크 여유공간이 계속 줄어들었구나;

이것 저것 확인하고 억세스로그를 off 시켰다.

서버 여유 공간이 줄어드는 이유를 해결했다;
