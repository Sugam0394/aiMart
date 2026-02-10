import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchTools, clearSearch as clearSearchAction } from '../../../app/features/searchSlice';
import { useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';

export const useSearchTools = () => {
  const dispatch = useDispatch();
  const { tools, count, loading, error, activeSections } = useSelector(
    (state) => state.search
  );

  const debouncedSearchRef = useRef(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce((term, category) => {
      dispatch(fetchSearchTools({ term, category }));
    }, 300); // ✅ Reduced debounce for faster response

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [dispatch]);

  const search = useCallback((term, category = '') => {
    debouncedSearchRef.current?.(term, category);
  }, []);

  const clearSearch = useCallback(() => {
    dispatch(clearSearchAction());
  }, [dispatch]);

  return { 
    tools, 
    count, // ✅ Return count
    loading, 
    error, 
    activeSections, 
    search,
    clearSearch, // ✅ Expose clear function
  };
}; 






