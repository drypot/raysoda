FROM node:24.5.0-bookworm-slim

ARG UID=1000
ARG GID=1000

# set -eux : 에러시 종료, 미정의 변수 사용시 종료, 실행 명령 출력

RUN set -eux; \
    groupadd --gid $GID apprunner; \
    useradd --uid $UID --gid $GID -m --shell /bin/bash apprunner

# imagemagick 설치할 때 --no-install-recommends 옵션 주면 svg 파일을 처리하지 못한다.

#RUN set -eux; \
#    apt-get update; \
#    apt-get install --yes imagemagick; \
#    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json .
RUN --mount=type=cache,target=/root/.npm \
    npm install --omit=dev

USER apprunner

CMD [ "bash" ]
