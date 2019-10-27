import React from 'react'
import styled from 'styled-components'

const TaskInput: React.FC = () => {
  return (
    <Container>
      <Input />
      <TaskInputAddButton>+</TaskInputAddButton>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const Input = styled.input`
  background-color: #efefef;
  border: 0;
  border-radius: 4px;
  outline: 0;
  font-size: 20px;
  padding: 8px;
  width: 100%;
  &:active,
  &:focus {
    background-color: #e0e0e0;
  }
`

const TaskInputAddButton = styled.button`
  background-color: #484848;
  border-radius: 4px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 30px;
  height: 40px;
  position: absolute;
  padding-bottom: 4px;
  right: 0;
  width: 40px;
  &:focus,
  &:hover {
    background-color: #343434;
  }
  &:active {
    background-color: #121212;
  }
`

export default TaskInput
