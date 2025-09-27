import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const { method = 'GET', data, headers = {}, params } = options

    const res = await axios({
      url: `${API_BASE}${endpoint}`,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      params
    })

    return res.data
  } catch (err) {
    if (err.response) {
      console.error(`API error: ${err.response.status} - ${err.response.data}`)
      throw err.response.data
    } else {
      console.error('API request failed:', err.message)
      throw err
    }
  }
}
