import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Ошибка приложения:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Не удалось загрузить данные</h1>
          <p className="mt-2 text-sm text-muted">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Обновить страницу
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
