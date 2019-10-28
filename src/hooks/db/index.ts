import { useDB } from 'react-pouchdb'
import usePromise from 'react-use-promise'
import PouchDB from 'pouchdb'
import { ISODate } from '../../utils/time'

type TaskStat = { x: string; y: number; label: string }
export type ITaskStats = [
  { [key: string]: Array<TaskStat> },
  Array<{ value: number; tag: string }>
]
type queryResults = { value: number; key: [string, string, string, string] }

export const useSaveTask = () => {
  const db = useDB('tasks')
  return (title: string, duration: number, tags: string[], date: Date) => {
    db.post({
      title,
      duration,
      tags,
      date: ISODate(date).split('-')
    })
  }
}

export const useTaskStats = (): ITaskStats => {
  const db = useDB()

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
              console.log(doc.date)
              emit([...doc.date, doc.tags[i]], doc.duration)
            }
          },
          reduce: '_sum'
        },
        {
          startkey: [...ISODate(startkey).split('-'), ''],
          endkey: [...ISODate(endkey).split('-'), ''],
          group: true,
          group_level: 4,
          reduce: true
        }
      ),
    []
  )

  const hash: { [key: string]: Array<TaskStat> } = {
    '': [
      {
        x: '2019',
        y: 0,
        label: ''
      }
    ]
  }
  if (result) {
    result.rows.forEach(({ value, key }: queryResults) => {
      const [y, m, d, tag] = key
      if (!(tag in hash)) {
        hash[tag] = []
      }

      hash[tag].push({ x: [y, m, d].join('-'), y: value, label: tag })
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
