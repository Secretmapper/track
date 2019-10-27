import React, { useMemo } from 'react'
import PouchDB from 'pouchdb'
import Layout from './components/Layout'
import TaskInputDashboard from './components/TaskInputDashboard'
import TaskStats from './components/TaskStats'

const App: React.FC = () => {
  useMemo(() => new PouchDB('tasks'), [])
  return <Layout aside={<TaskInputDashboard />} main={<TaskStats />} />
}

export default App
