const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const API_URL = (configuredApiUrl || (import.meta.env.DEV ? '' : 'https://examhub-api.onrender.com')).replace(/\/+$/, '')

export function apiUrl(path) {
  return `${API_URL}${path}`
}

export function apiErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return 'Sura Study could not be reached. Check that the API is running, then try again.'
  }
  return error instanceof Error && error.message ? error.message : fallback
}
