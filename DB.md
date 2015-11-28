# DB Direct Samples

    $ mongo

이름 변경

    db.users.find({ homel : 'admin'})
    db.users.update({ _id: 18060 }, { $set : { name: '...', namel: '...' }})

계정 복구

    db.users.find({ homel: '...' })
    db.users.update({ homel: '...' }, { $set : { status: 'v' }})

    현재는 서버 재가동해야함; 수정 해야;

사진 코멘트 변경

    db.images.find({ uid: 125613 })

    db.images.update( { uid: 125613, "comment" : "ShinjukuNoir\n\n#新&#40658;宿#" }, { $set: { "comment" : "ShinjukuNoir\r\n\r\n#新黒宿#" }}, { multi: true})

