import React, { Suspense } from 'react'
import styled from 'styled-components'
import { addWeeks, format } from 'date-fns'
import TaskTag from '../TaskTag'
import { useTaskStats } from '../../hooks/db'
import { msToMinutes, msToHours } from '../../utils/time'

import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory'

const TaskStats: React.FC = () => {
  const endDate = new Date()
  const startDate = addWeeks(endDate, -1)
  const startDateLabel = format(startDate, 'LLL dd, yyyy')
  const endDateLabel = format(endDate, 'LLL dd, yyyy')

  return (
    <Container>
      <TaskStatsDate>
        {startDateLabel} - {endDateLabel}
      </TaskStatsDate>
      <HeatmapContainer />
      <Suspense fallback=''>
        <TaskList startDate={startDate} endDate={endDate} />
      </Suspense>
    </Container>
  )
}

type ITaskList = {
  startDate: Date
  endDate: Date
}

const TaskList: React.FC<ITaskList> = props => {
  const [stats, tags] = useTaskStats(props.startDate, props.endDate)

  return (
    <div>
      <VictoryChart domainPadding={{ x: 50 }} scale={{ x: 'time' }}>
        <VictoryStack
          colorScale={['gold', 'orange', 'tomato']}
          style={victoryStyles}
        >
          {Object.keys(stats).map(tag => (
            <VictoryBar key={tag} data={stats[tag]} />
          ))}
        </VictoryStack>
        <VictoryAxis />
      </VictoryChart>
      {tags.map(({ value, tag }) => (
        <div key={tag}>
          {tag && (
            <TaskTagRow>
              <TaskTag>{tag}</TaskTag>
              <TaskTagTime>
                {msToHours(value)}h {msToMinutes(value)}m
              </TaskTagTime>
            </TaskTagRow>
          )}
        </div>
      ))}
    </div>
  )
}

const victoryStyles = {
  data: { width: 30 },
  labels: { padding: -20 }
}

const Container = styled.div``

const HeatmapContainer = styled.div``

const TaskStatsDate = styled.h2`
  margin-top: 8px;
`

const TaskTagRow = styled.div`
  margin-bottom: 4px;
`

const TaskTagTime = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

export default TaskStats
