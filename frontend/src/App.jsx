import React from 'react'
import JobList from './components/JobList'
import JobForm from './components/JobForm'

export default function App(){
  return (
    <div className="app-shell min-h-screen">
      <div className="background-grid" aria-hidden="true" />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <header className="hero-wrap">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <p className="eyebrow mb-3">Centre Carriere</p>
          <h1 className="hero-title">Tableau des Emplois Anir</h1>
          <p className="hero-subtitle mt-4 max-w-3xl">
            Sauvegardez des opportunites pour les consulter plus tard. Publiez vos offres, recherchez le role ideal et gerez vos candidatures en un seul endroit.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-14 md:pb-20">
        <section className="glass-panel mb-8 p-5 md:p-7 reveal-in">
          <div className="section-header mb-5">
            <h2 className="section-title">Creer Un Nouvel Emploi</h2>
            <span className="section-chip">Publication En Direct</span>
          </div>
          <JobForm />
        </section>

        <section className="glass-panel p-5 md:p-7 reveal-in" style={{animationDelay: '120ms'}}>
          <div className="section-header mb-5">
            <h2 className="section-title">Emplois</h2>
            <span className="section-chip">Flux En Temps Reel</span>
          </div>
          <JobList />
        </section>
      </main>
    </div>
  )
}
