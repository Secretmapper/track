import React from 'react'
import Layout from './components/Layout'
import TaskInputDashboard from './components/TaskInputDashboard'
import TaskStats from './components/TaskStats'
import { DBProvider } from './hooks/db'

const App: React.FC = () => {
  return (
    <DBProvider>
      <Layout aside={<TaskInputDashboard />} main={<TaskStats />} />
    </DBProvider>
  )
}

export default App
