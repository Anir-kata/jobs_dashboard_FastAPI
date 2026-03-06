import React, {useState} from 'react'
import { createJob, bulkCreate } from '../api'

export default function JobForm(){
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  function getMessage(error){
    if (error?.message) return error.message
    return 'Request failed. Please try again.'
  }

  async function onSubmit(e){
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await createJob({title, company, description: desc})
      setTitle(''); setCompany(''); setDesc('')
      window.dispatchEvent(new Event('jobs:reload'))
      setSuccessMsg('Job created successfully.')
    } catch (error) {
      setErrorMsg(getMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function onBulk(){
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      const jobs = [
        {title: 'Senior Backend Engineer', company: 'TechCorp', description: 'Build scalable APIs'},
        {title: 'Product Manager', company: 'StartupXYZ', description: 'Lead product strategy'}
      ]
      await bulkCreate(jobs)
      window.dispatchEvent(new Event('jobs:reload'))
      setSuccessMsg('Sample jobs added successfully.')
    } catch (error) {
      setErrorMsg(getMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
      {errorMsg && <p className="alert-box alert-error">{errorMsg}</p>}
      {successMsg && <p className="alert-box alert-success">{successMsg}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input-field"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Title"
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
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onBulk}
          disabled={loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Add Sample Jobs'}
        </button>
      </div>
    </form>
  )
}
