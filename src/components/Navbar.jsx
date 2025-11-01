import "./Navbar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
  BsList,
  BsBoxArrowRight,
} from "react-icons/bs";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../slices/authSlice";

const Navbar = () => {
  const { auth } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
      e.preventDefault();
      if (query) {
        setIsMobileMenuOpen(false);
        navigate(`/search?q=${query}`);
        setQuery(""); 
      }
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav id="nav">
      <div className="brand">
        <Link to="/" onClick={handleLinkClick}>
          <h2>PixelFeed</h2>
        </Link>
      </div>

      <div
        className="hamburger-menu"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <BsList />
      </div>

      <div className={isMobileMenuOpen ? "nav-center active" : "nav-center"}>
        <div className="search-form">
          <BsSearch onClick={handleSearch} />
          <input
            type="text"
            placeholder="Pesquisar"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch} 
            value={query}
          />
        </div>

        <ul className="links">
          {auth && user ? (
            <>
              <li>
                <NavLink to="/" onClick={handleLinkClick}>
                  <BsHouseDoorFill /> <span>Home</span>
                </NavLink>
              </li>
              {user.user && (
                <li>
                  <NavLink
                    to={`/users/${user.user.id}`}
                    onClick={handleLinkClick}
                  >
                    <BsFillCameraFill /> <span>Minhas Fotos</span>
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/profile" onClick={handleLinkClick}>
                  <BsFillPersonFill /> <span>Editar Perfil</span>
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <BsBoxArrowRight /> <span>Sair</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={handleLinkClick}>
                  Entrar
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={handleLinkClick}>
                  Cadastrar
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;