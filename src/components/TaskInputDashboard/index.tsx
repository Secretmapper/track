import React, { useState, Suspense } from 'react'
import styled from 'styled-components'
import Calendar from 'react-calendar'
import TaskInputDetail from '../TaskInputDetail'
import TaskRow from '../TaskRow'
import TaskInput, { useTaskInput } from '../TaskInput'
import { ISODate } from '../../utils/time'
import { useDeleteTask } from '../../hooks/db'

import { useFind } from 'react-pouchdb'

type ITasks = {
  date: Date
}
const Tasks: React.FC<ITasks> = props => {
  const docs = useFind({
    selector: { date: { $eq: ISODate(props.date).split('-') } }
  })
  const [activeId, setActiveId] = useState<string>('')
  const removeTask = useDeleteTask()

  return docs.map((doc: any) => (
    <React.Fragment key={doc._id}>
      <TaskRow
        key={doc._id}
        title={doc.title}
        tags={doc.tags}
        duration={doc.duration}
        active={doc._id === activeId}
        onActive={() => setActiveId(doc._id)}
      />
      {doc._id === activeId && (
        <TaskInputDetail
          flush
          show={true}
          description={doc.title}
          duration={doc.duration}
          tags={doc.tags}
          label='Save'
          onDelete={() => {
            removeTask(doc)
          }}
        />
      )}
    </React.Fragment>
  ))
}

const TaskInputDashboard: React.FC = () => {
  const [date, setDate] = useState(() => new Date())
  const taskInput = useTaskInput(date)

  return (
    <Container>
      <TaskInput {...taskInput} />
      <Rows show={taskInput.expand}>
        <TaskCalendar
          value={date}
          onChange={date => {
            if (!(date instanceof Array)) {
              setDate(date)
            }
          }}
          maxDate={new Date()}
          minDetail='month'
          prev2Label={null}
          next2Label={null}
        />
        <Suspense fallback=''>
          <Tasks date={date} />
        </Suspense>
      </Rows>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  padding: 8px;
  overflow: auto;
`

const Rows = styled.div<{ show: boolean }>`
  position: relative;
  transform: translate3d(0, 0, 0);
  transition: transform 0.2s;
  ${props =>
    props.show &&
    `
    transform: translate3d(0, 200px, 0);
  `}
`

const TaskCalendar = styled(Calendar)`
  && {
    border: 0;
    width: 100%;
  }

  .react-calendar__navigation button[disabled] {
    background-color: white;
  }
  .react-calendar__navigation__label {
    color: black;
    font-size: 24px;
  }
`

export default TaskInputDashboard
