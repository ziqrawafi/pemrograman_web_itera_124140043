import React from 'react';
import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';

function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  return (
    <main className="container">
      <h2>Statistik Koleksi Buku</h2>
      <div className="stats-grid">
        <div className="stat-card"><span>{stats.total}</span>Total Buku</div>
        <div className="stat-card"><span>{stats.owned}</span>Milik</div>
        <div className="stat-card"><span>{stats.reading}</span>Sedang Dibaca</div>
        <div className="stat-card"><span>{stats.wishlist}</span>Ingin Dibeli</div>
      </div>
    </main>
  );
}

export default Stats;
