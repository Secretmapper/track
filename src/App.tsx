import React, { useCallback, useState } from 'react'
import { PouchDB } from 'react-pouchdb'
import Layout from './components/Layout'
import TaskInputDashboard from './components/TaskInputDashboard'
import TaskStats from './components/TaskStats'
import { TasksKeyContext } from './hooks/db'

const App: React.FC = () => {
  const [value, setValue] = useState(0)
  const retrigger = useCallback(() => {
    setValue(v => v + 1)
  }, [setValue])

  return (
    <TasksKeyContext.Provider value={{ value, retrigger }}>
      <PouchDB name='tasks'>
        <Layout aside={<TaskInputDashboard />} main={<TaskStats />} />
      </PouchDB>
    </TasksKeyContext.Provider>
  )
}

export default App
