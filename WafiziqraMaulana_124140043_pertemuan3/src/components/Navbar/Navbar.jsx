import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <span className="logo">📚 Manajemen Buku</span>
        <ul className="nav-links">
          <li><NavLink to="/" end>Beranda</NavLink></li>
          <li><NavLink to="/stats">Statistik</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
