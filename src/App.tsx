import React from 'react'
import { PouchDB } from 'react-pouchdb'
import Layout from './components/Layout'
import TaskInputDashboard from './components/TaskInputDashboard'
import TaskStats from './components/TaskStats'

const App: React.FC = () => {
  return (
    <PouchDB name='tasks'>
      <Layout aside={<TaskInputDashboard />} main={<TaskStats />} />
    </PouchDB>
  )
}

export default App
