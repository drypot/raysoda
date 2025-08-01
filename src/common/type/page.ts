export type PageParam = {
  page: number,
  begin: number,
  end: number,
  date: Date | null,
  uid: number,
  size: number,
}

export function newPageParam(): PageParam {
  return {
    page: 0,
    begin: 0,
    end: 0,
    date: null,
    uid: 0,
    size: 16,
  }
}
