import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

const BookContext = createContext(null);

// Hook konsumen: harus dipakai di dalam BookProvider
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider');
  }
  return context;
}

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('books_data', []);
  const [statusFilter, setStatusFilter] = useState('semua');
  const [search, setSearch] = useState('');

  const addBook = (data) => setBooks([...books, { ...data, id: Date.now() }]);
  const updateBook = (id, data) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, ...data } : b)));
  const deleteBook = (id) => setBooks(books.filter((b) => b.id !== id));

  // Filter berdasarkan status DAN pencarian judul/penulis
  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      const okStatus = statusFilter === 'semua' || b.status === statusFilter;
      const okSearch =
        !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [books, statusFilter, search]);

  const value = {
    books,
    filteredBooks,
    addBook,
    updateBook,
    deleteBook,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
