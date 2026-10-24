import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { STATUS_LABEL } from '../../constants';

const EMPTY = { title: '', author: '', status: 'milik' };

// Form tambah / edit buku (controlled component + validasi)
function BookForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(initialData || EMPTY);
  const [errors, setErrors] = useState({});

  // Saat masuk mode edit, isi form dengan data buku yang dipilih
  useEffect(() => {
    setForm(initialData || EMPTY);
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Judul wajib diisi';
    if (!form.author.trim()) errs.author = 'Penulis wajib diisi';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
    });
    if (!initialData) setForm(EMPTY);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2>{initialData ? 'Edit Buku' : 'Tambah Buku'}</h2>

      <label htmlFor="title">Judul</label>
      <input
        id="title"
        name="title"
        value={form.title}
        onChange={handleChange}
        className={errors.title ? 'input-error' : ''}
      />
      {errors.title && <span className="error-text" role="alert">{errors.title}</span>}

      <label htmlFor="author">Penulis</label>
      <input
        id="author"
        name="author"
        value={form.author}
        onChange={handleChange}
        className={errors.author ? 'input-error' : ''}
      />
      {errors.author && <span className="error-text" role="alert">{errors.author}</span>}

      <label htmlFor="status">Status</label>
      <select id="status" name="status" value={form.status} onChange={handleChange}>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {initialData && (
          <button type="button" className="btn" onClick={onCancel}>Batal</button>
        )}
      </div>
    </form>
  );
}

BookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
  }),
  onCancel: PropTypes.func,
};

export default BookForm;
