import * as fs from 'fs'
import * as path from 'path'
import { MakeDirectoryOptions } from 'fs'

export function removeDir(p: string, done: Function) {
  fs.stat(p, function (err, stat) {
    if (err) return done(err)
    if (stat.isFile()) {
      return fs.unlink(p, function (err) {
        if (err && err.code !== 'ENOENT') return done(err)
        done()
      })
    }
    if (stat.isDirectory()) {
      fs.readdir(p, function (err, fnames) {
        if (err) return done(err)
        let i = 0

        function unlink() {
          if (i === fnames.length) {
            return fs.rmdir(p, function (err) {
              if (err && err.code !== 'ENOENT') return done(err)
              done()
            })
          }
          let fname = fnames[i++]
          removeDir(p + '/' + fname, function (err: any) {
            if (err) return done(err)
            setImmediate(unlink)
          })
        }

        unlink()
      })
    }
  })
}

export function emptyDir(p: string, done: Function) {
  fs.readdir(p, function (err, fnames) {
    if (err) return done(err)
    let i = 0

    function unlink() {
      if (i === fnames.length) {
        return done()
      }
      let fname = fnames[i++]
      removeDir(p + '/' + fname, function (err: any) {
        setImmediate(unlink)
      })
    }

    unlink()
  })
}

export function makeDirEasy(p: string, done: (err: NodeJS.ErrnoException | null, path?: string | undefined) => void) {
  let opt: MakeDirectoryOptions = {
    recursive: true,
    mode: 0o755,
  }
  fs.mkdir(p, opt, done)
}

export function genSafeFilename(name: string) {
  let i = 0
  const len = name.length
  let safe = ''
  for (; i < len; i++) {
    const ch = name.charAt(i)
    const code = name.charCodeAt(i)
    if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || '`~!@#$%^&()-_+=[{]};\',. '.indexOf(ch) >= 0)
      safe += ch
    else if (code < 128)
      safe += '_'
    else
      safe += ch
  }
  return safe
}

export function genDeepPath(id: number, iter: number) {
  let path = ''
  for (iter--; iter > 0; iter--) {
    path = '/' + id % 1000 + path
    id = Math.floor(id / 1000)
  }
  return id + path
}

export function copyFile(src: string, tar: string, done: Function) {
  const r = fs.createReadStream(src)
  const w = fs.createWriteStream(tar)
  r.on('error', function (err) {
    fs.unlinkSync(tar)
    done(err)
  })
  w.on('finish', function () {
    done()
  })
  w.on('error', function (err) {
    done(err)
  })
  r.pipe(w)
}
