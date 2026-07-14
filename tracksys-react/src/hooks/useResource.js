import { useCallback, useEffect, useState } from 'react';

/**
 * Charge une ressource via `fetcher` (fonction async sans argument) au montage,
 * expose `data`/`loading`/`error` et un `refetch` pour le pattern refetch-after-write.
 */
export function useResource(fetcher, { initialData = null, deps = [] } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return { data, setData, loading, error, refetch };
}
