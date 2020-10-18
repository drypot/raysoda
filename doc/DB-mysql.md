# DB Direct Samples

    $ mysql -s -u drypot -p raysoda

    -s: 결과 출력시 테이블표를 사용하지 않는다.
    -u drypot: 사용할 계정
    -p: 암호를 묻는다.
    raysoda: 디비 이름.

사용자 검색

    > select * from user where email='...';
    > select * from user where email='...'\G

    \G : 결과를 세로로 출력한다.

    > select * from user where home='...';
    > select * from user where name='...';

    > select * from user where email like 'drypot%';

이름 변경

    추후 수정.
    db.users.find({ homel : 'admin'})
    db.users.update({ _id: 18060 }, { $set : { name: '...', namel: '...' }})

계정 복구

    > select * from user where home='...'\G
    > update user set status='v' where home='...';


    > select * from user where email='...'\G
    > update user set status='v' where email='...';

    디비 수정하고 서버 재시동이 필요하다.
    추후 user 캐쉬만 refresh 하는 기능을 만들어야;

사진 코멘트 변경

    추후 수정.
    db.images.find({ uid: 125613 })

    db.images.update( { uid: 125613, "comment" : "ShinjukuNoir\n\n#新&#40658;宿#" }, { $set: { "comment" : "ShinjukuNoir\r\n\r\n#新黒宿#" }}, { multi: true})

사용 정지

    추후 수정.
    db.users.find({ name : ''})
    db.users.update({ name : '' }, { $set: { status: 'd' } })

