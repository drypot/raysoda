# Install Mac

Mac 개발환경 설정에 관한 메모들.

## 기동에 필요한 서버 설정들

https://github.com/drypot/mysql-conf-mac
https://github.com/drypot/redis-conf
https://github.com/drypot/nginx-conf-mac

## 서버를 띄우는 코드들

https://github.com/drypot/dotfiles

    bin/bin/start-*

## IDE

VS Code, WebStorm 관련 내용은 별도 파일에.

    ide-*.md

## bin/make-hash

큰 업데이트를 시작하면 코드가 모두 깨져서 아무것도 안 될 수 있다.
이럴 때는 make-hash 부터 돌아가게 해보자.
연관된 코드가 적어서 스크립트 따라 들어가며 파일 몇 개만 수정하면 동작하게 만들 수 있을 것이다.

    $ bin/make-hash
    
## 파일별 테스트 코드 실행

에디터 화면을 2등분,
수정할 코드는 왼쪽에,
테스트 코드를 오른쪽에,

테스트 코드를 실행하려면,
테스트 코드 편집기로 이동,
Jasmine 실행,

## 전체 테스트 코드 실행

    $ bin/jasmine

### 서버 실행

    $ bin/raysoda

## 웹 브라우저로 페이지 테스트하려면

터미널 탭들을 열고 서버들을 띄운다.

레이소다 서버.

    $ bin/raysoda ...

css 작업할 때는 sass 빌더.

    $ bin/sass --watch

client script 작업할 때는 번들러.

    $ bin/esbuild --watch

클라이언트 코드 수정, 저장, 브라우저에서 리로드 반복.
