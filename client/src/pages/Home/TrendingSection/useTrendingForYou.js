 import { useSelector } from 'react-redux';

export const useTrendingForYou = () => {
  // Redux store se direct data fetch
  const tools = useSelector((state) => state.moment.trendingTools);
  const loading = useSelector((state) => state.moment.homeStatus === 'loading');
  
  // Extra API call block delete kar diya gaya hai
  return { tools, loading, error: null };
};

export default useTrendingForYou;

