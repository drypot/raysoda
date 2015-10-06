$(function () {
  window.supp = {};

  window.supp.updateBanners = function () {
    var $form = formty.getForm('form.main');
    $form.$send.click(function () {
      formty.put('/api/banners', $form, function () {
        formty.hideSending($form);
        alert('done');
      });
      return false;
    });
  };
  
});