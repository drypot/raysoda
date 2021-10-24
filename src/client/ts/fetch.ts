
export function checkResponseError(res: Response) {
  if (res.status >= 200 && res.status <= 299) {
    return res
  } else {
    throw Error(res.statusText)
  }
}
