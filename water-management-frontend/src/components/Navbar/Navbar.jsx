import "./Navbar.css";
import { LogOut, Droplets, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar glass">
      <Link to="/dashboard" className="navbar-brand">
        <Droplets size={22} />
        <span>Water Watch</span>
      </Link>

      <div className="navbar-user">
        <span className="navbar-room">Room {user.roomNumber}</span>
        {user.isAdmin && (
          <Link to="/admin" className="navbar-admin-link">
            <ShieldCheck size={16} />
            Admin
          </Link>
        )}
        <button onClick={handleLogout} className="navbar-logout">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}