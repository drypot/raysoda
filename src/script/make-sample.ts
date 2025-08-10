import { exec } from 'child_process'
import { logError } from '../common/util/error2.ts'
import sharp from 'sharp'

/*
  $ node sample/make-sample.js
*/

process.on('uncaughtException', function (err) {
  console.error(err)
  process.exit(1)
})

async function writeImage(w: number, h: number) {
  const lx = w - 1
  const ly = h - 1
  const cx = lx / 2;
  const cy = ly / 2;

  // let cmd = ''
  // cmd += 'convert -size ' + w + 'x' + h + ' xc:#c0c0c0'
  // cmd += ' -fill "#c0c0c0" -stroke "#303030" '
  // if (w > h) {
  //   cmd += ' -draw "circle ' + cx + ', ' + cy + ', ' + cx + ', 0"'
  //   cmd += ' -draw "circle ' + cx + ', ' + cy + ', ' + cx + ', ' + ly / 4 + '"'
  // } else {
  //   cmd += ' -draw "circle ' + cx + ', ' + cy + ', ' + '0, ' + cy + '"'
  //   cmd += ' -draw "circle ' + cx + ', ' + cy + ', ' + lx / 4 + ', ' + cy + '"'
  // }
  // cmd += ' -draw "line 0,0 ' + lx + ',' + ly + ' line 0,' + ly + ' ' + lx + ',0"'
  // cmd += ' -quality 92 sample/' + w + 'x' + h + '.jpg'

  // console.log(cmd)

  // await new Promise<void>((resolve, reject) => {
  //   exec(cmd, (err) => {
  //     if (err) return reject(err)
  //     resolve()
  //   })
  // })

  const r1 = Math.min(lx, ly) / 2
  const r2 = Math.min(lx, ly) / 4

  const hx = w > h ? cx * 0.25 : cx
  const hy = w > h ? cy : cy * 0.25

  const svg = `
    <svg width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#c0c0c0"/>
      <g fill="none" stroke="#303030">
        <circle cx="${cx}" cy="${cy}" r="${r1}" />
        <circle cx="${cx}" cy="${cy}" r="${r2}" />
        <line x1="0" y1="0" x2="${lx}" y2="${ly}" />
        <line x1="0" y1="${ly}" x2="${lx}" y2="0" />
        <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" />
      </g>
    </svg>`.trim()

  const outfile = `sample/${w}x${h}.jpg`

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92 })
    .toFile(outfile)

  console.log(outfile)
}

async function main() {
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
  ]
  for (const v of _vers) {
    await writeImage(v.width, v.height)
  }
}

main().then(() => {
  //
}).catch((err) => {
  logError(err)
}).finally(async () => {
  //
})
