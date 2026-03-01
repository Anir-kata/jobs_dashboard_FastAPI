const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function fetchJobs(params){
  const url = new URL(BASE + '/jobs/')
  Object.entries(params||{}).forEach(([k,v]) => { if(v!==undefined) url.searchParams.append(k, v) })
  const res = await fetch(url)
  return res.json()
}

export async function createJob(data){
  const res = await fetch(BASE + '/jobs/', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
  return res.json()
}

export async function bulkCreate(jobs){
  const res = await fetch(BASE + '/jobs/bulk', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(jobs)})
  return res.json()
}

export async function searchJobs(params){
  const url = new URL(BASE + '/jobs/search')
  Object.entries(params||{}).forEach(([k,v]) => { if(v!==undefined) url.searchParams.append(k, v) })
  const res = await fetch(url)
  return res.json()
}

export async function updateJob(id, data){
  const res = await fetch(BASE + `/jobs/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
  return res.json()
}

export async function deleteJob(id){
  const res = await fetch(BASE + `/jobs/${id}`, {method:'DELETE'})
  return res.json()
}
