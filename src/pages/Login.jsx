import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import NetworkBackground from "../components/NetworkBackground";
import Reveal from "../components/Reveal";
import Logo from "../components/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: saveToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      saveToken(data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-bg">
      <NetworkBackground className="absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="px-7 py-5">
          <Link to="/" className="flex w-fit items-center gap-2">
            <Logo />
            <span className="font-display text-sm font-medium text-ink">
              DocuMind
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-20">
          <div className="w-full max-w-md">
            <Reveal as="h1" className="font-display text-3xl font-semibold text-ink">
              Welcome back
            </Reveal>
            <Reveal as="p" delay={80} className="mt-2 text-sm text-muted">
              Login to DocuMind
            </Reveal>

            <Reveal delay={140}>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-panel px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted focus:border-accent"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-panel px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted focus:border-accent"
                />

                {error && (
                  <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </Reveal>

            <Reveal delay={200} as="p" className="mt-6 text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-accent hover:opacity-80">
                Register
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;