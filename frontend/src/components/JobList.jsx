import React, {useEffect, useState} from 'react'
import { fetchJobs, searchJobs, deleteJob } from '../api'

export default function JobList(){
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [company, setCompany] = useState('')

  async function load(){
    const data = await fetchJobs()
    setJobs(data)
  }

  useEffect(()=>{ load() }, [])

  async function onSearch(e){
    e.preventDefault()
    const data = await searchJobs({query: q || undefined, company: company || undefined})
    setJobs(data)
  }

  async function onDelete(id){
    await deleteJob(id)
    load()
  }

  return (
    <div>
      <form onSubmit={onSearch} className="search">
        <input placeholder="Search title" value={q} onChange={e=>setQ(e.target.value)} />
        <input placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} />
        <button type="submit">Search</button>
        <button type="button" onClick={load}>Reset</button>
      </form>

      <ul className="jobs">
        {jobs.map(j => (
          <li key={j.id}>
            <div className="row">
              <div>
                <strong>{j.title}</strong> <span className="muted">@{j.company}</span>
                <div className="desc">{j.description}</div>
                <div className="meta">{j.location} • created: {j.created_at}</div>
              </div>
              <div className="actions">
                <button onClick={()=>onDelete(j.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
