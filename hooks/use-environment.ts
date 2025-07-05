import { useEffect, useState } from 'react';

export function useEnvironment() {
  const [environment, setEnvironment] = useState<'browser' | 'server'>(
    'server'
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      setEnvironment('browser');
    } else {
      setEnvironment('server');
    }
  }, []);

  return { environment };
}
