import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BookItem from './BookItem';

const book = { id: 1, title: 'Bumi', author: 'Tere Liye', status: 'milik' };

describe('BookItem', () => {
  test('merender judul, penulis, dan status', () => {
    render(<BookItem book={book} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Bumi')).toBeInTheDocument();
    expect(screen.getByText('Tere Liye')).toBeInTheDocument();
    expect(screen.getByText('Milik')).toBeInTheDocument();
  });

  test('memanggil onDelete dengan id buku', () => {
    const onDelete = vi.fn();
    render(<BookItem book={book} onEdit={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Hapus'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('memanggil onEdit dengan objek buku', () => {
    const onEdit = vi.fn();
    render(<BookItem book={book} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(book);
  });
});
