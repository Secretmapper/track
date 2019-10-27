import React, { Suspense } from 'react'
import styled from 'styled-components'
import TaskRow from '../TaskRow'
import TaskInput, { useTaskInput } from '../TaskInput'

import { PouchDB, useDB, useFind } from 'react-pouchdb'

const Tasks: React.FC = () => {
  const docs = useFind({
    selector: { date: { $gte: '2019-10-27', $lte: '2019-10-28' } }
  })

  return docs.map((doc: any) => (
    <TaskRow
      key={doc._id}
      title={doc.title}
      tags={doc.tags}
      duration={doc.duration}
    />
  ))
}

const TaskInputDashboard: React.FC = () => {
  const db = useDB('tasks')
  const taskInput = useTaskInput(
    (
      title: string,
      duration: number,
      tags: string[],
      date: string,
      reset: Function
    ) => {
      db.post({ title, duration, tags, date })
      reset()
    }
  )

  return (
    <React.Fragment>
      <PouchDB name='tasks'>
        <TaskInput {...taskInput} />
        <Rows show={taskInput.expand}>
          <Suspense fallback=''>
            <Tasks />
          </Suspense>
        </Rows>
      </PouchDB>
    </React.Fragment>
  )
}

const Rows = styled.div<{ show: boolean }>`
  position: relative;
  transform: translate3d(0, -160px, 0);
  transition: transform 0.2s;
  ${props =>
    props.show &&
    `
    transform: translate3d(0, 0, 0);
  `}
`

export default TaskInputDashboard
