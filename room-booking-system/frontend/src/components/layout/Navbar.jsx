import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg shadow-lg">
              L
            </div>

            <span className="text-2xl font-semibold text-white tracking-wide">
              LuxStay
            </span>
          </Link>


          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">

            <Link
              to="/"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Home
            </Link>

            <Link
              to="/rooms"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Rooms
            </Link>

            <Link
              to="/events"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Events
            </Link>

            <Link
              to="/about"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Contact
            </Link>

            {admin ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/admin/login")}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:opacity-90 transition"
              >
                <div className="flex items-center gap-2">
                  <LogIn size={18} />
                  Admin
                </div>
              </button>
            )}
          </nav>


          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>


        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 pt-4 border-t border-white/10">

            <Link
              to="/"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/rooms"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rooms
            </Link>

            <Link
              to="/events"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>

            <Link
              to="/about"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              to="/contact"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {admin ? (
              <>
                <Link
                  to="/admin"
                  className="block text-gray-300 hover:text-yellow-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="block text-gray-300 hover:text-yellow-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/admin/login");
                  setMobileMenuOpen(false);
                }}
                className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold"
              >
                Admin Login
              </button>
            )}

          </div>
        )}

      </div>
    </header>
  );
}