export function newDeepPath(id: number, iter: number) {
  let path = ''
  for (iter--; iter > 0; iter--) {
    path = '/' + id % 1000 + path
    id = Math.floor(id / 1000)
  }
  return id + path
}
