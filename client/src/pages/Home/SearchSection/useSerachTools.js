 import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchTools } from '../../../app/features/searchSlice';
import { useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

export const useSearchTools = () => {
  const dispatch = useDispatch();
  const { tools, loading, error, activeSections } = useSelector(
    state => state.search
  );

  // ✅ stable ref
  const debouncedSearchRef = useRef(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce((term, category) => {
      dispatch(fetchSearchTools({ term, category }));
    }, 500);

    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [dispatch]);

  const search = (term, category) => {
    debouncedSearchRef.current(term, category);
  };

  return { tools, loading, error, activeSections, search };
};






