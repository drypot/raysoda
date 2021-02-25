'use strict';

const fs = require('fs');
const nodemailer = require('nodemailer');

const init = require('../base/init');
const config = require('../base/config');
const mailer2 = exports;

var transport;

init.add(function (done) {

  if (config.mailServer === "aws") {
    fs.readFile("config-live/ses-smtp-user.json", 'utf8', function (err, data) {
      if (err) return done(err);
      transport = nodemailer.createTransport(JSON.parse(data));
      done();
    });
  } else {
    if (config.mailServer) {
      transport = nodemailer.createTransport({
        host: config.mailServer,
        port: 587
      });
    }
    done();
  }
});

mailer2.send = function (opt, done) {
  if (transport) {
    return transport.sendMail(opt, done);
  }
  console.log(opt);
  done();
};
