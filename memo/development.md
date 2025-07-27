# Development

개발환경 설정에 관한 메모들.

## Server

### 파일별 테스트 코드 실행

웹스톰 에디터 화면을 2등분.
오른쪽에 테스트 코드를 연다.
돌아다니며 수정할 코드는 왼쪽에 둔다.

테스트 코드를 실행하려면 테스트 코드 창에 가서 `Run Jasmine`
`Run` 액션의 핫키는 `Ctrl R`

마지막 실행했던 테스트 파일을 핫키로 재실행 할 수는 없다.
테스트 파일 창에 가서 다시 `Ctrl R`

### 전체 테스트 코드 실행

    $ bin/jasmine

### 서버 실행

    $ bin/raysoda

## Client

터미널 탭들을 열고 서버들을 띄운다.

레이소다 서버.

    $ bin/raysoda ...

sass 빌더.

    $ bin/sass-watch

rollup 빌더.

    $ bin/rollup-watch

클라이언트 코드 수정, 저장, 브라우저에서 리로드 반복.

