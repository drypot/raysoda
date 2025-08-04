export function setRefresh() {
  sessionStorage.setItem('refresh', 'true')
}

if (sessionStorage.getItem('refresh') === 'true') {
  sessionStorage.removeItem('refresh')
  window.location.reload()
}
