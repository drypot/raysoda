
$(function () {
  window.imagel = {};

  imagel.initList = function () {
    sessionStorage.setItem('last-list-url', location);
    $('.image-thumb .comment').each(function () {
      var $this = $(this);
      $this.html(tagUpText($this.html()));
    });
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
    var $img = $('.image-full img');
    var $comment = $('.image-info .comment');

    $img.click(function () {
      history.back();
      return false;
    });

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