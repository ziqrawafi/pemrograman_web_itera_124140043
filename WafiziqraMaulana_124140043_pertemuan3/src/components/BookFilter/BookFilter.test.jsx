import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BookFilter from './BookFilter';

test('memanggil onSearchChange saat mengetik pencarian', () => {
  const onSearchChange = vi.fn();
  render(
    <BookFilter status="semua" search="" onStatusChange={vi.fn()} onSearchChange={onSearchChange} />
  );
  fireEvent.change(screen.getByLabelText('Cari buku'), { target: { value: 'bumi' } });
  expect(onSearchChange).toHaveBeenCalledWith('bumi');
});
