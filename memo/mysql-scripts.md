# MySQL

db 에 바로 적용해 사용할 sql script 들 예제.

## login

    $ mysql -s -u drypot -p raysoda

    -s        : 결과 출력시 테이블표를 사용하지 않는다.
    -u drypot : 사용할 계정
    -p        : 암호를 묻는다.
    raysoda   : 디비 이름.

## 사용자 검색

    > select * from user where email='...';
    > select * from user where email='...'\G

    \G : 결과를 세로로 출력한다.

    > select * from user where home='...';
    > select * from user where name='...';

    > select * from user where email like 'drypot%';
