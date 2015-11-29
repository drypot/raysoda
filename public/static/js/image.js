
$(function () {
  window.imagel = {};

  var fs = appNamel == 'rapixel' && fullscreen.enabled;
  var screenWidth = window.screen.width * (window.devicePixelRatio || 1);

  function addFsHandler($list) {
    $list.each(function () {
      var $image = $(this);
      var $fs = $('<i class="fa fa-expand fs-icon"></i>').click(function () {
        var $img = $image.find('img').eq(0); 
        var baseUrl = $img.attr('src').split('-',1)[0];
        var vers = $img.attr('data-vers').split(',');
        var ver;
        var i = 0;
        do {
          ver = vers[i];
          i++;
        } while (i < vers.length && vers[i] >= screenWidth);
        var $fsImg = $('<img>').attr('src', baseUrl + '-' + ver + '.jpg');
        var $fs = $('#fullscreen');
        $fsImg.click(function () {
          fullscreen.exit();
        });
        $fs.append($fsImg);
        fullscreen.request($fs[0]);
        return false;
      });
      $image.append($fs);
    });
  }

  fullscreen.onchange(function () {
    if (!fullscreen.inFullscreen()) {
      $fs = $('#fullscreen').empty();
    }
  });

  imagel.initList = function () {
    sessionStorage.setItem('last-list-url', location);
    $('.image-thumb .comment').each(function () {
      var $this = $(this);
      $this.html(tagUpText($this.html()));
    });
    if (fs) {
      addFsHandler($('.image-thumb .image'));
    }
  };

  imagel.initNew = function () {
    var $form = formty.getForm('form.main');
    $form.$send.click(function (err, res) {
      formty.post('/api/images', $form, function () {
        location = '/';
      });
      return false;
    });
  };

  imagel.initUpdate = function (image) {
    var $form = formty.getForm('form.main');
    $form.$send.click(function (err, res) {
      formty.put('/api/images/' + image._id, $form, function () {
        location = sessionStorage.getItem('last-list-url') || '/';
        //history.go(-2);
        //location = '/';
        //location = '/images/' + image._id;
      });
      return false;
    });
  };

  imagel.initView = function (image) {
    $('.image-full img').click(function () {
      history.back();
      return false;
    });
    if (fs) {
      addFsHandler($('.image-full .image'));
    }

    var $comment = $('.image-info .comment');
    $comment.html(tagUpText($comment.html()));

    $('#update-btn').click(function () {
      location = '/images/' + image._id + '/update';
      return false;
    });
    
    $('#del-btn').click(function () {
      $('#del-confirm-btn').removeClass('hide');
      return false;
    });
    
    $('#del-confirm-btn').click(function () {
      request.del('/api/images/' + image._id).end(function (err, res) {
        //err = err || res.error || res.body.err;
        err = err || res.body.err;
        if (err) return showError(res.body.err);
        location = '/';
      });
      return false;
    });
  };
});