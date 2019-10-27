import React, { useRef, useState } from 'react'
import styled from 'styled-components'

export type ITaskInputDetail = {
  show: boolean
}
const TaskInputDetail: React.FC<ITaskInputDetail> = props => {
  return (
    <Container show={props.show}>
      <DescriptionInput />
      <InputDetailRow>
        <InputDetailLabel>duration</InputDetailLabel>
        <InputDetailInput />
      </InputDetailRow>
      <InputDetailRow>
        <InputDetailLabel>tags</InputDetailLabel>
        <InputDetailInput />
      </InputDetailRow>
      <Button>Add Checkin</Button>
    </Container>
  )
}

const Container = styled.div<{ show: boolean }>`
  background-color: #f6f6f6;
  border-radius: 4px;
  height: 160px;
  margin: 8px 0;
  padding: 4px;
  text-align: center;
  transition: transform 0.2s;
  transform: scale3d(0, 0, 0) translateY(200px);
  transform-origin: top;
  ${props =>
    props.show &&
    `
    transform: scale3d(1,1,1) translateY(0);
  `}
`

const DescriptionInput = styled.input`
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  border-bottom: 1px solid;
  border-color: #dedede;
  outline: 0;
  font-size: 18px;
  font-weight: 500;
  padding: 8px;
  width: 100%;
`

const InputDetailRow = styled.div`
  display: grid;
  padding: 8px;
  grid-template-columns: 80px auto;
`

const InputDetailLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  text-align: right;
`

const InputDetailInput = styled.input`
  align-self: end;
  background: none;
  border: 0;
  font-size: 14px;
  margin-left: 8px;
`

const Button = styled.button`
  background: #00a0ff;
  border: 0;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin: 0 auto;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 400;
  &:active,
  &:focus {
    background: #0090e9;
  }
`

export default TaskInputDetail