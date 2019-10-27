import React from 'react'
import styled from 'styled-components'
import TaskTag from '../TaskTag'
import { msToMinutes, msToHours } from '../../utils/time'

export type ITaskRow = {
  title: string
  tags: string[]
  duration: number
}

const TaskRow: React.FC<ITaskRow> = props => {
  const minutes = msToMinutes(props.duration)
  const hours = msToHours(props.duration)

  return (
    <Container>
      <TaskRowMain>
        <TaskRowTitle>{props.title}</TaskRowTitle>
        <TaskTagList />
      </TaskRowMain>
      <TaskTime>
        {hours}hrs {minutes}m
      </TaskTime>
    </Container>
  )
}

const TaskTagList: React.FC = () => {
  return <TaskTag>piano</TaskTag>
}

const Container = styled.div`
  border-bottom: 1px solid #efefef;
  display: grid;
  padding: 8px;
  grid-template-areas: 'main main main main right';
`

const TaskRowMain = styled.div`
  grid-area: main;
`

const TaskTime = styled.div`
  grid-area: right;
  text-align: right;
`

const TaskRowTitle = styled.div`
  font-size: 16px;
  padding-bottom: 8px;
`

export default TaskRow
