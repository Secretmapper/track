import { useDB } from 'react-pouchdb'
import usePromise from 'react-use-promise'
import { ISODate } from '../../utils/time'

export type ITaskStats = {
  rows: Array<{ value: number; key: string }>
}

export const useTaskStats = (): ITaskStats => {
  const db = useDB('tasks')
  const startkey = new Date()
  startkey.setDate(new Date().getDate() - 3)

  const [result] = usePromise(
    () =>
      db.query(
        {
          map: function (doc: any, emit: any) {
            for (let i = 0; i < doc.tags.length; i++) {
              emit(doc.tags[i], doc.duration)
            }
          },
          reduce: '_sum'
        },
        {
          startkey: ISODate(startkey),
          endkey: ISODate(new Date()),
          group: true,
          group_level: 1,
          reduce: true
        }
      ),
    []
  )

  return result
}
