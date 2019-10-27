import React from 'react'
import Layout from './components/Layout'
import TaskRow from './components/TaskRow'
import TaskStats from './components/TaskStats'
import TaskInput from './components/TaskInput'

const App: React.FC = () => {
  return (
    <Layout
      aside={
        <React.Fragment>
          <TaskInput />
          <TaskRow />
          <TaskRow />
          <TaskRow />
        </React.Fragment>
      }
      main={<TaskStats />}
    />
  )
}

export default App
