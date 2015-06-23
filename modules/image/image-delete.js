var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var fsp = require('../base/fs');
var exp = require('../express/express');
var upload = require('../express/upload');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var imageu = require('../image/image-update');

exp.core.delete('/api/images/:id([0-9]+)', function (req, res, done) {
  userb.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    imageu.checkUpdatable(id, user, function (err) {
      if (err) return done(err);
      imageb.images.deleteOne({ _id: id }, function (err, cnt) {
        if (err) return done(err);
        fsp.removeDir(new imageb.FilePath(id).dir, function (err) {
          if (err) return done(err);
          res.json({});
        });
      });
    });
  });
});

/* TODO
trigger PhotosDeleteTg on Photos for delete
  as
    delete BBSThreadsPhotos
    from BBSThreadsPhotos TP join deleted D on TP.PhotoID = D.PhotoID

    delete CategoriesPhotos
    from CategoriesPhotos C join deleted D on C.PhotoID = D.PhotoID

    delete PhotoCrits
    from PhotoCrits C join deleted D on C.PhotoID = D.PhotoID

    delete FArtistsPhotos
    from FArtistsPhotos A join deleted D on A.PhotoID = D.PhotoID

    delete PhotoAdmQues
    from PhotoAdmQues A join deleted D on A.PhotoID = D.PhotoID
    
    delete PhotoAdmSels
    from PhotoAdmSels A join deleted D on A.PhotoID = D.PhotoID

    update Users 
    set PhotoCnt = PhotoCnt - 1, Rating = Users.Rating - deleted.Rating
    from deleted join Users on deleted.UserID = Users.UserID
  go

procedure PhotoDelete
    @PhotoID int output
    ,@UserID int = null output
    ,@RowCount int output
    as
    
    if (@UserID is null)
      select @UserID = UserID from Photos where PhotoID = @PhotoID

    delete Photos
    where PhotoID = @PhotoID and UserID = @UserID

    select @RowCount = @@rowcount
  go
    
*/