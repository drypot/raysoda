var exec = require('child_process').exec;
var util = require('util');

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  process.exit(1);
});

var _vers = [
  { width: 3264, height: 2448 },
  { width: 2448, height: 3264 },
  { width: 960 , height: 540 },
  { width: 360 , height: 240 }
];

function makeVersions(next) {
  var i = 0;
  (function make() {
    if (i == _vers.length) {
      return next();
    }
    var v = _vers[i++];
    var w = v.width;
    var h = v.height;
    var cmd = '';
    cmd += 'convert -size ' + w + 'x' + h + ' xc:#c0c0c0';
    cmd += ' -fill "#c0c0c0" -stroke "#303030" '
    if (w > h) {
      cmd += ' -draw "circle ' + w / 2 + ', ' + h / 2 + ', ' + w / 2 + ', 0"';
      cmd += ' -draw "circle ' + w / 2 + ', ' + h / 2 + ', ' + w / 2 + ', ' + h / 4 + '"';
    } else {
      cmd += ' -draw "circle ' + w / 2 + ', ' + h / 2 + ', ' + '0, ' + h / 2 + '"';
      cmd += ' -draw "circle ' + w / 2 + ', ' + h / 2 + ', ' + w / 4 + ', ' + h / 2 + '"';
    }
    cmd += ' -draw "line 0,0 ' + (w - 1) + ',' + (h - 1) + ' line 0,' + (h - 1) + ' ' + (w - 1) + ',0"';
    cmd += ' -quality 92 ' + w + 'x' + h + '.jpg';
    console.log(cmd);
    exec(cmd, function (err) {
      if (err) return next(err);
      setImmediate(make);
    })
  })();
}

makeVersions(function (err) {
  console.log(err || 'done');
});
