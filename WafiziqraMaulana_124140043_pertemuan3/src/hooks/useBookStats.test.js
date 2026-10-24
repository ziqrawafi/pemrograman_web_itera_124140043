import { renderHook } from '@testing-library/react';
import useBookStats from './useBookStats';

test('menghitung statistik buku per status', () => {
  const books = [
    { id: 1, title: 'A', author: 'X', status: 'milik' },
    { id: 2, title: 'B', author: 'Y', status: 'baca' },
    { id: 3, title: 'C', author: 'Z', status: 'milik' },
  ];
  const { result } = renderHook(() => useBookStats(books));
  expect(result.current).toEqual({ total: 3, owned: 2, reading: 1, wishlist: 0 });
});
