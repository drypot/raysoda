import { sendGet } from '@client/util/fetch'

let ping = false

export function startPing() {
  if (ping) return
  ping = true
  console.log('ping start')
  window.setInterval(function () {
    sendGet('/api/hello').then(() => {
      console.log('ping ok')
    }).catch((err) => {
      console.log(err)
      console.log('ping error')
    })
  }, 1000 * 60 * 5) // 5 min
}
