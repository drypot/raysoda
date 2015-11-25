var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../base/mongo-base')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

before(function (done) {
  userf.login('user1', done);
});

var _now = new Date();

function genImage(hours, count, done) {
  var images = [];
  for (var i = 0; i < count; i++) {
    var image = {
      _id: imageb.getNewId(),
      uid: userf.user1._id,
      cdate: new Date(_now.getTime() - (hours * 60 * 60 * 1000))
    };
    images.push(image);
  }
  imageb.images.insertMany(images, done);
}

describe('getTicketCount', function () {
  before(function (done) {
    imageb.images.deleteMany(done);
  });
  it('should return ticketMax when clean', function (done) {
    imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
      expect(err).not.exist;
      expect(count).equal(config.ticketMax);
      done();
    });
  });
  it('should return ticketMax when the last image aged', function (done) {
    genImage(config.ticketGenInterval + 1, 1, function (err) {
      expect(err).not.exist;
      imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
        expect(err).not.exist;
        expect(count).equal(config.ticketMax);
        done();
      });
    });
  });
  it('should return (ticketMax - 1) when an image uploaded', function (done) {
    genImage(config.ticketGenInterval - 1, 1, function (err) {
      expect(err).not.exist;
      imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
        expect(err).not.exist;
        expect(count).equal(config.ticketMax - 1);
        done();
      });
    });
  });
  it('should return 0 with left hours when ticketMax images uploaded', function (done) {
    imageb.images.deleteMany(function (err) {
      expect(err).not.exist;
      genImage(config.ticketGenInterval - 3, config.ticketMax, function (err) {
        expect(err).not.exist;
        imagen.getTicketCount(_now, userf.user1, function (err, count, hours) {
          expect(err).not.exist;
          expect(count).equal(0);
          expect(hours).equal(3);
          done();
        });
      });
    });
  });
});

describe('post /api/images', function () {
  it('should fail with plain text file', function (done) {
    imageb.images.deleteMany(function (err) {
      expect(err).not.exist;
      expl.post('/api/images').attach('files', 'server/express/express-upload-f1.txt').end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).exist;
        expect(res.body.err).error('IMAGE_TYPE');
        done();
      });
    });
  });
  it('should fail with no file', function (done) {
    var form = { };
    imageb.images.deleteMany(function (err) {
      expect(err).not.exist;
      expl.post('/api/images').send(form).end(function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).exist;
        expect(res.body.err).error('IMAGE_NO_FILE');
        done();
      });
    });
  });
});

