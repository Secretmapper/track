import React, { Suspense, useState } from 'react'
import styled from 'styled-components'
import { addWeeks } from 'date-fns'
import colorHash from '../../utils/colorHash'
import TaskTag from '../TaskTag'
import { useTaskStats } from '../../hooks/db'
import { msToMinutes, msToHours } from '../../utils/time'

import { VictoryPie } from 'victory'

const TaskStats: React.FC = () => {
  const [endDate] = useState(new Date())
  const [startDate] = useState(addWeeks(endDate, -1))

  return (
    <Container>
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
  const [tags] = useTaskStats(props.startDate, props.endDate)

  // we append this to the label to workaround for
  // https://github.com/FormidableLabs/victory/issues/928
  const c = '​' //zero width character

  return (
    <div>
      <ChartContainer>
        <VictoryPie
          animate={{ duration: 300 }}
          style={barStyles}
          data={tags.map(t => ({
            x: t.key,
            label: `${t.key}${c}`,
            y: t.value
          }))}
        />
      </ChartContainer>
      {tags.map(({ value, key: tag }) => (
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

const barStyles = {
  data: {
    fill: (t: any) => colorHash.hex(t.datum.x)
  }
}

const Container = styled.div``

const ChartContainer = styled.div`
  max-width: 400px;
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
