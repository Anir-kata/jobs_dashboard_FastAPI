import React, {useState} from 'react'
import { createJob, bulkCreate } from '../api'

export default function JobForm(){
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    try {
      await createJob({title, company, description: desc})
      setTitle(''); setCompany(''); setDesc('')
      window.dispatchEvent(new Event('jobs:reload'))
      alert('Job created!')
    } finally {
      setLoading(false)
    }
  }

  async function onBulk(){
    setLoading(true)
    try {
      const jobs = [
        {title: 'Senior Backend Engineer', company: 'TechCorp', description: 'Build scalable APIs'},
        {title: 'Product Manager', company: 'StartupXYZ', description: 'Lead product strategy'}
      ]
      await bulkCreate(jobs)
      window.dispatchEvent(new Event('jobs:reload'))
      alert('Bulk jobs added!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input-field"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Job title"
          required
        />
        <input
          className="input-field"
          value={company}
          onChange={e=>setCompany(e.target.value)}
          placeholder="Company name"
        />
      </div>
      <input
        className="input-field"
        value={desc}
        onChange={e=>setDesc(e.target.value)}
        placeholder="Description"
      />
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
        <button
          type="button"
          onClick={onBulk}
          disabled={loading}
          className="btn-secondary disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Add Sample Jobs'}
        </button>
      </div>
    </form>
  )
}
