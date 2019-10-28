import React from 'react'
import styled from 'styled-components'
import colorHash from '../../utils/colorHash'

const TaskTag: React.FC<{ label: string }> = props => {
  return <Container color={colorHash.hex(props.label)}>{props.label}</Container>
}

const Container = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  border-radius: 8px;
  color: white;
  content: 'label';
  font-size: 12px;
  margin-right: 4px;
  padding: 2px 4px;
  user-select: none;
`

export default TaskTag
