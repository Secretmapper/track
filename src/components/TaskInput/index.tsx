import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import Textarea from 'react-autosize-textarea'
import TaskInputDetail, { useTaskInputDetail } from '../TaskInputDetail'
import parse from '../../utils/parser'
import { useSaveTask } from '../../hooks/db'

export const useTaskInput = (date: Date) => {
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
  const {
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
  } = useTaskInputDetail()

  const onChangeInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // remove newlines
    const value = e.target!.value.replace(/(\r\n|\n|\r)/gm, '')
    setInputText(value)
    const parsed = parse(value)

    const hashregex = /(^|\s)(#[a-zA-Z\d-]+)/g
    const matched = parsed.text.match(hashregex)

    if (matched) {
      setTags(matched.map(s => s.trim().slice(1)).filter(s => s.length > 0))
    }

    const title = parsed.text.replace(hashregex, '')

    setTitle(title)
    if (parsed.duration > 0) {
      setDuration(parsed.duration)
    }
  }

  const reset = () => {
    setInputFocused(false)
    setInputText('')
    setTitle('')
    setDuration(0)
    setTags([])
  }
  const saveTask = useSaveTask()
  const onAddCheckin = () => {
    saveTask(title, duration, tags, date)
    reset()
  }

  return {
    expand: inputText.length > 0,
    inputEl,
    isInputFocused,
    onTriggerAdd,
    onInputFocus,
    onInputBlur,
    inputText,
    onDescriptionChange,
    onChangeInputText,
    onHourChange,
    onMinuteChange,
    onTagsChange,
    onAddCheckin,

    taskTags: tags,
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
  onTagsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void

  taskTags: string[]
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
          show={props.expand ? true : undefined}
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
        tags={props.taskTags}
        onAddCheckin={props.onAddCheckin}
        onDescriptionChange={props.onDescriptionChange}
        onHourChange={props.onHourChange}
        onMinuteChange={props.onMinuteChange}
        onTagsChange={props.onTagsChange}
      />
    </Container>
  )
}

type IShowable = {
  readonly show?: boolean
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
