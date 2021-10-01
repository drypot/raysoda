export type Banner = {
  text: string
  url: string
}

export function getBanner(text: string, url: string): Banner {
  return { text, url }
}
