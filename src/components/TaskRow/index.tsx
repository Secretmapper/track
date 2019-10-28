import React from 'react'
import styled from 'styled-components'
import TaskTag from '../TaskTag'
import { msToMinutes, msToHours } from '../../utils/time'

export type ITaskRow = {
  title: string
  tags: string[]
  duration: number
  active?: boolean
  onActive: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const TaskRow: React.FC<ITaskRow> = props => {
  const minutes = msToMinutes(props.duration)
  const hours = msToHours(props.duration)

  return (
    <Container onClick={props.onActive} active={props.active}>
      <TaskRowMain>
        <TaskRowTitle>{props.title}</TaskRowTitle>
        <TaskTagList tags={props.tags} />
      </TaskRowMain>
      <TaskTime>
        <TaskDuration>
          {hours}hrs {minutes}m
        </TaskDuration>
        <TaskAction>Edit</TaskAction>
      </TaskTime>
    </Container>
  )
}

const TaskTagList: React.FC<{ tags: string[] }> = props => {
  return (
    <React.Fragment>
      {props.tags.map((tag: string) => (
        <TaskTag key={tag}>{tag}</TaskTag>
      ))}
    </React.Fragment>
  )
}

const TaskAction = styled.div`
  color: #404040;
  font-size: 12px;
  text-decoration: none;
`

const Container = styled.div<{ active?: boolean }>`
  border-bottom: 1px solid #efefef;
  cursor: pointer;
  display: grid;
  padding: 8px;
  grid-template-areas: 'main main main main right';
  ${props =>
    props.active &&
    `
    background: #f0f0f0;
  `}
  ${TaskAction} {
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover ${TaskAction} {
    opacity: 1;
  }
`

const TaskRowMain = styled.div`
  grid-area: main;
`

const TaskTime = styled.div`
  grid-area: right;
  text-align: right;
`

const TaskDuration = styled.div`
  padding-bottom: 8px;
`

const TaskRowTitle = styled.div`
  font-size: 16px;
  padding-bottom: 8px;
`

export default TaskRow
