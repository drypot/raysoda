import bcryptjs from 'bcryptjs'

export async function makeHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcryptjs.hash(password, 10, (err, hash) => {
      if (err) return reject(err)
      // @ts-ignore
      resolve(hash)
    })
  })
}

export async function checkHash(password: string, hash: string): Promise<boolean | undefined> {
  return new Promise<boolean | undefined>((resolve, reject) => {
    bcryptjs.compare(password, hash, (err, success) => {
        if (err) return reject(err)
        resolve(success)
      }
    )
  })
}
