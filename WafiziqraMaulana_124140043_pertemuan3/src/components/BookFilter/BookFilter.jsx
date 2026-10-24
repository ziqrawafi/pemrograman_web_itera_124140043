import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_LABEL } from '../../constants';

// Pencarian (judul/penulis) + filter status
function BookFilter({ status, search, onStatusChange, onSearchChange }) {
  return (
    <div className="book-filter">
      <input
        type="text"
        placeholder="Cari judul atau penulis..."
        aria-label="Cari buku"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        aria-label="Filter status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="semua">Semua Status</option>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}

BookFilter.propTypes = {
  status: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default BookFilter;
