import React from 'react'
import styled from 'styled-components'
import { msToMinutes, msToHours } from '../../utils/time'

export type ITaskInputDetail = {
  show: boolean
  description: string
  duration: number
  onAddCheckin: (event: React.MouseEvent<HTMLButtonElement>) => void
  onHourChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMinuteChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const TaskInputDetail: React.FC<ITaskInputDetail> = props => {
  const minutes = msToMinutes(props.duration)
  const hours = msToHours(props.duration)

  return (
    <Container show={props.show}>
      <DescriptionInput value={props.description} />
      <InputDetailRow>
        <InputDetailLabel>duration</InputDetailLabel>
        <div>
          <InputDetailDurInput
            value={hours}
            onChange={props.onHourChange}
            placeholder='Add tags'
            type='number'
            min='0'
            max='60'
          />{' '}
          hrs
        </div>
        <div>
          <InputDetailDurInput
            value={minutes}
            onChange={props.onMinuteChange}
            type='number'
            min='0'
            max='59'
          />{' '}
          min
        </div>
      </InputDetailRow>
      <InputDetailRow>
        <InputDetailLabel>tags</InputDetailLabel>
        <InputDetailInput placeholder='Add tags' />
      </InputDetailRow>
      <Button onClick={props.onAddCheckin}>Add Checkin</Button>
    </Container>
  )
}

const Container = styled.div<{ show: boolean }>`
  position: absolute;
  background-color: #f6f6f6;
  border-radius: 4px;
  height: 200px;
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

const DescriptionInput = styled.textarea`
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  border-bottom: 1px solid;
  border-color: #dedede;
  outline: 0;
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  resize: none;
  padding: 8px;
  width: 100%;
`

const InputDetailRow = styled.div`
  display: grid;
  padding: 8px;
  grid-template-columns: 80px auto auto;
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

const InputDetailDurInput = styled(InputDetailInput)`
  width: 50%;
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
