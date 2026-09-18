import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen w-full bg-bg font-body">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-[17px] font-semibold text-ink">
              DocuMind
            </span>
          </Link>
          <nav className="flex items-center gap-7 text-[14.5px] text-[#C7CAD6]">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="transition-colors hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-accent transition-opacity hover:opacity-80"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="transition-colors hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="transition-colors hover:text-white"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </header>

        <main className="pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}