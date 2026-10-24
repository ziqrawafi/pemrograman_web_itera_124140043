import React from 'react';
import PropTypes from 'prop-types';
import BookItem from '../BookItem/BookItem';

// Daftar buku; tampilkan pesan jika kosong
function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty-message">Tidak ada buku yang cocok.</p>;
  }
  return (
    <ul className="book-list">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookList;
