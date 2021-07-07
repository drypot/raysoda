import { exec } from "child_process";
import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as fs2 from "../base/fs2.mjs";
import * as db from '../db/db.mjs';

error.define('IMAGE_NOT_EXIST', '파일이 없습니다.');
error.define('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'files');
error.define('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'files');
error.define('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'files');

// images

export let fman;

let imageId;

init.add(
  (done) => {
    db.query(`
      create table if not exists image(
        id int not null,
        uid int not null,
        cdate datetime(3) not null,
        vers varchar(4096) not null default 'null',
        comment text not null,
        primary key (id)
      )
    `, done);
  },
  (done) => {
    db.query(`
      create index image_cdate on image(cdate desc);
    `, () => { done(); });
  },
  (done) => {
    db.query(`
      create index image_uid_cdate on image(uid, cdate desc);
    `, () => { done(); });
  },
  (done) => {
    db.getMaxId('image', (err, id) => {
      if (err) return done(err);
      imageId = id;
      done();
    });
  }
);

export function getNewId() {
  return ++imageId;
}

export function packImage(image) {
  if (image.vers !== undefined) {
    image.vers = JSON.stringify(image.vers);
  }
}

export function unpackImage(image) {
  image.vers = JSON.parse(image.vers);
}

/*
  이미지 파일 관리

  같은 형태끼리 모으지 말고 관련된 것끼리 모아놓는 것이 좋을 것 같다.
  해서 원본과 버전을 같은 디렉토리에 넣는 것으로 한다.

  스토리지가 부족하면 원본/버젼을 분리할 것이 아니라
  id 영역별로 나누는 방안을 고려하면 될 것 같다.

  원본을 저장하는 경우, 파일에 -org 를 붙여 놓는다.
  DB 없이 파일명으로 검색이 가능한 장점.
*/

export let imageDir;
export let imageUrl;

init.add(
  function (done) {
    fs2.makeDir(config.prop.uploadDir + '/public/images', function (err, dir) {
      if (err) return done(err);
      imageDir = dir;
      imageUrl = config.prop.uploadSite + '/images';
      done();
    });
  },
  function (done) {
    let path = './image-fman-' + config.prop.appNamel + '.mjs';
    import(path).then(module => {
      fman = module;
      done();
    });
  }
);

export function emptyDir(done) {
  if (config.prop.dev) {
    fs2.emptyDir(imageDir, done);
  } else {
    done(new Error("emptyDir not allowed on production instance."));
  }
}

export function identify(fname, done) {
  // identify 에 -auto-orient 를 적용할 수가 없어서 morify 를 할 수 없이 한번 한다.
  exec('identify -format "%m %w %h" ' + fname, function (err, stdout, stderr) {
    if (err) return done(err);
    const a = stdout.split(/[ \n]/);
    const width = parseInt(a[1]) || 0;
    const height = parseInt(a[2]) || 0;
    const meta = {
      format: a[0].toLowerCase(),
      width: width,
      height: height,
      shorter: width > height ? height : width
    };
    done(null, meta);
  });
}

export function checkUpdatable(user, id, done) {
  db.queryOne('select * from image where id = ?', id, (err, image) => {
    if (err) return done(err);
    if (!image) {
      return done(error.newError('IMAGE_NOT_EXIST'));
    }
    if (image.uid !== user.id && !user.admin) {
      return done(error.newError('NOT_AUTHORIZED'));
    }
    done(null, image);
  });
}
