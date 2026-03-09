const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function parseResponse(res){
  const contentType = res.headers.get('content-type') || ''
  let payload = null

  if (contentType.includes('application/json')) {
    payload = await res.json()
  } else {
    const text = await res.text()
    payload = text ? {detail: text} : null
  }

  if (!res.ok) {
    const message = payload?.detail || payload?.message || `HTTP ${res.status}`
    const error = new Error(message)
    error.status = res.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function fetchJobs(params){
  const url = new URL(BASE + '/emplois/')
  Object.entries(params||{}).forEach(([k,v]) => { if(v!==undefined) url.searchParams.append(k, v) })
  const res = await fetch(url)
  return parseResponse(res)
}

export async function createJob(data){
  const res = await fetch(BASE + '/emplois/', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
  return parseResponse(res)
}

export async function bulkCreate(jobs){
  const res = await fetch(BASE + '/emplois/lot', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(jobs)})
  return parseResponse(res)
}

export async function searchJobs(params){
  const url = new URL(BASE + '/emplois/recherche')
  const paramsFrancais = {
    requete: params?.query,
    entreprise: params?.company,
  }
  Object.entries(paramsFrancais).forEach(([k,v]) => { if(v!==undefined) url.searchParams.append(k, v) })
  const res = await fetch(url)
  return parseResponse(res)
}

export async function updateJob(id, data){
  const res = await fetch(BASE + `/emplois/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
  return parseResponse(res)
}

export async function deleteJob(id){
  const res = await fetch(BASE + `/emplois/${id}`, {method:'DELETE'})
  return parseResponse(res)
}

export async function importJobs(params){
  const url = new URL(BASE + '/emplois/import')
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, v)
  })
  const res = await fetch(url, {method: 'POST'})
  return parseResponse(res)
}
