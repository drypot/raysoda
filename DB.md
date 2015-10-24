# DB Direct

    $ mongo

    > db.users.find({ homel : 'admin'})

    > db.users.update({ _id: 18060 }, { $set : { name: '...', namel: '...' }})