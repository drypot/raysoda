# 관리자

## 관리자 권한 부여

웹 페이지에서는 관리자 권한을 부여할 수 없다.
서버 콘솔에서 아래 코드를 실행한다.

    $ node dist/app/user-script/set-admin.js config/raysoda-live.json 'admin@gmail.com'
