$(function () {
  window.extra = {};

  window.extra.updateBanners = function () {
    var $form = formty.getForm('form.main');
    $form.$send.click(function () {
      formty.put('/api/banners', $form, function () {
        location = '/';
      });
      return false;
    });
  };
  
});