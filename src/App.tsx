import React from 'react'
import Layout from './components/Layout'
import TaskInputDashboard from './components/TaskInputDashboard'
import TaskStats from './components/TaskStats'

const App: React.FC = () => {
  return <Layout aside={<TaskInputDashboard />} main={<TaskStats />} />
}

export default App
