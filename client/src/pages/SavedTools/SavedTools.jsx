 import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle , Zap } from 'lucide-react';

// Thunks & Actions
import { submitExploreStepThunk, startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import { resetExplore } from '../../app/exploreFeatures/exploreSlice';
import { selectExploreSessionId, selectExploreLoading } from '../../app/exploreFeatures/exploreSelectors';
import { fetchSavedTools } from '../../app/features/SavedSlice';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';

// Components
import InventorySection from './InventorySection';
import WorkspaceSection from './WorkSpaceSection';

// Styles
import './SavedTools.css';

const SavedTools = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, status: savedStatus } = useSelector((state) => state.saved);
  const { prompts, selections } = useSelector((state) => state.explore);
  const sessionId = useSelector(selectExploreSessionId);
  const isExploring = useSelector(selectExploreLoading);

  useEffect(() => {
    // 1. Sync Inventory (Nav Fix: Bina refresh ke data fetch)
    dispatch(fetchSavedTools());

    // 2. Sync Prompts (Refresh Fix: Session restore)
    if (sessionId && prompts.length === 0) {
      dispatch(submitExploreStepThunk({
        sessionId,
        currentStep: "RESULTS",
        stepData: {},
      }));
    }
  }, [dispatch, sessionId, prompts.length]);

  const handleExploreMore = () => {
    dispatch(resetExplore());
    dispatch(startExploreThunk());
    navigate('/explore');
  };

 const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Custom toast logic here if needed
  };

 // Skeleton UI instead of boring spinner
  if (savedStatus === 'loading' || isExploring) {
    return <SkeletonLoader />;
  }

  return (
    <div className="saved-page-wrapper">
      <header className="saved-hero">
        <div className="hero-content">
          <div className="success-badge-mini">
            <CheckCircle size={14} /> Workflow Synchronized
          </div>
          <h1>My Inventory & Workspace <Zap className="zap-icon" size={32} /></h1>
          <p>
            Managed <strong>{items.length}</strong> tools optimized for 
            <b> {selections?.role || 'your professional workflow'}</b>.
          </p>
        </div>
      </header>

      <main className="saved-container">
        {/* Section 1: Tools Grid */}
        <InventorySection 
          items={items} 
          onExploreMore={handleExploreMore} 
        />

        {/* Dynamic Separator */}
        {prompts.length > 0 && (
          <div className="workspace-separator">
            <span>AI Command Center</span>
          </div>
        )}

        {/* Section 2: AI Prompts */}
        <WorkspaceSection 
          prompts={prompts} 
          onCopy={copyToClipboard} 
        />
      </main>
    </div>
  );
};

export default SavedTools;