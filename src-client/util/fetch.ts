export function sendGet(url: string) {
  const opt: RequestInit = {
    method: 'GET',
  }
  return callFetch(url, opt)
}

export function sendPost(url: string, data: any) {
  const opt: RequestInit = {
    method: 'POST'
  }
  if (data instanceof FormData) {
    opt.body = data
  } else {
    opt.headers = { 'Content-Type': 'application/json' }
    opt.body = JSON.stringify(data)
  }
  return callFetch(url, opt)
}

export function sendPut(url: string, data: any) {
  const opt: RequestInit = {
    method: 'PUT',
  }
  if (data instanceof FormData) {
    opt.body = data
  } else {
    opt.headers = { 'Content-Type': 'application/json' }
    opt.body = JSON.stringify(data)
  }
  return callFetch(url, opt)
}

export function sendDelete(url: string) {
  const opt: RequestInit = {
    method: 'DELETE',
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
