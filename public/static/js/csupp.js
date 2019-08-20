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
          //alert('done');
          location = '/';
        });
      }
      return false;
    });
  };

  csupp.initCounterList = function () {
    var $form = formty.getForm('form.main');
    var $result = $('#result');
    $form.find('input[name=id]').val('adng'); // for test
    $form.$send.click(function () {
      var obj = formty.getObject($form);
      var url = url2.url('/api/counters/' + $form.$id.val(), { b: $form.$b.val(), e: $form.$e.val()});
      request.get(url).end(function (err, res) {
        err = err || res.body.err;
        if (err) return showError(err);
        var c = res.body.counters;
        var sum = 0;
        var html = '<pre class="clean">';
        for (var i = 0; i < c.length; i++) {
          html += '' + date2.makeDateString(new Date(c[i].d)) + '\t' + c[i].c + '<br>'; 
          sum += c[i].c;
        }
        html += '<br>' + sum + '<br>';
        html += '</pre>';
        $result.html(html);
      });
      return false;
    });
  };
  
});