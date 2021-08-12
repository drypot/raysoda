import bcryptjs from 'bcryptjs'

export async function makePasswordHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcryptjs.hash(password, 10, (err, hash) => {
      if (err) return reject(err)
      resolve(hash)
    })
  })
}

export async function checkPasswordHash(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcryptjs.compare(password, hash, (err, success) => {
        if (err) return reject(err)
        resolve(success)
      }
    )
  })
}
