import { CounterDB } from '@server/db/counter/counter-db'

export async function incCounter(cdb: CounterDB, id: string) {
  await cdb.incCounter(id)
}

export async function getCounterList(cdb: CounterDB, id: string, begin: string, end: string) {
  return await cdb.getCounterList(id, begin, end)
}
