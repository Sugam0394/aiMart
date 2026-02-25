 import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

// Thunks & Actions
import { submitExploreStepThunk, startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import { resetExplore } from '../../app/exploreFeatures/exploreSlice';
import { selectExploreSessionId, selectExploreLoading } from '../../app/exploreFeatures/exploreSelectors';
import { fetchSavedTools } from '../../app/features/SavedSlice';

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
    alert("Prompt copied to clipboard! 🚀");
  };

  if (savedStatus === 'loading' || isExploring) {
    return (
      <div className="loading-state">
        <div className="spinner-glow"></div>
        <p>Architecting your personal workspace...</p>
      </div>
    );
  }

  return (
    <div className="saved-page-wrapper">
      <header className="saved-hero">
        <div className="hero-content">
          <div className="success-badge-mini">
            <CheckCircle size={14} /> Workflow Synchronized
          </div>
          <h1>My Inventory & Workspace <span className="heart-icon">⚡</span></h1>
          <p>Managed <strong>{items.length}</strong> tools optimized for <b>{selections?.role || 'your professional workflow'}</b>.</p>
        </div>
      </header>

      <main className="saved-container">
        {/* Section 1: Tools */}
        <InventorySection 
          items={items} 
          onExploreMore={handleExploreMore} 
        />

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