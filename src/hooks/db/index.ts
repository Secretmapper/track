import { useDB } from 'react-pouchdb'
import usePromise from 'react-use-promise'
import { ISODate } from '../../utils/time'
import ld from 'lodash'

type TaskStat = { x: string; y: number; label: string }
export type ITaskStats = [
  { [key: string]: Array<TaskStat> },
  Array<{ value: number; tag: string }>
]
type queryResults = { value: number; key: [string, string, string, string] }

export const useSaveTask = () => {
  const db = useDB('tasks')
  return (
    title: string,
    duration: number,
    tags: string[],
    date: Date,
    doc?: any
  ) => {
    const changeset = {
      title,
      duration,
      // join tags, split on ',', trim and remove ln < 0
      tags: ld.uniq(
        tags
          .join(',')
          .split(',')
          .map(s => s.trim())
          .filter(i => i.length > 0)
      ),
      date: ISODate(date).split('-')
    }

    if (doc) {
      db.put({ ...doc, ...changeset })
    } else {
      db.post(changeset)
    }
  }
}

export const useTaskStats = (startDate: Date, endDate: Date): ITaskStats => {
  const db = useDB()

  const [result] = usePromise(
    () =>
      db.query(
        {
          map: function (doc: any, emit: any) {
            for (let i = 0; i < doc.tags.length; i++) {
              // we split date and use format ['2019', '08', '01']
              // this allows us to filter our dates in multiple ways
              const dateKey = doc.date.map((i: any) => i.padStart(2, '0'))

              emit([doc.tags[i], ...dateKey], doc.duration)
            }
          },
          reduce: '_sum'
        },
        {
          startkey: ['', ...ISODate(startDate).split('-')],
          endkey: ['\ufff0', ...ISODate(endDate).split('-')],
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
      const [tag, y, m, d] = key
      if (!(tag in hash)) {
        hash[tag] = []
      }

      hash[tag].push({ x: d, y: value, label: '' })
    })
  }
  const sumHashValues = (o: Array<TaskStat>) =>
    o.reduce((acc: number, i) => acc + i.y, 0)
  const tags: ITaskStats[1] = result
    ? Object.values(hash)
        .map(o => ({
          tag: o[0].label,
          value: sumHashValues(o)
        }))
        .sort((a, b) => b.value - a.value)
    : []

  return [hash, tags]
}

export const useDeleteTask = () => {
  const db = useDB('tasks')
  return db.remove
}
