import { useDB } from 'react-pouchdb'
import usePromise from 'react-use-promise'
import { ISODate, msToMinutes } from '../../utils/time'

type TaskStat = { x: string; y: number; label: string }
export type ITaskStats = [
  { [key: string]: Array<TaskStat> },
  Array<{ value: number; tag: string }>
]
type queryResults = { value: number; key: [string, string] }

export const useSaveTask = () => {
  const db = useDB('tasks')
  return (title: string, duration: number, tags: string[], date: Date) => {
    db.post({
      title,
      duration,
      tags,
      date: ISODate(date)
    })
  }
}

export const useTaskStats = (): ITaskStats => {
  const db = useDB('tasks')
  const startkey = new Date()
  startkey.setDate(new Date().getDate() - 3)
  const endkey = new Date()
  endkey.setDate(new Date().getDate() + 1)

  const [result] = usePromise(
    () =>
      db.query(
        {
          map: function (doc: any, emit: any) {
            for (let i = 0; i < doc.tags.length; i++) {
              emit([doc.date, doc.tags[i]], doc.duration)
            }
          },
          reduce: '_sum'
        },
        {
          startkey: [ISODate(startkey), ''],
          endkey: [ISODate(endkey), ''],
          group: true,
          group_level: 2,
          reduce: true
        }
      ),
    []
  )

  const hash: { [key: string]: Array<TaskStat> } = {}
  if (result) {
    result.rows.forEach(({ value, key }: queryResults) => {
      const [date, tag] = key
      if (!(tag in hash)) {
        hash[tag] = []
      }

      hash[tag].push({ x: date, y: value, label: tag })
    })
  }
  const sumHashValues = (o: Array<TaskStat>) =>
    o.reduce((acc: number, i) => acc + i.y, 0)
  const tags: ITaskStats[1] = result
    ? Object.values(hash).map(o => ({
        tag: o[0].label,
        value: sumHashValues(o)
      }))
    : []

  return [hash, tags]
}
