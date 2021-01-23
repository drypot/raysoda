'use strict';

const date2 = exports;

function pad(number) {
  var r = String(number);
  if ( r.length === 1 ) {
    r = '0' + r;
  }
  return r;
}

function pad3(number) {
  var r = String(number);
  if ( r.length === 1 ) {
    r = '00' + r;
  } else if ( r.length === 2 ) {
    r = '0' + r;
  }
  return r;
}

date2.today = function () {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}


date2.makeDateString = function (d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
};

date2.makeDatePacked = function (d) {
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
};

date2.parseDateString = function (s) {
  var d = new Date(s);
  d.setHours(0, 0, 0, 0);
  return d;
}


date2.makeDateTimeString = function (d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
};


date2.makeDateTimeMilliPacked = function (d) {
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
    pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + pad3(d.getMilliseconds());
};

date2.parseDateTimeMilliPacked = function (s) {
  let y = s.slice(0, 4);
  let m = parseInt(s.slice(4, 6)) - 1;
  let d = s.slice(6, 8);
  let h = s.slice(8, 10);
  let mm = s.slice(10, 12);
  let sec = s.slice(12, 14);
  let ms = s.slice(14, 17);
  return new Date(y, m, d, h, mm, sec, ms);
};
