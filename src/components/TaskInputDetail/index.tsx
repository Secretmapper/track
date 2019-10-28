import React, { useState } from 'react'
import styled from 'styled-components'
import Textarea from 'react-autosize-textarea'
import removeNewlines from '../../utils/removeNewlines'
import {
  msToMinutes,
  msToHours,
  hoursToMs,
  minutesToMs
} from '../../utils/time'

export const useTaskInputDetail = () => {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(0)
  const [tags, setTags] = useState<string[]>([])

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = removeNewlines(e.target!.value)
    setTitle(value)
  }
  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(
      // XXX: this looks a bit weird, because msToMinutes/Hours
      // only converts to whole units (result is floored)
      minutesToMs(msToMinutes(duration)) + hoursToMs(parseInt(e.target.value))
    )
  }
  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(
      hoursToMs(msToHours(duration)) + minutesToMs(parseInt(e.target.value))
    )
  }
  const onTagsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = removeNewlines(e.target!.value)
    setTags(value.split(', '))
  }

  return {
    title,
    setTitle,
    duration,
    setDuration,
    tags,
    setTags,
    onDescriptionChange,
    onHourChange,
    onMinuteChange,
    onTagsChange
  }
}

export type ITaskInputDetail = {
  show: boolean
  flush?: boolean
  label?: string
  description: string
  duration: number
  tags: string[]
  onAddCheckin?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDescriptionChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onHourChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMinuteChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTagsChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
const TaskInputDetail: React.FC<ITaskInputDetail> = props => {
  const minutes = msToMinutes(props.duration)
  const hours = msToHours(props.duration)

  return (
    <Container show={props.show} flush={props.flush}>
      <DescriptionInput
        value={props.description}
        onChange={props.onDescriptionChange}
        rows={1}
        maxRows={4}
      />
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
        <InputDetailInputTags
          placeholder='Add tags'
          value={props.tags.join(', ')}
          onChange={props.onTagsChange}
          rows={1}
          maxRows={3}
        />
      </InputDetailRow>
      <Button onClick={props.onAddCheckin}>
        {props.label || 'Add Checkin'}
      </Button>
      {props.onDelete && (
        <Button onClick={props.onDelete} variant='delete'>
          Delete
        </Button>
      )}
    </Container>
  )
}

const Container = styled.div<{ show: boolean; flush?: boolean }>`
  background-color: #f6f6f6;
  border-radius: 4px;
  height: 200px;
  margin: 8px 0;
  padding: 4px;
  position: absolute;
  text-align: center;
  transition: transform 0.2s;
  transform: scale3d(0, 0, 0) translateY(200px);
  transform-origin: top;
  width: 100%;
  ${props =>
    props.flush &&
    `
    position: relative;
  `}
  ${props =>
    props.show &&
    `
    transform: scale3d(1,1,1) translateY(0);
  `}
`

const DescriptionInput = styled(Textarea)`
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

const InputDetailInputTags = styled(Textarea)`
  align-self: end;
  background: none;
  border: 0;
  font-size: 14px;
  margin-left: 8px;
  resize: none;
  width: 100%;
`

const InputDetailDurInput = styled(InputDetailInput)`
  width: 50%;
`

const Button = styled.button<{ variant?: string }>`
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
  ${props =>
    props.variant === 'delete' &&
    `
    margin-left: 8px;
    background: #ff4000;
    &:active,
    &:focus {
      background: #e90000;
    }
  `}
`

export default TaskInputDetail
