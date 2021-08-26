import { exec } from 'child_process'

export function exec2(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err)
      resolve(stdout || stderr)
    })
  })
}
