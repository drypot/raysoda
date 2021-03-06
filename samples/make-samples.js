import { exec } from "child_process";
import util from "util";

/*
  $ node samples/make-samples.js
*/

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  process.exit(1);
});

const _vers = [
  { width: 5120, height: 2880 }, // rapixel
  { width: 4096, height: 2304 },
  { width: 3840, height: 2160 },
  { width: 2160, height: 3840 },
  { width: 2560, height: 1440 }, // osoky, raysoda
  //{ width: 1440, height: 810 },
  { width: 1280, height: 720 }, // osoky
  //{ width: 1136, height: 640 },
  // { width: 960 , height: 540 },
  { width: 640, height: 360 }, // osoky
  { width: 360, height: 240 }, // raysoda

  { width: 1440, height: 2560 } // raysoda
];

function saveImage(next) {
  let i = 0;
  (function make() {
    if (i == _vers.length) {
      return next();
    }
    const v = _vers[i++];
    const w = v.width;
    const h = v.height;
    const lx = w - 1;
    const ly = h - 1;
    let cmd = '';
    cmd += 'convert -size ' + w + 'x' + h + ' xc:#c0c0c0';
    cmd += ' -fill "#c0c0c0" -stroke "#303030" '
    if (w > h) {
      cmd += ' -draw "circle ' + lx / 2 + ', ' + ly / 2 + ', ' + lx / 2 + ', 0"';
      cmd += ' -draw "circle ' + lx / 2 + ', ' + ly / 2 + ', ' + lx / 2 + ', ' + ly / 4 + '"';
    } else {
      cmd += ' -draw "circle ' + lx / 2 + ', ' + ly / 2 + ', ' + '0, ' + ly / 2 + '"';
      cmd += ' -draw "circle ' + lx / 2 + ', ' + ly / 2 + ', ' + lx / 4 + ', ' + ly / 2 + '"';
    }
    cmd += ' -draw "line 0,0 ' + lx + ',' + ly + ' line 0,' + ly + ' ' + lx + ',0"';
    cmd += ' -quality 92 samples/' + w + 'x' + h + '.jpg';
    console.log(cmd);
    exec(cmd, function (err) {
      if (err) return next(err);
      setImmediate(make);
    })
  })();
}

saveImage(function (err) {
  if (err) throw err;
});
