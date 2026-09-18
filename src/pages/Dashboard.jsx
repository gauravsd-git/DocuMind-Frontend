import { useState } from "react";
import { uploadDocument, queryDocument } from "../services/api";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [queryError, setQueryError] = useState("");
  const [asking, setAsking] = useState(false);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    setUploadMessage("");
    setUploadError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setUploadError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setUploadError("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!file) {
      setUploadError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadMessage("");

    try {
      const data = await uploadDocument(file);

      setUploadMessage(`Uploaded successfully: ${data.filename}`);

      setFile(null);
      event.target.reset();
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleQuestion(event) {
    event.preventDefault();

    if (!question.trim()) {
      setQueryError("Please enter a question.");
      return;
    }

    setAsking(true);
    setQueryError("");
    setAnswer("");
    setSources([]);

    try {
      const data = await queryDocument(question.trim());

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (error) {
      setQueryError(error.message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-2xl">
            📄
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
              Document Dashboard
            </h1>

            <p className="mt-1 text-muted">
              Upload documents and ask questions using AI.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Card */}
        <section className="rounded-2xl border border-border bg-panel/80 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-ink">
              Upload Document
            </h2>

            <p className="mt-1 text-sm text-muted">
              Upload a PDF to add it to your knowledge base.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg/70 px-6 py-10 text-center transition hover:border-accent hover:bg-bg">
              <span className="text-3xl">📄</span>

              <span className="mt-3 font-medium text-ink">
                Choose a PDF
              </span>

              <span className="mt-1 text-sm text-muted">
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
              <div className="rounded-lg border border-border bg-bg p-4">
                <p className="text-sm text-muted">Selected file</p>

                <p className="mt-1 truncate font-medium text-ink">
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
              <div className="rounded-lg border border-progress/30 bg-progress/10 p-4 text-sm text-progress">
                {uploadMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full rounded-xl bg-accent px-5 py-3 font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploading ? "Processing document..." : "Upload PDF"}
            </button>
          </form>
        </section>

        {/* Q&A Card */}
        <section className="rounded-2xl border border-border bg-panel/80 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-ink">Ask DocuMind</h2>

            <p className="mt-1 text-sm text-muted">
              Ask questions about your uploaded documents.
            </p>
          </div>

          <form onSubmit={handleQuestion} className="space-y-5">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. What programming language is used in this project?"
              rows={6}
              className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-4 text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
            />

            {queryError && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
                {queryError}
              </div>
            )}

            <button
              type="submit"
              disabled={asking}
              className="w-full rounded-xl bg-accent px-5 py-3 font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {asking ? "Thinking..." : "Ask Question"}
            </button>
          </form>
        </section>
      </div>

      {/* Answer */}
      {answer && (
        <section className="rounded-2xl border border-border bg-panel/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-ink">AI Answer</h2>

          <div className="mt-5 rounded-xl border border-border bg-bg p-5 leading-7 text-ink">
            {answer}
          </div>
        </section>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <section className="rounded-2xl border border-border bg-panel/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-ink">Sources</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sources.map((source, index) => (
              <div
                key={`${source.documentId}-${source.chunkIndex}-${index}`}
                className="rounded-xl border border-border bg-bg p-5"
              >
                <p className="font-medium text-ink">{source.filename}</p>

                <p className="mt-2 text-sm text-muted">
                  Document ID: {source.documentId}
                </p>

                <p className="text-sm text-muted">
                  Chunk: {source.chunkIndex}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;