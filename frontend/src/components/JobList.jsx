import React, {useEffect, useState} from 'react'
import { fetchJobs, searchJobs, deleteJob } from '../api'

export default function JobList(){
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  function getMessage(error){
    if (error?.message) return error.message
    return 'Request failed. Please try again.'
  }

  async function load(){
    setErrorMsg('')
    setLoading(true)
    try {
      const data = await fetchJobs()
      setJobs(data)
    } catch (error) {
      setErrorMsg(getMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function onSearch(e){
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const data = await searchJobs({query: q || undefined, company: company || undefined})
      setJobs(data)
    } catch (error) {
      setErrorMsg(getMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id){
    if (!window.confirm('Delete this job?')) return
    setErrorMsg('')
    try {
      await deleteJob(id)
      await load()
    } catch (error) {
      setErrorMsg(getMessage(error))
    }
  }

  return (
    <div className="space-y-5">
      {errorMsg && <p className="alert-box alert-error">{errorMsg}</p>}
      <form onSubmit={onSearch} className="search-wrap">
        <input
          className="input-field flex-1 min-w-[200px]"
          placeholder="Search by title..."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <input
          className="input-field flex-1 min-w-[200px]"
          placeholder="Filter by company..."
          value={company}
          onChange={e=>setCompany(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" onClick={load} className="btn-secondary">Reset</button>
      </form>

      {loading && (
        <div className="empty-state text-center py-10">
          <p className="text-slate-200">Loading jobs...</p>
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="empty-state text-center py-10">
          <p className="text-slate-200">No jobs found. Try creating one!</p>
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((j, idx) => (
          <div
            key={j.id}
            className="job-card"
            style={{animationDelay: `${idx * 60}ms`}}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg leading-tight">{j.title}</h3>
                {j.company && (
                  <p className="text-sm text-cyan-300 font-medium mt-1">{j.company}</p>
                )}
                {j.description && (
                  <p className="text-sm text-slate-200/90 mt-2">{j.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-300">
                  {j.location && <span className="pill-data">{j.location}</span>}
                  {j.created_at && (
                    <span className="pill-data">Created: {new Date(j.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <button
                onClick={()=>onDelete(j.id)}
                className="btn-danger ml-4 whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
