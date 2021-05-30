if (!window.console) {
  window.console = {
    log: function () {}
  }
}

$(function () {
  window.date2 = {};
  window.url2 = {};

  function pad(number) {
    var r = String(number);
    if ( r.length === 1 ) {
      r = '0' + r;
    }
    return r;
  }

  date2.makeDateTimeString = function (d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  };

  date2.makeDateString = function (d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  };

  url2.url = function(url, params) {
    var qm;
    for(var p in params) {
      if (qm) {
        url += '&';
      } else {
        url += '?';
        qm = true;
      }
      url += p;
      url += '=';
      url += params[p];
    }
    return url;
  };
});

$(function () {
  window.error = {};

  function define(code, msg) {
    error[code] = {
      code: code,
      message: msg
    }
  }

  define('INVALID_DATA', '비정상적인 값이 입력되었습니다.');
  define('INVALID_FORM', '*');

  define('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.');
  define('NOT_AUTHORIZED', '사용 권한이 없습니다.');
});

$(function () {
  window.$window = $(window);
  window.$document = $(document);

  window.url = {};
  window.url.pathnames = window.location.pathname.slice(1).split('/');
  window.url.query = (function () {
    var plusx = /\+/g;
    var paramx = /([^&=]+)=?([^&]*)/g;
    var search = window.location.search.slice(1);
    var query = {};
    var match;
    while (match = paramx.exec(search)) {
      query[match[1]] = decodeURIComponent(match[2].replace(plusx, ' '));
    }
    return query;
  })();
});

