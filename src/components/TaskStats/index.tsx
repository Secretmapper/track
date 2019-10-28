import React, { Suspense, useState } from 'react'
import styled from 'styled-components'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { addWeeks } from 'date-fns'
import colorHash from '../../utils/colorHash'
import TaskTag from '../TaskTag'
import { useTaskStats } from '../../hooks/db'
import { msToMinutes, msToHours } from '../../utils/time'

import { VictoryChart, VictoryStack, VictoryBar } from 'victory'

const TaskStats: React.FC = () => {
  const [endDate, setEndDate] = useState(new Date())
  const [startDate, setStartDate] = useState(addWeeks(endDate, -1))

  return (
    <Container>
      <DateRangePicker
        onChange={(date: [Date, Date]) => {
          setStartDate(date[0])
          setEndDate(date[1])
        }}
        value={[startDate, endDate]}
      />
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
  const [stats, tags, interval] = useTaskStats(props.startDate, props.endDate)

  console.log(stats, tags, interval)
  return (
    <div>
      <ChartContainer>
        <VictoryChart>
          <VictoryStack domainPadding={{ x: 25 }} style={victoryStyles}>
            <VictoryBar data={interval} />
            {Object.keys(stats).map(tag => (
              <VictoryBar
                key={tag}
                data={stats[tag]}
                barWidth={3}
                style={barStyles(tag)}
              />
            ))}
          </VictoryStack>
        </VictoryChart>
      </ChartContainer>
      {tags.map(({ value, tag }) => (
        <div key={tag}>
          {tag && (
            <TaskTagRow>
              <TaskTag label={tag} />
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
const barStyles = (tag: string) => ({
  data: { fill: colorHash.hex(tag) }
})

const Container = styled.div``

const ChartContainer = styled.div`
  max-width: 600px;
`

const HeatmapContainer = styled.div``

const TaskTagRow = styled.div`
  margin-bottom: 4px;
`

const TaskTagTime = styled.span`
  margin-left: 8px;
  font-weight: bold;
`

export default TaskStats
