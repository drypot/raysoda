$(function () {
  window.csupp = {};

  csupp.initUpdateBanners = function () {
    var $form = formty.getForm('form.main');
    $form.$send.click(function () {
      var obj = formty.getObject($form);
      var e;
      try {
        obj.banners = JSON.parse(obj.banners)
      } catch (_e) {
        e = _e;
        alert(_e);
      }
      if (!e) {
        formty.put('/api/banners', $form, obj, function () {
          formty.hideSending($form);
          alert('done');
        });
      }
      return false;
    });
  };

  csupp.initCounterList = function () {
    var $form = formty.getForm('form.main');
    var $result = $('#result');
    $form.$send.click(function () {
      var obj = formty.getObject($form);
      var url = util2.url('/api/counters/' + $form.$id.val(), { b: $form.$b.val(), e: $form.$e.val()});
      request.get(url).end(function (err, res) {
        err = err || res.body.err;
        if (err) return showError(err);
        var c = res.body.counters;
        var html = '<table>';
        for (var i = 0; i < c.length; i++) {
          html += '<tr><td>' + util2.dateString(new Date(c[i].d)) + '</td><td>' + c[i].c + '</td></tr>'; 
        }
        html += '</table>';
        $result.html(html);
      });
      return false;
    });
  };
  
});