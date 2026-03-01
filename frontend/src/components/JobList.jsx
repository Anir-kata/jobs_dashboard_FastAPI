import React, {useEffect, useState} from 'react'
import { fetchJobs, searchJobs, deleteJob } from '../api'

export default function JobList(){
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)

  async function load(){
    setLoading(true)
    try {
      const data = await fetchJobs()
      setJobs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function onSearch(e){
    e.preventDefault()
    setLoading(true)
    try {
      const data = await searchJobs({query: q || undefined, company: company || undefined})
      setJobs(data)
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id){
    if (!window.confirm('Delete this job?')) return
    await deleteJob(id)
    load()
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={onSearch} className="flex gap-2 flex-wrap">
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

      {/* Jobs List */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No jobs found. Try creating one!</p>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map(j => (
          <div
            key={j.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{j.title}</h3>
                {j.company && (
                  <p className="text-sm text-blue-600 font-medium">{j.company}</p>
                )}
                {j.description && (
                  <p className="text-sm text-gray-600 mt-1">{j.description}</p>
                )}
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  {j.location && <span>{j.location}</span>}
                  {j.created_at && (
                    <span>Created: {new Date(j.created_at).toLocaleDateString()}</span>
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
}
