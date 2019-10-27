import React from 'react'
import styled from 'styled-components'
import TaskRow from '../TaskRow'
import TaskInput, { useTaskInput } from '../TaskInput'

const TaskInputDashboard: React.FC = () => {
  const taskInput = useTaskInput()

  return (
    <React.Fragment>
      <TaskInput {...taskInput} />
      <Rows show={taskInput.expand}>
        <TaskRow />
        <TaskRow />
        <TaskRow />
      </Rows>
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
