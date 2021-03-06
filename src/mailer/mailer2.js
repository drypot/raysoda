import * as fs from "fs";
import nodemailer from "nodemailer";
import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as config from "../base/config.js";

let transport;

init.add(function (done) {
  if (config.prop.mailServer === "aws") {
    fs.readFile("config-live/ses-smtp-user.json", 'utf8', function (err, data) {
      if (err) return done(err);
      transport = nodemailer.createTransport(JSON.parse(data));
      done();
    });
  } else {
    if (config.prop.mailServer) {
      transport = nodemailer.createTransport({
        host: config.prop.mailServer,
        port: 587
      });
    }
    done();
  }
});

export function send(opt, done) {
  if (transport) {
    return transport.sendMail(opt, done);
  }
  console.log(opt);
  done();
}
