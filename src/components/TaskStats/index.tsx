import React from 'react'
import styled from 'styled-components'
import TaskTag from '../TaskTag'

const TaskStats: React.FC = () => {
  return (
    <Container>
      <TaskStatsDate>Oct 7 - Oct 11</TaskStatsDate>
      <HeatmapContainer />
      <div>
        <TaskTag>piano</TaskTag>
        <TaskTagTime>16 hrs</TaskTagTime>
      </div>
    </Container>
  )
}

const Container = styled.div``

const HeatmapContainer = styled.div``

const TaskStatsDate = styled.h2`
  margin-top: 8px;
`

const TaskTagTime = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

export default TaskStats
