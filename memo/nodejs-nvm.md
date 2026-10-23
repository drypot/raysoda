# nvm

https://github.com/nvm-sh/nvm

https://itsromiljain.medium.com/the-best-way-to-install-node-js-npm-and-yarn-on-mac-osx-4d8a8544987a

## 개념

쉘 단위로 사용할 node 버전을 바꿀 수 있다.

## Install NVM

https://github.com/nvm-sh/nvm

## Upgrade NVM

업그레이드 스크립트가 따로 있지 않다.
설치 스크립트를 다시 실행한다.

## Inatall Node

nvm으로 노드를 설치하면 아래 디렉토리 아래에 들어간다.
`npm install -g`로 설치하는 모듈들도 node 버전별로 여기에 들어간다.

    ~/.nvm/

최신 버전 인스톨.

    $ nvm install node

LTS 최신 버전 인스톨.

    $ nvm install 'lts/*'

특정 버전 인스톨.

    $ nvm install 6.14.4

새 버전을 설치하면 default 알리아스가 새 버전으로 변경된다.

현재 노드 버전 확인.

    $ node -v

## List Node Versions

설치된 노드 버전들을 볼 수 있다.

    $ nvm list

노드 전체 버전 목록을 볼 수 있다.

    $ nvm ls-remote

lts 버전만 볼 수 있다.

    $ nvm ls-remote --lts

알리아스를 볼 수 있다.

    $ nvm alias

## Reinstall Global Packages

최신 버전 인스톨 + 글로벌 패키지를 다시 설치.

    $ nvm install node --reinstall-packages-from=node

최신 LTS 버전 인스톨 + 글로벌 패키지 다시 설치.

    $ nvm install 'lts/*' --reinstall-packages-from=current

## Upgrade npm

node 업그레이드시 글로벌 npm 은 버전이 그대로 유지된다.

node 업그레이드시 npm 을 함께 업그레이드할 수 있다.
    
    $ nvm install --reinstall-packages-from=default --latest-npm

node 설치후 npm 만 따로 업그레이드할 수도 있다.

    $ nvm install-latest-npm

## Change Node Versions

쉘 마다 사용할 노드를 선택할 수 있다.

    $ nvm use 10.16.3

    $ nvm use 24   <-- 24 번대 버전

    $ nvm use node   <-- 최신 버전

PATH 포함, 현재 쉘의 환경변수들을 바꿔서 실행되는 node를 바꾼다.

## Change default version

새 쉘에서 사용하는 디볼트 버전을 변경할 수 있다.

    $ nvm alias default 22       # major 버전
    $ nvm alias default v22.6.0  # 정확한 버전
    
디폴트를 최신 버전으로 변경할 수 있다.

    $ nvm alias default node

## .nvmrc

프로젝트 루트에 .nvmrc 를 만들어 두면 버전 전환이 쉬워진다.
.nvmrc 에는 프로젝트에서 사용할 node 버전을 기록한다.

    $ nvm current > .nvmrc

인자 없이 `nvm use` 를 사용하면 `.nvmrc` 에서 버전을 가져온다.

    $ nvm use

raysoda 같은 경우 `.nvmrc` 파일까지 설정할 필요는 없어 보였다.

## Code Upgrade 시나리오

머릿속으로 정리해 보면 이런 순서를 타면 될 것 같다.

개발 머신에서 node 최신 버전을 설치한다.

    $ nvm install node

`nvm use node` 하던지 새 쉘을 만들어 최신 버전 상태로 만든다.

    개발 작업을 쭉 함..

서버에 사용할 Node 버전은 Dockerfile 로 지정한다.
