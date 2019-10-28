import React, { useContext, useEffect, useState } from 'react'
import { useDB } from 'react-pouchdb'
import { ISODate } from '../../utils/time'
import { eachDayOfInterval } from 'date-fns'
import ld from 'lodash'

type TaskStat = { x: string; y: number; tag: string; label: string }
export type ITaskStats = [
  { [key: string]: Array<TaskStat> },
  Array<{ value: number; tag: string }>,
  TaskStat[]
]
type queryResults = { value: number; key: [string, string, string, string] }

// we use this context value to force rerenders on task data changes
// as map/reduce queries cannot be subscribed to
export const TasksKeyContext = React.createContext({
  value: 0,
  retrigger: () => {}
})

export const useSaveTask = () => {
  const db = useDB('tasks')
  const { retrigger } = useContext(TasksKeyContext)

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
    retrigger()
  }
}

export const useTaskStats = (startDate: Date, endDate: Date): ITaskStats => {
  const { value } = useContext(TasksKeyContext)
  const [result, setResult] = useState<any>(null)
  const db = useDB()

  useEffect(() => {
    async function query () {
      const result = await db.query(
        {
          map: function (doc: any, emit: any) {
            for (let i = 0; i < doc.tags.length; i++) {
              // we split date and use format ['2019', '08', '01']
              // this allows us to filter our dates in multiple ways
              const dateKey = doc.date.map((i: any) => i.padStart(2, '0'))

              emit([...dateKey, doc.tags[i]], doc.duration)
            }
          },
          reduce: '_sum'
        },
        {
          startkey: [...ISODate(startDate).split('-'), ''],
          endkey: [...ISODate(endDate).split('-'), '\ufff0'],
          group: true,
          group_level: 4,
          reduce: true
        }
      )
      setResult(result)
    }

    query()
  }, [value])

  const hash: { [key: string]: Array<TaskStat> } = {}
  if (result) {
    result.rows.forEach(({ value, key }: queryResults) => {
      const [y, m, d, tag] = key
      if (!(tag in hash)) {
        hash[tag] = []
      }

      hash[tag].push({ x: d, y: value, tag, label: '' })
    })
  }
  const sumHashValues = (o: Array<TaskStat>) =>
    o.reduce((acc: number, i) => acc + i.y, 0)
  const tags: ITaskStats[1] = result
    ? Object.values(hash)
        .map(o => ({
          tag: o[0].tag,
          value: sumHashValues(o)
        }))
        .sort((a, b) => b.value - a.value)
    : []
  const interval = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (d: Date) => ({
      x: (d.getDate() + '').padStart(2, '0'),
      y: 0,
      label: '',
      tag: ''
    })
  )

  return [hash, tags, interval]
}

export const useDeleteTask = () => {
  const db = useDB('tasks')
  const { retrigger } = useContext(TasksKeyContext)

  return (doc: any) => {
    db.remove(doc, retrigger)
  }
}
