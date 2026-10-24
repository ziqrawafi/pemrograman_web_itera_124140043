import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="container">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p><Link to="/">Kembali ke Beranda</Link></p>
    </main>
  );
}

export default NotFound;
