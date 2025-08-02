# Development

개발환경 설정에 관한 메모들.

## brew install

nginx, mysql, redis, imagemagick 등 설치한다.

서버들 설정 잘 하고 데몬 실행한다.

## WebStorm

한글 언어팩 설치되어 있으면 제거한다.

    Settings -> Plguins

Run 과 설치되어 있는 Node 환경을 연결해야 한다.

    Run -> Run... -> Edit Config -> Node 관련 설정들 돌아다니며 Node 인터프리터 선택해준다.

## Server 코드 작업시

### bin/make-hash

큰 업데이트를 시작하면 코드가 모두 깨져서 아무것도 안 될 수 있다.
이럴 때는 make-hash 부터 돌아가게 해보자.
연관된 코드가 적어서 스크립트 따라 들어가며 파일 몇 개만 수정하면 동작하게 만들 수 있을 것이다.
확인할 파일은 다음과 같다.

    bin/make-hash
    
### 파일별 테스트 코드 실행

웹스톰 에디터 화면을 2등분,
수정할 코드는 왼쪽에,
테스트 코드를 오른쪽에,

테스트 코드를 실행하려면,
테스트 코드 편집기로 이동,
Jasmine 실행

    Run -> Run 'jasmine`
    핫키는 ^R

마지막 실행했던 테스트 파일을 핫키로 재실행 할 수는 없다.
테스트 파일 창에 가서 다시 `^R`

### 전체 테스트 코드 실행

    $ bin/jasmine

### 서버 실행

    $ bin/raysoda

## Client 코드 작업시

터미널 탭들을 열고 서버들을 띄운다.

레이소다 서버.

    $ bin/raysoda ...

sass 빌더.

    $ bin/sass-watch

rollup 빌더.

    $ bin/rollup-watch

클라이언트 코드 수정, 저장, 브라우저에서 리로드 반복.

