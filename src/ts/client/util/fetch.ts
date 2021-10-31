export function postJson(url: string, data: any) {
  const opt: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  return callFetch(url, opt)
}

export function putJson(url: string, data: any) {
  const opt: RequestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  return callFetch(url, opt)
}

function callFetch(url: string, opt: RequestInit) {
  return fetch(url, opt)
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.statusText)
      }
      return res
    })
    .then(res => res.json())
}

/*
var input = document.querySelector('input[type="file"]')

var data = new FormData()
data.append('file', input.files[0])
data.append('user', 'hubot')

fetch('/avatars', {
  method: 'POST',
  body: data
})
 */
