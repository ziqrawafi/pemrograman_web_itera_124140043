import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_LABEL } from '../../constants';

// Satu baris buku: info + tombol edit / hapus
function BookItem({ book, onEdit, onDelete }) {
  return (
    <li className="book-item">
      <div>
        <strong>{book.title}</strong>
        <p>{book.author}</p>
        <span className={`badge badge-${book.status}`}>{STATUS_LABEL[book.status]}</span>
      </div>
      <div className="item-actions">
        <button className="btn" onClick={() => onEdit(book)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(book.id)}>Hapus</button>
      </div>
    </li>
  );
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookItem;
