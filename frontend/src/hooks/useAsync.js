import { useState, useCallback } from 'react';
import { handleApiError, showErrorNotification } from '../utils/errorHandler';

const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction(...params);
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      showErrorNotification(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error };
};

export default useAsync; 