import { useMemo } from 'react';

// Custom hook: menghitung statistik buku berdasarkan status
function useBookStats(books) {
  return useMemo(() => {
    const count = (s) => books.filter((b) => b.status === s).length;
    return {
      total: books.length,
      owned: count('milik'),
      reading: count('baca'),
      wishlist: count('beli'),
    };
  }, [books]);
}

export default useBookStats;
