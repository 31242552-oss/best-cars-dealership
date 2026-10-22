import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ username, setUsername }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/djangoapp/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    sessionStorage.removeItem('username');
    setUsername('');
    navigate('/dealers');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/djangoapp/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: loginUser, password: loginPass })
      });
      const data = await res.json();
      if (res.ok && data.status === 'Authenticated') {
        sessionStorage.setItem('username', data.userName);
        setUsername(data.userName);
        setShowLoginModal(false);
        setLoginUser('');
        setLoginPass('');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication service');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0d6efd 100%)' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/dealers">
            <i className="bi bi-car-front-fill fs-4"></i> Best Cars
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dealers">Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact Us</a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              {username ? (
                <div className="d-flex align-items-center gap-3">
                  <span className="text-white fw-semibold">
                    <i className="bi bi-person-circle me-1"></i> {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm px-3"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="btn btn-light btn-sm px-3 text-primary fw-semibold"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </button>
                  <Link
                    to="/register"
                    className="btn btn-outline-light btn-sm px-3"
                  >
                    <i className="bi bi-person-plus me-1"></i> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-lock-fill me-2"></i> Account Login
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowLoginModal(false)}
                ></button>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="modal-body p-4">
                  {loginError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {loginError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      required
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
