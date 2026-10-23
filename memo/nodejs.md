# Node.js

## Server Setup

Server 에서 사용될 Node.js 버전은 Dockerfile 에서 결정된다.
Node.js 를 수작업 설치할 필요는 없을 듯.

## Dev Node.js Setup

nvm 으로 설치한다.
`nodejs-nvm.md` 별도 파일 참고.

## Upgrade packages to lastest

사용하는 패키지들의 신규 버전들을 확인.

    npm outdated

외부도구 없이 최신 버전으로 업데이트하려면 하나하나 다시 설치해야 한다.
package.json 파일도 업데이트된다.

    npm install express@latest
    ...
    npm install typescript@latest --save-dev
    ...

아니면 `package.json` 파일을 수작업으로 수정한다음,

    npm install
