import React, { useContext, useEffect, useState } from 'react'
import { useDB } from 'react-pouchdb'
import { ISODate } from '../../utils/time'
import ld from 'lodash'

type TaskStat = { x: string | number; y: number; tag: string; label: string }
export type ITaskStats = [Array<{ value: number; key: string }>]
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
      date: dateForDb(date)
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
              emit(doc.tags[i], doc.duration)
            }
          },
          reduce: '_sum'
        },
        {
          group: true,
          reduce: true,
          sort: ['value']
        }
      )
      result.rows.sort((a: any, b: any) => b.value - a.value)
      setResult(result)
    }

    query()
  }, [value, startDate, endDate, db])
  const tags = result ? result.rows : []

  return [tags]
}

export const useDeleteTask = () => {
  const db = useDB('tasks')
  const { retrigger } = useContext(TasksKeyContext)

  return (doc: any) => {
    db.remove(doc, retrigger)
  }
}

export const dateForDb = (date: Date) =>
  ISODate(date)
    .split('-')
    .map(d => d.padStart(2, '0'))
