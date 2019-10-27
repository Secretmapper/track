import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import Textarea from 'react-autosize-textarea'
import TaskInputDetail from '../TaskInputDetail'
import parse from '../../utils/parser'
import {
  msToMinutes,
  msToHours,
  hoursToMs,
  minutesToMs
} from '../../utils/time'

export const useTaskInput = (cb: Function) => {
  const inputEl = useRef<HTMLTextAreaElement>(null)
  const [isInputFocused, setInputFocused] = useState(false)
  const onTriggerAdd = () => {
    if (inputEl.current) {
      inputEl.current!.focus()
    }
  }

  const onInputFocus = () => {
    setInputFocused(true)
  }
  const onInputBlur = () => {
    setInputFocused(false)
  }

  const [inputText, setInputText] = useState('')
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(0)

  const onChangeInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // remove newlines
    const value = e.target!.value.replace(/(\r\n|\n|\r)/gm, '')
    setInputText(value)
    const parsed = parse(value)

    setTitle(parsed.text)
    if (parsed.duration > 0) {
      setDuration(parsed.duration)
    }
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
  const reset = () => {
    setInputFocused(false)
    setInputText('')
    setTitle('')
    setDuration(0)
  }
  const onAddCheckin = () => {
    cb(title, duration, [], new Date().toISOString(), reset)
  }

  return {
    expand: inputText.length > 0,
    inputEl,
    isInputFocused,
    onTriggerAdd,
    onInputFocus,
    onInputBlur,
    inputText,
    onChangeInputText,
    onHourChange,
    onMinuteChange,
    onAddCheckin,

    taskDescription: title,
    taskDuration: duration
  }
}

export type ITaskInput = {
  expand: boolean
  inputEl: React.RefObject<HTMLTextAreaElement>
  inputText: string
  isInputFocused: boolean
  onChangeInputText: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onInputBlur: (event: any) => void
  onInputFocus: (event: any) => void
  onTriggerAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
  onAddCheckin: (event: React.MouseEvent<HTMLButtonElement>) => void
  onHourChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMinuteChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  taskDescription: string
  taskDuration: number
}

const TaskInput: React.FC<ITaskInput> = props => {
  return (
    <Container>
      <InputRow>
        <Input
          value={props.inputText}
          ref={props.inputEl}
          onChange={props.onChangeInputText}
          onFocus={props.onInputFocus}
          onBlur={props.onInputBlur}
          show={props.expand}
          rows={1}
          maxRows={4}
        />
        <TaskInputAddButton
          show={!props.isInputFocused && !props.expand}
          onClick={props.onTriggerAdd}
          tabIndex={-1}
        >
          +
        </TaskInputAddButton>
      </InputRow>
      <TaskInputDetail
        show={props.expand}
        description={props.taskDescription}
        duration={props.taskDuration}
        onAddCheckin={props.onAddCheckin}
        onHourChange={props.onHourChange}
        onMinuteChange={props.onMinuteChange}
      />
    </Container>
  )
}

type IShowable = {
  readonly show: boolean
}

const Container = styled.div`
  position: relative;
`

const InputRow = styled.div`
  position: relative;
`

const Input = styled(Textarea)<IShowable>`
  background-color: #efefef;
  border: 0;
  border-radius: 4px;
  outline: 0;
  font-size: 20px;
  font-family: inherit;
  padding: 8px;
  resize: none;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s;
  width: 100%;
  ${props =>
    props.show &&
    `
    transform: scaleX(1);
  `};
  &:active,
  &:focus {
    transform: scaleX(1);
    background-color: #e0e0e0;
  }
`

const TaskInputAddButton = styled.button<IShowable>`
  background-color: #484848;
  border-radius: 4px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 30px;
  height: 40px;
  opacity: ${props => (props.show ? 1 : 0)};
  ${props =>
    !props.show &&
    `
    pointer-events: none;
  `}
  padding-bottom: 4px;
  position: absolute;
  right: 0;
  width: 40px;
  transition: opacity 0.2s;
  &:focus,
  &:hover {
    background-color: #343434;
  }
  &:active {
    background-color: #121212;
  }
`

export default TaskInput
