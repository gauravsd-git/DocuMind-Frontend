import { useEffect, useRef, useState } from "react";
import { uploadDocument, queryDocument } from "../services/api";
import NetworkBackground from "../components/NetworkBackground";

// Assumptions baked into this flow (flag if any of these are wrong):
// - One active document at a time — uploading a new PDF replaces it,
//   chat history stays visible either way.
// - The question input is disabled until a document has uploaded
//   successfully, rather than allowing a question and erroring.
// - The input clears immediately on send (not after the answer arrives) —
//   standard chat-UI pattern, matches Claude/ChatGPT.

function Dashboard() {
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleFileSelect(event) {
    const selectedFile = event.target.files[0];
    event.target.value = ""; // allow re-selecting the same file later

    setUploadError("");

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10 MB.");
      return;
    }

    setUploading(true);

    try {
      const data = await uploadDocument(selectedFile);
      setUploadedFileName(data.filename);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSend(event) {
    event.preventDefault();

    const trimmed = question.trim();
    if (!trimmed || !uploadedFileName || asking) return;

    const id = ++idRef.current;
    setMessages((prev) => [
      ...prev,
      { id, question: trimmed, loading: true, answer: null, sources: [], error: "" },
    ]);
    setQuestion("");
    setAsking(true);

    try {
      const data = await queryDocument(trimmed);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, loading: false, answer: data.answer, sources: data.sources || [] }
            : m
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, loading: false, error: error.message } : m
        )
      );
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="relative flex h-155 flex-col overflow-hidden rounded-2xl border border-border bg-bg">
      <NetworkBackground
        className="absolute inset-0"
        lineAlpha={0.22}
        linkDistance={110}
        maxNodes={150}
        dotColor="rgba(241, 240, 236, 0.4)"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="border-b border-border px-6 py-4 text-sm font-medium text-ink">
          Ask DocuMind
        </div>

        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-6 py-5">
          {uploadedFileName ? (
            <div className="mx-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted">
              <span className="text-progress">✓</span>
              {uploadedFileName} uploaded
            </div>
          ) : (
            <div className="mx-auto text-xs text-muted">
              Upload a PDF to get started
            </div>
          )}

          {uploadError && (
            <div className="mx-auto rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-400">
              {uploadError}
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-2">
              <div className="max-w-[75%] self-end rounded-[12px_12px_2px_12px] bg-accent px-3.5 py-2.5 text-[13px] text-bg">
                {m.question}
              </div>

              {m.loading && (
                <div className="flex items-center gap-1.5 self-start rounded-[2px_12px_12px_12px] border border-border bg-panel px-3.5 py-2.5">
                  <span className="thinking-dot" style={{ animationDelay: "0s" }} />
                  <span className="thinking-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="thinking-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              )}

              {!m.loading && m.error && (
                <div className="max-w-[80%] self-start rounded-lg border border-red-900/50 bg-red-950/30 px-3.5 py-2.5 text-[13px] text-red-400">
                  {m.error}
                </div>
              )}

              {!m.loading && m.answer && (
                <div className="max-w-[80%] self-start">
                  <div className="rounded-[2px_12px_12px_12px] border border-border bg-panel px-3.5 py-3 text-[13px] leading-relaxed text-[#E4E0D8]">
                    {m.answer}
                  </div>
                  {m.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.sources.map((source, i) => (
                        <span
                          key={`${source.documentId}-${source.chunkIndex}-${i}`}
                          className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[11px] text-muted"
                        >
                          {source.filename} · chunk {source.chunkIndex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2.5 border-t border-border px-6 py-3.5"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            aria-label="Upload PDF"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {uploading ? "…" : "📎"}
          </button>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              uploadedFileName
                ? "Ask a question about your document..."
                : "Upload a PDF first"
            }
            disabled={!uploadedFileName || asking}
            className="flex-1 rounded-[10px] border border-border bg-panel px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-accent disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!uploadedFileName || !question.trim() || asking}
            aria-label="Send"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-accent text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;