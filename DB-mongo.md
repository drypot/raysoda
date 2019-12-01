# DB Direct Samples

    $ mongo

이름 변경

    db.users.find({ homel : 'admin'})
    db.users.update({ _id: 18060 }, { $set : { name: '...', namel: '...' }})

계정 복구

    db.users.find({ email: '...' })
    db.users.update({ email: '...' }, { $set : { status: 'v' }})

    db.users.find({ namel: '...' })
    db.users.update({ namel: '...' }, { $set : { status: 'v' }})

    디비 수정하고 웹 페이지에서 Profile Update 한번 해야한다.

사진 코멘트 변경

    db.images.find({ uid: 125613 })

    db.images.update( { uid: 125613, "comment" : "ShinjukuNoir\n\n#新&#40658;宿#" }, { $set: { "comment" : "ShinjukuNoir\r\n\r\n#新黒宿#" }}, { multi: true})

사용 정지

    db.users.find({ name : ''})
    db.users.update({ name : '' }, { $set: { status: 'd' } })

이메일 검색

    db.users.find({ email: new RegExp('^abc') })
