'use strict';

const nodemailer = require('nodemailer');

const init = require('../base/init');
const config = require('../base/config');
const mailer2 = exports;

var transport;

init.add(function (done) {
  
  // 일단은 postfix 통해서 메일 보내는 것으로 유지
  // To Do: 메일 발송 테스트를 위해 구글 계정을 사용하는 코드를 추가

  if (config.mailServer) {
    transport = nodemailer.createTransport({
      host: config.mailServer,
      port: 25
    });
  }

  done();
});

mailer2.send = function (opt, done) {
  if (transport) {
    return transport.sendMail(opt, done);
  }
  console.log(opt);
  done();
};
