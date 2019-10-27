import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import TaskInputDetail from '../TaskInputDetail'

const TaskInput: React.FC = () => {
  const inputEl = useRef<HTMLInputElement>(null)
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
  const onChangeInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target!.value)
  }

  return (
    <Container>
      <InputRow>
        <Input
          value={inputText}
          onChange={onChangeInputText}
          ref={inputEl}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
        <TaskInputAddButton show={!isInputFocused} onClick={onTriggerAdd}>
          +
        </TaskInputAddButton>
      </InputRow>
      <TaskInputDetail show={inputText.length > 0} />
    </Container>
  )
}

const Container = styled.div``

const InputRow = styled.div`
  position: relative;
`

const Input = styled.input`
  background-color: #efefef;
  border: 0;
  border-radius: 4px;
  outline: 0;
  font-size: 20px;
  padding: 8px;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s;
  width: 100%;
  &:active,
  &:focus {
    transform: scaleX(1);
    background-color: #e0e0e0;
  }
`

type IShowable = {
  readonly show: boolean
}

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
