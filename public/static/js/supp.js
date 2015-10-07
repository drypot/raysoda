$(function () {
  window.supp = {};

  window.supp.updateBanners = function () {
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
  
});