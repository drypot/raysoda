import os from "os";
import nodemailer from "nodemailer";
import * as assert2 from "../base/assert2.js";

const transport = nodemailer.createTransport();

const mail = {
  from: 'no-reply@raysoda.com',
  to: 'drypot@gmail.com',
  subject: 'expl mail server test from ' + os.hostname(),
  text: 'Hello'
};

transport.sendMail(mail, function (err) {
  console.log(err ? 'err' : 'success');
});
