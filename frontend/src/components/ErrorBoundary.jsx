import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = {hasError: false, message: ''}
  }

  static getDerivedStateFromError(error){
    return {
      hasError: true,
      message: error?.message || 'Erreur de rendu inattendue'
    }
  }

  componentDidCatch(error, info){
    console.error('Crash UI capture par ErrorBoundary :', error, info)
  }

  onReload = () => {
    window.location.reload()
  }

  render(){
    if (this.state.hasError) {
      return (
        <div className="app-shell min-h-screen flex items-center justify-center px-4">
          <div className="glass-panel w-full max-w-xl p-6 md:p-8 text-center">
            <h2 className="section-title">Une erreur de rendu est survenue</h2>
            <p className="mt-3 text-slate-200/90">
              {this.state.message}
            </p>
            <button type="button" className="btn-primary mt-5" onClick={this.onReload}>
              Recharger l'application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
