import { Link } from "react-router-dom";
import NetworkBackground from "../components/NetworkBackground";
import Connector from "../components/Connector";
import Reveal from "../components/Reveal";
import Logo from "../components/Logo";

const STAGES = [
  {
    n: "01",
    name: "Upload",
    copy: "Drop in a PDF. Apache Tika extracts the raw text so it's ready for processing — no manual copy-pasting.",
  },
  {
    n: "02",
    name: "Chunk",
    copy: "The text is split into roughly 500-word chunks with a little overlap, so no idea gets cut off mid-thought.",
  },
  {
    n: "03",
    name: "Embed",
    copy: "Each chunk becomes a vector via Gemini's embedding model, then lands in pgvector — inside your own Postgres.",
  },
  {
    n: "04",
    name: "Retrieve",
    copy: "Your question gets embedded the same way, then cosine similarity pulls the chunks that actually answer it.",
  },
  {
    n: "05",
    name: "Generate answer",
    copy: "Gemini writes the answer using only those retrieved chunks, and every claim links back to its source passage.",
    final: true,
  },
];

export default function Home() {
  return (
    <div className="relative bg-bg">
      {/* Single canvas spans the whole page, including the footer, so the
          network animation never seams or restarts as you scroll. */}
      <NetworkBackground className="absolute inset-0" />

      <div className="relative z-10">
        {/* First screen: nav + hero + brand strip, sized to the real viewport */}
        <div className="flex h-screen min-h-140 flex-col">
          <nav className="flex flex-none items-center justify-between px-7 py-5">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-display text-sm font-medium text-ink">
                DocuMind
              </span>
            </Link>
            <div className="flex gap-5 text-xs text-muted">
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Signup</Link>
            </div>
          </nav>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Reveal
              as="h1"
              className="mb-2 font-display text-[28px] font-semibold leading-snug text-ink"
            >
              Ask your documents anything.
            </Reveal>
            <Reveal as="p" delay={90} className="mb-5 text-sm text-muted">
              Get grounded answers, cited to source.
            </Reveal>
            <Reveal delay={180}>
              <Link
                to="/register"
                className="rounded-md border border-accent px-5 py-2.5 text-xs font-medium text-accent"
              >
                Get started
              </Link>
            </Reveal>
          </div>

          <div className="flex-none px-7 pb-7">
            <div className="grid grid-cols-2 items-end gap-6">
              <Reveal as="p" className="text-[14px] leading-relaxed text-muted">
                Upload a PDF, ask a plain-language question, and get back a
                grounded answer, with the exact passage it came from, every
                time.
              </Reveal>
              <Reveal as="div" delay={100} className="text-right">
                <p className="font-display text-7xl font-semibold leading-none tracking-tight text-ink">
                  DocuMind
                </p>
                <p className="mt-1 text-[13px] text-accent">
                  Retrieval-augmented Q&amp;A engine
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flex flex-none items-center justify-center gap-2 pb-5">
            <span className="text-[11px] text-muted">Scroll down</span>
            <span className="flex h-5 w-5 items-center justify-center rounded border border-border">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="scroll-bounce"
                style={{ color: "#948E86" }}
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Pipeline flow */}
        <section className="border-t border-border px-7 pb-16 pt-10">
          <p className="mb-2 font-mono text-[10px] tracking-wide text-muted">
            how it works
          </p>
          <Reveal as="h2" className="mb-10 text-xl font-semibold text-ink">
            Five steps, one grounded answer
          </Reveal>

          {STAGES.map((stage, i) => (
            <div key={stage.n}>
              <Reveal
                delay={i * 40}
                className={`flex items-center gap-8 ${
                  i % 2 === 1 ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`min-w-30 rounded px-4 py-3 text-center text-[13px] font-medium ${
                    stage.final
                      ? "min-w-[150px] bg-accent font-semibold text-bg"
                      : "border border-accent text-ink"
                  }`}
                >
                  {stage.n} · {stage.name}
                </div>
                <p
                  className={`flex-1 text-sm leading-relaxed text-[#C9C4BC] ${
                    i % 2 === 1 ? "text-right" : ""
                  }`}
                >
                  {stage.copy}
                </p>
              </Reveal>
              {i < STAGES.length - 1 && <Connector />}
            </div>
          ))}
        </section>

        {/* Footer — still sits on the same canvas as everything above it */}
        <footer className="border-t border-border px-7 py-8 text-center">
          <p className="mb-3 text-xs text-muted">
            Built by Gaurav Vishwakarma
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/gaurava-sd "
              aria-label="LinkedIn"
              className="text-[#C9C4BC] hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v1.98h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8.5z" />
              </svg>
            </a>
            <a
              href="https://github.com/gauravsd-git"
              aria-label="GitHub"
              className="text-[#C9C4BC] hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A10.5 10.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}