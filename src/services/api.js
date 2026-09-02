const API_BASE_URL = 'http://localhost:8080'

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  return data
}

export async function register(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }

  return data
}

export async function uploadDocument(file) {
  const token = localStorage.getItem('token')

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    'http://localhost:8080/api/documents/upload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed')
  }

  return data
}