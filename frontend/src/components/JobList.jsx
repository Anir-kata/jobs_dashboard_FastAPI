import React, {useEffect, useState} from 'react'
import { fetchJobs, searchJobs, deleteJob, importJobs } from '../api'

export default function JobList(){
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  function getMessage(error){
    if (error?.message) return error.message
    return 'La requete a echoue. Veuillez reessayer.'
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

  async function onImportInternet(){
    setErrorMsg('')
    setSuccessMsg('')
    setImporting(true)
    try {
      const imported = await importJobs({query: q || undefined, limit: 10})
      await load()
      setSuccessMsg(`${imported.length} Offres importees.`)
    } catch (error) {
      setErrorMsg(getMessage(error))
    } finally {
      setImporting(false)
    }
  }

  useEffect(()=>{
    load()
    const onReload = () => load()
    window.addEventListener('emplois:recharger', onReload)
    return () => window.removeEventListener('emplois:recharger', onReload)
  }, [])

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
    if (!window.confirm('Supprimer cet emploi ?')) return
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
      {successMsg && <p className="alert-box alert-success">{successMsg}</p>}
      <form onSubmit={onSearch} className="search-wrap">
        <input
          className="input-field flex-1 min-w-[200px]"
          placeholder="Rechercher par titre..."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <input
          className="input-field flex-1 min-w-[200px]"
          placeholder="Filtrer par entreprise..."
          value={company}
          onChange={e=>setCompany(e.target.value)}
        />
        <button type="submit" className="btn-primary">Rechercher</button>
        <button
          type="button"
          onClick={onImportInternet}
          disabled={importing || loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing ? 'Import en cours...' : 'Importer depuis Internet'}
        </button>
        <button type="button" onClick={load} className="btn-secondary">Reinitialiser</button>
      </form>

      {loading && (
        <div className="empty-state text-center py-10">
          <p className="text-slate-200">Chargement des emplois...</p>
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="empty-state text-center py-10">
          <p className="text-slate-200">Aucun emploi trouve. Essayez d'en creer un !</p>
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
                    <span className="pill-data">Cree le : {new Date(j.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <button
                onClick={()=>onDelete(j.id)}
                className="btn-danger ml-4 whitespace-nowrap"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
