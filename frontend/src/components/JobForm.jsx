import React, {useState} from 'react'
import { createJob, bulkCreate } from '../api'

export default function JobForm(){
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [desc, setDesc] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    await createJob({title, company, description: desc})
    setTitle(''); setCompany(''); setDesc('')
    window.dispatchEvent(new Event('jobs:reload'))
  }

  async function onBulk(){
    const jobs = [
      {title: 'Bulk A', company: 'CoA'},
      {title: 'Bulk B', company: 'CoB'}
    ]
    await bulkCreate(jobs)
    window.dispatchEvent(new Event('jobs:reload'))
  }

  return (
    <form onSubmit={onSubmit} className="jobform">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" />
      <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" />
      <button type="submit">Create</button>
      <button type="button" onClick={onBulk}>Bulk Add</button>
    </form>
  )
}
