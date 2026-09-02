import { useState } from 'react'
import {
  uploadDocument,
  queryDocument,
} from '../services/api'

function Dashboard() {
  const [file, setFile] = useState(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [queryError, setQueryError] = useState('')
  const [asking, setAsking] = useState(false)

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]

    setUploadMessage('')
    setUploadError('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setFile(null)
      setUploadError('Only PDF files are allowed.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null)
      setUploadError('File size must be less than 10 MB.')
      return
    }

    setFile(selectedFile)
  }

  async function handleUpload(event) {
    event.preventDefault()

    if (!file) {
      setUploadError('Please select a PDF file.')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadMessage('')

    try {
      const data = await uploadDocument(file)

      setUploadMessage(
        `Uploaded successfully: ${data.filename}`
      )

      setFile(null)
      event.target.reset()
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleQuestion(event) {
    event.preventDefault()

    if (!question.trim()) {
      setQueryError('Please enter a question.')
      return
    }

    setAsking(true)
    setQueryError('')
    setAnswer('')
    setSources([])

    try {
      const data = await queryDocument(question.trim())

      setAnswer(data.answer)
      setSources(data.sources || [])
    } catch (error) {
      setQueryError(error.message)
    } finally {
      setAsking(false)
    }
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-2xl">
            📄
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Document Dashboard
            </h1>

            <p className="mt-1 text-slate-400">
              Upload documents and ask questions using AI.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Upload Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Upload Document
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Upload a PDF to add it to your knowledge base.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/70 px-6 py-10 text-center transition hover:border-blue-500 hover:bg-slate-950">
              <span className="text-3xl">📄</span>

              <span className="mt-3 font-medium">
                Choose a PDF
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Maximum file size: 10 MB
              </span>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Selected file
                </p>

                <p className="mt-1 truncate font-medium text-white">
                  {file.name}
                </p>
              </div>
            )}

            {uploadError && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
                {uploadError}
              </div>
            )}

            {uploadMessage && (
              <div className="rounded-lg border border-green-900/50 bg-green-950/30 p-4 text-sm text-green-400">
                {uploadMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploading ? 'Processing document...' : 'Upload PDF'}
            </button>

          </form>
        </section>

        {/* Q&A Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Ask DocuMind
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Ask questions about your uploaded documents.
            </p>
          </div>

          <form onSubmit={handleQuestion} className="space-y-5">

            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. What programming language is used in this project?"
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />

            {queryError && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
                {queryError}
              </div>
            )}

            <button
              type="submit"
              disabled={asking}
              className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {asking ? 'Thinking...' : 'Ask Question'}
            </button>

          </form>
        </section>

      </div>

      {/* Answer */}
      {answer && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold">
            AI Answer
          </h2>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5 leading-7 text-slate-200">
            {answer}
          </div>
        </section>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold">
            Sources
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sources.map((source, index) => (
              <div
                key={`${source.documentId}-${source.chunkIndex}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="font-medium text-white">
                  {source.filename}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Document ID: {source.documentId}
                </p>

                <p className="text-sm text-slate-500">
                  Chunk: {source.chunkIndex}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

export default Dashboard