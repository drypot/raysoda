$(function () {
  window.cuser = {};

  cuser.initLogin = function () {
    var $form = formty.getForm('form.main');
    $form.$email.focus();
    $form.$send.click(function () {
      formty.post('/api/users/login', $form, function () {
        // formty.method 에서 에러처리 함
        location = '/';
      });
      return false;
    });
  };

  cuser.logout = function () {
    request.post('/api/users/logout').end(function (err, res) {
      err = err || res.body.err;
      if (err) return showError(err);
      console.log('logged out');
      location = '/';
    });
  };

  cuser.initRegister = function () {
    var $form = formty.getForm('form.main');
    $form.$send.click(function () {
      formty.post('/api/users', $form, function () {
        location = '/users/login?newuser';
      });
      return false;
    });
  };

  cuser.initResetPassStep1 = function () {
    var $form = formty.getForm('form.main');
    $form.$email.focus();
    $form.$send.click(function () {
      formty.post('/api/reset-pass', $form, function () {
        location = '?step=2';
      });
      return false;
    });
  };

  cuser.initResetPassStep3 = function () {
    var $form = formty.getForm('form.main');
    $form.$password.focus();
    $form.$send.click(function () {
      formty.put('/api/reset-pass', $form, { id: url.query.id, token: url.query.t }, function () {
        location = '/users/login';
      });
      return false;
    });
  };

  cuser.initProfile = function () {
    var $profile = $('#profile-text');
    if ($profile.length) {
      $profile.html(tagUpText($profile.html()));
    }
  };

  cuser.initUpdateProfileForm = function () {
    var $form = formty.getForm('form.main');
    var uid = url.pathnames[1];
    $('#domain-url').text(location.origin + '/');
    $form.$send.click(function () {
      formty.put('/api/users/' + uid, $form, function () {
        location = '/users/' + uid;
      });
      return false;
    });
  };

  cuser.initDeactivate = function () {
    $('#dea-btn').click(function () {
      $('#dea-confirm-btn').removeClass('hide');
      return false;
    });
    $('#dea-confirm-btn').click(function () {
      request.del('/api/users/' + user.id).end(function (err, res) {
        err = err || res.body.err;
        if (err) return showError(err);
        location = '/';
      });
      return false;
    });
  };

  cuser.initUserList = function () {
    var $form = formty.getForm('form.main');
    var $result = $('#result');
    $form.$send.click(function () {
      var obj = formty.getObject($form);
      var url = util2.url('/api/users', { q: $form.$q.val() });
      request.get(url).end(function (err, res) {
        err = err || res.body.err;
        if (err) return showError(err);
        var r = res.body.users;
        if (r.length) {
          var html = '<table>';
          for (var i = 0; i < r.length; i++) {
            if (i % 3 == 0) {
              html += '<tr>';
            } 
            html += '<td><a href="/' + encodeURIComponent(r[i].home) + '">' + r[i].name + '</a></td>'; 
            if (i % 3 == 2) {
              html += '</tr>';
            }
          }
          if (i % 3 != 0) {
            html += '</tr>';
          }
          html += '</table>';
          $result.html(html);
        } else {
          $result.html('No Users');
        }
      });
      return false;
    });
  };
});
