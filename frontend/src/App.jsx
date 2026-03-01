import React from 'react'
import JobList from './components/JobList'
import JobForm from './components/JobForm'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
          <p className="text-sm text-gray-500">Powered by FastAPI + React</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Create Section */}
        <section className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Job</h2>
          <JobForm />
        </section>

        {/* List Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Jobs</h2>
          <JobList />
        </section>
      </main>
    </div>
  )
}
