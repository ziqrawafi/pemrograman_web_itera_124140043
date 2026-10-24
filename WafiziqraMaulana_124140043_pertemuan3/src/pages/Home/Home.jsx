import React, { useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import { useBooks } from '../../context/BookContext';

function Home() {
  const {
    filteredBooks, addBook, updateBook, deleteBook,
    statusFilter, setStatusFilter, search, setSearch,
  } = useBooks();
  const [editingBook, setEditingBook] = useState(null);

  const handleSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setEditingBook(null);
    } else {
      addBook(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus buku ini?')) {
      deleteBook(id);
      if (editingBook && editingBook.id === id) setEditingBook(null);
    }
  };

  return (
    <main className="container">
      <BookForm
        onSubmit={handleSubmit}
        initialData={editingBook}
        onCancel={() => setEditingBook(null)}
      />
      <BookFilter
        status={statusFilter}
        search={search}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />
      <BookList books={filteredBooks} onEdit={setEditingBook} onDelete={handleDelete} />
    </main>
  );
}

export default Home;
