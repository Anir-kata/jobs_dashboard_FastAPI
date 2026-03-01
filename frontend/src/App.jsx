import React from 'react'
import JobList from './components/JobList'
import JobForm from './components/JobForm'

export default function App(){
  return (
    <div className="container">
      <h1>Job Board</h1>
      <JobForm />
      <hr />
      <JobList />
    </div>
  )
}
