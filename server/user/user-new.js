var init = require('../base/init');
var error = require('../base/error');
var exp = require('../express/express');
var userb = require('../user/user-base');
var usern = exports;

exp.core.get('/users/register', function (req, res, done) {
  res.render('user/user-new');
});

exp.core.post('/api/users', function (req, res, done) {
  var form = getForm(req);
  form.home = form.name;
  form.homel = form.namel = form.name.toLowerCase();
  checkForm(form, 0, function (err) {
    if (err) return done(err);
    var now = new Date();
    var user = {
      _id: userb.getNewId(),
      name: form.name,
      namel: form.namel,
      home: form.home,
      homel: form.homel,
      email: form.email,
      hash: userb.makeHash(form.password),
      status: 'v',
      cdate: now,
      adate: now,
      profile: form.profile
      // admin 플래그는 콘솔에서 수작업으로 삽입한다. api 로 넣을 수 없다.
    };
    
    /* TODO
procedure UserInsert
  @InviteID int
  
  ,@UserID  int output
  ,@NickName  nvarchar(32) = ''
  ,@RealName  nvarchar(32) = ''
  ,@Password  nvarchar(16) = ''
  ,@Email   nvarchar(64) = ''
  ,@HomePage  varchar(256) = ''
  ,@Tel   varchar(32) = ''
  ,@Address nvarchar(64) = ''
  ,@ZipCode char(6) = ''
  ,@Comment ntext = ''
  ,@Status  char(1) = 'C'
  
  ,@BoxSID    nvarchar(16) = ''
  ,@BoxDesc nvarchar(32)

  ,@Greeting  ntext
  ,@Profile ntext
  ,@Career  ntext
  
  ,@Result  nvarchar(64) output
  as

  set @Result = 'OK'    

  begin transaction 
    if ((select InviteeID from UserInvites where InviteID = @InviteID) != 0)
      begin
        set @Result = 'ALREADY'
        goto ret
      end
      
    if ((select Email from UserInvites where InviteID = @InviteID) != @Email)
      begin
        set @Result = 'ASSERTFAILED'
        goto ret
      end

    if @NickName != '' and exists (select * from Users where NickName = @NickName)
      begin
        set @Result = 'NICKNAME'
        goto ret
      end

    if @Email != '' and exists (select * from Users where Email = @Email)
      begin
        set @Result = 'EMAIL'
        goto ret
      end
      
    exec SeqNextValue 'user', @UserID output
    
    if (@BoxSID = '' or exists (select * from Users where BoxSID = @BoxSID))
      select @BoxSID = 'home' + cast(@UserID as varchar);
    
    
    insert 
    into Users (UserID, NickName, RealName, Password, Email, HomePage, Tel, Address, ZipCode, Comment, Status, BoxSID, BoxDesc, Greeting, Profile, Career)  
    values (@UserID, ltrim(rtrim(@NickName)), ltrim(rtrim(@RealName)), @Password, @Email, @HomePage, @Tel, @Address, @ZipCode, @Comment, @Status, @BoxSID, @BoxDesc, @Greeting, @Profile, @Career)
    
    update UserInvites
    set InviteeID = @UserID
    where InviteID = @InviteID
    
    declare @folderResult int
    exec BBSFolderInsert @OwnerType = 'B', @OwnerID = @UserID, @Title = '방명록', @Result = @folderResult output

    ret:      
  if @Result = 'OK'
    commit transaction
  else 
    rollback transaction
    */

    userb.users.insertOne(user, function (err) {
      if (err) return done(err);
      res.json({
        id: user._id
      });
    });
  });
});

usern.emailx = /^[a-z0-9-_+.]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i

var getForm = usern.getForm = function (req) {
  var body = req.body;
  var form = {};
  form.name = String(body.name || '').trim();
  form.home = String(body.home || '').trim();
  form.email = String(body.email || '').trim();
  form.password = String(body.password || '').trim();
  form.profile = String(body.profile || '').trim();
  return form;
}

var checkForm = usern.checkForm = function (form, id, done) {
  var errors = [];
  var creating = id == 0;

  if (!form.name.length) {
    errors.push(error.NAME_EMPTY);
  } else if (form.name.length > 32 || form.name.length < 2) {
    errors.push(error.NAME_RANGE);
  }

  if (!form.home.length) {
    errors.push(error.HOME_EMPTY);
  } else if (form.home.length > 32 || form.home.length < 2) {
    errors.push(error.HOME_RANGE);
  }

  checkFormEmail(form, errors);

  if (creating || form.password.length) {
    checkFormPassword(form, errors);
  }

  countUsersByName(form.namel, id, function (err, cnt) {
    if (err) return done(err);
    if (cnt) {
      errors.push(error.NAME_DUPE);
    }
    countUsersByHome(form.homel, id, function (err, cnt) {
      if (err) return done(err);
      if (cnt) {
        errors.push(error.HOME_DUPE);
      }
      countUsersByEmail(form.email, id, function (err, cnt) {
        if (err) return done(err);
        if (cnt) {
          errors.push(error.EMAIL_DUPE);
        }
        if (errors.length) {
          done(error(errors));
        } else {
          done();
        }
      });
    });
  });
}

var checkFormEmail = usern.checkFormEmail = function (form, errors) {
  if (!form.email.length) {
    errors.push(error.EMAIL_EMPTY);
  } else if (form.email.length > 64 || form.email.length < 8) {
    errors.push(error.EMAIL_RANGE);
  } else if (!usern.emailx.test(form.email)) {
    errors.push(error.EMAIL_PATTERN);
  }
}

var checkFormPassword = usern.checkFormPassword = function (form, errors) {
  if (!form.password.length) {
    errors.push(error.PASSWORD_EMPTY);
  } else if (form.password.length > 32 || form.password.length < 4) {
    errors.push(error.PASSWORD_RANGE);
  }
}

function countUsersByName(namel, id, done) {
  var q = { $or: [
    { namel: namel, _id : { $ne: id } },
    { homel: namel, _id : { $ne: id } }
  ]};
  userb.users.count(q, done);
};

function countUsersByHome(namel, id, done) {
  // countUserByName 과 평션정의가 같다. 정상이다. 들어오는 인자는 다르다.
  var q = { $or: [
    { namel: namel, _id : { $ne: id } },
    { homel: namel, _id : { $ne: id } }
  ]};
  userb.users.count(q, done);
};

function countUsersByEmail(email, id, done) {
  var q = { 
    email: email, _id: { $ne: id } 
  };
  userb.users.count(q, done);
};
