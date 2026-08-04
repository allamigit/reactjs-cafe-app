
import './App.css';
import HomePage from './component/HomePage';
import AboutPage from './component/AboutPage';
import MenuPage from './component/MenuPage';
import OrderPage from './component/OrderPage';
import { Routes, Route, Link } from 'react-router-dom';
import imgPath from './assets/logo.png';
import { FaLinkedin, FaEnvelope, FaGithub  } from "react-icons/fa";

const GITHUB_PIN = "753951";

export default function App() {
  const handleGithubClick = (e) => {
    e.preventDefault();
    const pin = window.prompt("Enter 6-digits PIN to access GitHub:");

    if (pin === GITHUB_PIN) {
      window.open(
        "https://github.com/allamigit/reactjs-cafe-app/tree/master/src",
        "_blank",
        "noopener,noreferrer"
      );
    } else if (pin !== null) {
      alert("❌ Incorrect PIN");
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100" style={{ fontSize: '1.1em' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {/* Brand */}
          <Link className="navbar-brand" to="/">
              <img 
                  src={imgPath} 
                  alt="logo" 
                  width="100" 
                  height="55" 
              />
          </Link>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar links */}
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav d-flex gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/" style={{ color: '#c7c6c6' }}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" style={{ color: '#c7c6c6' }}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/menu/pastries" style={{ color: '#c7c6c6' }}>Menu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/order" style={{ color: '#c7c6c6' }}>Order</Link>
              </li>
            </ul>
          </div>

          {/* Right side icons */}
          <div className="d-flex align-items-center">
            <a
              href="GitHub"
              onClick={handleGithubClick}
              className="github-icon ms-3"
            >
              <FaGithub size={28} />
            </a>

            <a
              href="https://www.linkedin.com/in/mohammad-al-lami-6752611a3/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-icon ms-3"
            >
              <FaLinkedin size={28} />
            </a>

            <a
              href="mailto:mo.i.allami@gmail.com"
              className="email-icon ms-3"
            >
              <FaEnvelope size={28} />
            </a>
          </div>

        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu/*" element={<MenuPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto" style={{ fontSize: '0.85em'}}>
        <div className="container">
          <p className="mb-0" style={{ color: '#c7c6c6' }}>&copy; {new Date().getFullYear()} reactjsCafé. Mohammad Al-Lami.</p>
        </div>
      </footer>
    </div>
  );
}