$(function () {
  window.request = {};
  ['post', 'put', 'get', 'del'].forEach(function (method) {
    request[method] = (function (method) {
      return function (url) {
        if (method == 'del') method = 'delete';
        return new XHR(method, url);
      }
    })(method);
  });

  function XHR(method, url) {
    this._method = method;
    this._url = url;
  }

  XHR.prototype.object = function (obj) {
    this._obj = obj;
    return this;
  }

  XHR.prototype.form = function (form) {
    this._form = form;
    return this;
  }

  XHR.prototype.end = function (done) {
    var xhr = new XMLHttpRequest();
    xhr.open(this._method, this._url);
    xhr.onload = onload;

    var data;
    var _form = this._form;
    if (_form) {
      data = new FormData(_form instanceof jQuery ? _form[0] : _form);
      for (var key in this._obj) {
        data.append(key, this._obj[key]);
      }
    } else if (this._obj) {
      data = JSON.stringify(this._obj);
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.send(data);

    function onload() {
      if (xhr.status == 200) {
        done(null, {
          xhr: xhr,
          body: JSON.parse(xhr.responseText) || {}
        });
      } else {
        done(new Error(xhr.statusText));
      }
    }
  };
});

$(function() {
  var $modal = $('#error-modal');
  var $title = $modal.find('.modal-title');
  var $body = $modal.find('.modal-body');

  window.showError = function (err, done) {
    $title.text(err.message);
    var body = '';
    if (err.stack) {
      console.log('stack:\n' + err.stack);
      body += err.stack.replace(/Error:.+\n/, '') + '\n';
    }
    if (err.detail) {
      console.log('detail:\n' + err.detail);
      body += err.detail;
    }
    $body.html(body);
    $modal.off('hidden.bs.modal');
    if (done) {
      $modal.on('hidden.bs.modal', done);
    }
    $modal.modal('show');
  };

  window.showErrorSample= function () {
    request.get('/api/error-sample').end(function (err, res) {
      showError(res.body.err);
    });
  };
});

$(function() {
  window.formty = {};

  /* checkbox 이름에는 [] 이 딸 붙는다. */
  var namex = /[^\[]+/;

  formty.getForm = function (sel) {
    var $form = $(sel);
    $form.find('input, textarea, select, button').each(function () {
      if (this.name) {
        var name = this.name.match(namex)[0];
        $form['$' + name] = $(this);
      }
    });
    return $form;
  };

  formty.getObject = function ($form, _obj) {
    var obj = {};
    $form.find('input, textarea, select').each(function () {
      if (this.name && !this.disabled) {
        var $this = $(this);
        var name = this.name.match(namex)[0];
        var braket = this.name.length != name.length;
        if (this.type == 'checkbox') {
          if (braket) {
            if ($this.prop('checked')) {
              if (obj[name]) {
                obj[name].push($this.val());
              } else {
                obj[name] = [$this.val()];
              }
            }
          } else {
            obj[name] = $this.prop('checked');
          }
          return;
        }
        if (this.type == 'file') {
          return;
        }
        obj[name] = $this.val();
      }
    });
    for (var key in _obj) {
      obj[key] = _obj[key];
    }
    return obj;
  }

  formty.initFileFieldAdder = function ($form) {
    $form.find('.file-inputs').each(function () {
      var $inputs = $(this);
      var $input = $inputs.children().first();
      var $adder =  $inputs.find('.adder');
      var $adderBtn = $('<button>').addClass('btn btn-default glyphicon glyphicon-plus');
      $adderBtn.click(function () {
        $input.clone().insertBefore($adder);
        return false;
      });
      $adderBtn.appendTo($adder);
    });
  };

/*
  formty.post('/api/...', $form, obj, function done() {
    formty.hideSending($form);
    alert('done');
  });

  obj 생략 가능.
  $form 에 file 필드 있으면 multipart/form-data 로 없으면 json 으로 보냄.
  done 은 에러 없이 요청이 완료된 경우만 호출 된다.
*/

  ['post', 'put'].forEach(function (method) {
    formty[method] = (function (method) {
      return function (url, $form, obj, done) {
        if (typeof obj == 'function') {
          done = obj;
          obj = null;
        }
        formty.clearAlerts($form);
        formty.showSending($form);
        var req = request[method].call(request, url);
        if ($form.find('input[type="file"]').length) {
          req.form($form).object(obj);
        } else {
          req.object(formty.getObject($form, obj));
        }
        req.end(function (err, res) {
          if (err) {
            showError(err);
            formty.hideSending($form);
            return;
          }
          if (res.body.err) {
            if (res.body.err.code === error.INVALID_FORM.code) {
              formty.addAlerts($form, res.body.err.errors);
              formty.hideSending($form);
              return;
            }
            showError(res.body.err);
            formty.hideSending($form);
            return;
          }
          // formty.hideSending($form) 을 부르지 않는다.
          // 보통 페이지 이동이 일어나므로 버튼을 바꿀 필요가 없다.
          done(null, res);
        });
      };
    })(method);
  });

  formty.showSending = function ($form) {
    if ($form.$send) {
      $form.$send.button('loading');
    }
    return;
  };

  formty.hideSending = function ($form) {
    if ($form.$send) {
      $form.$send.button('reset');
    }
    return;
  };

  formty.clearAlerts = function ($form) {
    $form.find('.has-error').removeClass('has-error');
    $form.find('.text-danger').remove();
  };

  formty.addAlert = function ($control, msg) {
    var $group = $control.closest('.form-group');
    $group.addClass('has-error');
    $group.append($('<p>').addClass('help-block text-danger').text(msg));
  };

  formty.addAlerts = function ($form, errors) {
    for (var i = 0; i < errors.length; i++) {
      var error = errors[i];
      formty.addAlert($form.find('[name="' + error.field + '"]'), error.message);
    }
  }
});

$(function () {
  var ping;
  $('textarea').on('focus', function () {
    if (!ping) {
      ping = true;
      console.log('ping: ready');
      window.setInterval(function() {
        request.get('/api/hello').end(function (err, res) {
          if (err || res.error) {
            console.log('ping: error');
          } else {
            console.log('ping');
          }
        });
      }, 1000 * 60 * 5); // 5 min
    }
  })
});

$(function () {
  var patterns = [
    { // url
      pattern: /(https?:\/\/[^ "'><)\n\r]+)/g,
      replace: '<a href="$1" target="_blank">$1</a>'
    }
  ];

  window.tagUpText = function (s, pi) {
    if (pi == undefined) {
      pi = 0;
    }
    if (pi == patterns.length) {
      return s;
    }
    var p = patterns[pi];
    var r = '';
    var a = 0;
    var match;
    while(match = p.pattern.exec(s)) {
      r += tagUpText(s.slice(a, match.index), pi + 1);
      r += p.replace.replace(/\$1/g, match[1]);
      a = match.index + match[0].length;
    }
    r += tagUpText(s.slice(a), pi + 1);
    return r;
  };
});

$(function () {
  window.fullscreen = {};

  fullscreen.enabled =
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled;

  fullscreen.request = function (obj) {
    ( obj.requestFullscreen ||
      obj.webkitRequestFullscreen ||
      obj.mozRequestFullScreen ||
      obj.msRequestFullscreen
    ).call(obj);
  };

  fullscreen.exit = function () {
    ( document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen
    ).call(document);
  };

  fullscreen.onchange = function (handler) {
    $document.on('fullscreenchange', handler);
    $document.on('mozfullscreenchange', handler);
    $document.on('webkitfullscreenchange', handler);
    $document.on('MSFullscreenChange', handler);
  }

  fullscreen.inFullscreen = function () {
    return fullscreen.enabled && !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  };
});
