var init = require('../base/init');
var error = require('../base/error');
var exp = require('../express/express');
var userb = require('../user/user-base');
var usern = require('../user/user-new');

exp.core.put('/api/users/:id([0-9]+)', function (req, res, done) {
  userb.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    var form = usern.getForm(req);
    userb.checkUpdatable(id, user, function (err) {
      if (err) return done(err);
      form.namel = form.name.toLowerCase();
      form.homel = form.home.toLowerCase();
      usern.checkForm(form, id, function (err) {
        if (err) return done(err);
        var fields = {
          name: form.name,
          namel: form.namel,
          home: form.home,
          homel: form.homel,
          email: form.email,
          profile: form.profile
        };
        if (form.password.length) {
          fields.hash = userb.makeHash(form.password);
        }

        /* TODO
        procedure UserUpdate
            @UserID   int
            ,@NickName  nvarchar(32)
            ,@RealName  nvarchar(32)
            ,@Password  nvarchar(16) = null
            ,@Email   nvarchar(64)
            ,@HomePage  varchar(256)
            ,@Tel   varchar(32)
            --,@Address nvarchar(64)
            --,@ZipCode char(6)
            ,@Result  nvarchar(128) output
            as
            
            set @Result = 'OK'    

            begin transaction 
              if @NickName is not null and exists (select * from Users where NickName = @NickName and UserID != @UserID)
                begin
                  set @Result = 'NICKNAME'
                  goto ret
                end
              if @Email is not null and exists (select * from Users where Email = @Email and UserID != @UserID) 
                begin
                  set @Result = 'EMAIL'
                  goto ret
                end

              update Users
              set 
                NickName = ltrim(rtrim(@NickName)) 
                ,RealName =ltrim(rtrim(@RealName)) 
                ,Email = @Email 
                ,HomePage = @HomePage 
                ,Tel = @Tel 
                --,Address = @Address 
                --,ZipCode = @ZipCode 
              where UserID = @UserID

              if @Password is not null 
                update Users 
                set Password = @Password 
                where UserID = @UserID

            ret:
            if @Result = 'OK'
              commit transaction
            else 
              rollback transaction
          go*/

        /* TODO:
        procedure UserUpdateEnv
            @UserID   int
            ,@FIcon   char(1)
            ,@FMusic  char(1)
            ,@FScore  char(1)
            ,@FGoC    char(1)
            as
            
            update Users
            set 
              FIcon = @FIcon
              ,FMusic = @FMusic
              ,FScore = @FScore
              ,FGoC = @FGoC
            where UserID = @UserID
        */

        /* TODO:
          procedure UserUpdateStatus
              @UserID   int
              ,@Status  char(1)
              ,@FDisWrite char(1)
              ,@FSeed char(1)
              as
                update Users
                set 
                  Status = @Status
                  ,FDisWrite = @FDisWrite
                  ,FSeed = @FSeed
                where UserID = @UserID
        */

        userb.users.updateOne({ _id: id }, { $set: fields }, function (err, r) {
          if (err) return done(err);
          if (!r.modifiedCount) {
            return done(error('USER_NOT_FOUND'));
          }
          userb.deleteCache(id);
          res.json({});
        });
      });
    });
  });
});

exp.core.get('/users/:id([0-9]+)/update', function (req, res, done) {
  userb.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    userb.checkUpdatable(id, user, function (err) {
      if (err) return done(err);
      userb.getCached(id, function (err, tuser) {
        if (err) return done(err);
        res.render('user/user-update', {
          tuser: tuser
        });
      });
    });
  });
});
