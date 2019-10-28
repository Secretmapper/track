import React, { useState, Suspense } from 'react'
import styled from 'styled-components'
import Calendar from 'react-calendar'
import TaskInputDetail, { useTaskInputDetail } from '../TaskInputDetail'
import TaskRow from '../TaskRow'
import TaskInput, { useTaskInput } from '../TaskInput'
import { useDeleteTask, useSaveTask, dateForDb } from '../../hooks/db'

import { useFind } from 'react-pouchdb'

type ITasks = {
  date: Date
}
const Tasks: React.FC<ITasks> = props => {
  const docs = useFind({
    selector: { date: { $eq: dateForDb(props.date) } }
  })
  const [activeId, setActiveId] = useState<string>('')
  const saveTask: ReturnType<typeof useSaveTask> = useSaveTask()
  const removeTask = useDeleteTask()
  const onClearActive = () => {
    setActiveId('')
  }

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
        <EditableTaskInputDetail
          doc={doc}
          description={doc.title}
          duration={doc.duration}
          tags={doc.tags}
          onClearActive={onClearActive}
          onSave={saveTask}
          onDelete={() => {
            removeTask(doc)
          }}
        />
      )}
    </React.Fragment>
  ))
}

const EditableTaskInputDetail = (props: any) => {
  const { title, duration, tags, ...taskInputDetail } = useTaskInputDetail(
    props.description,
    props.duration,
    props.tags
  )
  const [date] = useState(() => {
    const [y, m, d] = props.doc.date

    return new Date(y, parseInt(m, 10) - 1, d)
  })

  return (
    <TaskInputDetail
      flush
      description={title}
      duration={duration}
      tags={tags}
      {...taskInputDetail}
      show={true}
      label='Save'
      onAddCheckin={() => {
        props.onSave(title, duration, tags, date, props.doc)
        props.onClearActive()
      }}
      onDelete={props.onDelete}
    />
  )
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
