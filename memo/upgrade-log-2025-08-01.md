# Upgrade 2025-08-01

며칠 전부터 RaySoda 코드를 업그레이드하고 있다.

## mysql -> mysql2

node mysql 모듈은 업데이트가 안 되고 있어서 mysql의 새로운 인증방식을 지원하지 못한다고 한다;
mysql2 모듈을 쓰라고.

https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server


*

mysql2 말고도 오라클에서 공식적으로 만든 MySQL Connector/Node.js 라는 것도 있다.
근데 사용자가 적으니 그냥 mysql2 쓰라는 것 같다;

*

mysql2 로 접속하는데도 오류가 난다.

    Plugin 'mysql_native_password' is not loaded

디비의 drypot 계정이 이미 mysql_native_password 형식으로 세팅되어 그런 것 같다.

등록된 user 를 보려면.

    select user, host, plugin from mysql.user;

기존 user 삭제.

    drop user 'drypot'@'localhost';

유저 다시 생성.

    CREATE USER 'drypot'@'%' IDENTIFIED BY '';
    GRANT ALL PRIVILEGES ON *.* TO 'drypot'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;

## 2025-08-05 새벽 5시 반

작업이 끝나서 aws1 에 업데이트, 재시동했다.
