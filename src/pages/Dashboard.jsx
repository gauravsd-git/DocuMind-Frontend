import { useState } from 'react'
import { uploadDocument } from '../services/api'

function Dashboard() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]

    setMessage('')
    setError('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setFile(null)
      setError('Only PDF files are allowed.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null)
      setError('File size must be less than 10 MB.')
      return
    }

    setFile(selectedFile)
  }

  async function handleUpload(event) {
    event.preventDefault()

    if (!file) {
      setError('Please select a PDF file.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const data = await uploadDocument(file)

      setMessage(
        `Uploaded successfully: ${data.filename}`
      )

      setFile(null)
      event.target.reset()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">
          Document Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Upload your PDF documents and ask questions about them.
        </p>
      </div>

      <div className="mt-8 max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">
          Upload a PDF
        </h2>

        <form
          onSubmit={handleUpload}
          className="mt-5 space-y-5"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300"
          />

          {file && (
            <p className="text-sm text-slate-400">
              Selected: {file.name}
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard