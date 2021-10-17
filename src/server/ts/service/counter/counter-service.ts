import { CounterDB } from '@server/db/counter/counter-db'

export async function counterIncService(cdb: CounterDB, id: string) {
  await cdb.increaseCounter(id)
}

export async function counterListService(cdb: CounterDB, id: string, begin: string, end: string) {
  return await cdb.findCounterList(id, begin, end)
}
