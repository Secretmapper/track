import React, { Suspense } from 'react'
import styled from 'styled-components'
import TaskTag from '../TaskTag'
import { useTaskStats } from '../../hooks/db'
import { msToMinutes, msToHours } from '../../utils/time'

import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory'

const TaskStats: React.FC = () => {
  return (
    <Container>
      <TaskStatsDate>Oct 7 - Oct 11</TaskStatsDate>
      <HeatmapContainer />
      <Suspense fallback=''>
        <TaskList />
      </Suspense>
    </Container>
  )
}

const TaskList: React.FC = () => {
  const [stats, tags] = useTaskStats()

  return (
    <div>
      <VictoryChart domainPadding={{ x: 50 }}>
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
            <React.Fragment>
              <TaskTag>{tag}</TaskTag>
              <TaskTagTime>
                {msToHours(value)}h {msToMinutes(value)}m
              </TaskTagTime>
            </React.Fragment>
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

const TaskTagTime = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

export default TaskStats
