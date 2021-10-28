import { CounterDB } from '@server/db/counter/counter-db'

export async function counterIncrease(cdb: CounterDB, id: string) {
  await cdb.increaseCounter(id)
}

export async function counterGetList(cdb: CounterDB, id: string, begin: string, end: string) {
  return await cdb.findCounterList(id, begin, end)
}
