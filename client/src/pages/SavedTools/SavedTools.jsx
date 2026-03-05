  import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap } from 'lucide-react';

// Thunks & Actions
import { submitExploreStepThunk, startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import { resetExplore } from '../../app/exploreFeatures/exploreSlice';
import { selectExploreSessionId, selectExploreLoading } from '../../app/exploreFeatures/exploreSelectors';
import { fetchSavedTools, fetchSavedPrompts } from '../../app/features/SavedSlice';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';

// Components
import InventorySection from './InventorySection';
import WorkspaceSection from './WorkSpaceSection';

// Styles
import './SavedTools.css';

const SavedTools = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ 1. Get both DB items (Permanent) and Explore items (Temporary)
  const { items, dbPrompts, status: savedStatus } = useSelector((state) => state.saved);
  const { prompts: explorePrompts, selections } = useSelector((state) => state.explore);
  
  const sessionId = useSelector(selectExploreSessionId);
  const isExploring = useSelector(selectExploreLoading);

  useEffect(() => {
    // 2. Sync Inventory & Permanent Prompts from DB
    dispatch(fetchSavedTools());
    dispatch(fetchSavedPrompts()); // ✅ DB se data mangwane ke liye

    // 3. Sync Temporary Prompts (Explore session restore)
    if (sessionId && explorePrompts.length === 0) {
      dispatch(submitExploreStepThunk({
        sessionId,
        currentStep: "RESULTS",
        stepData: {},
      }));
    }
  }, [dispatch, sessionId, explorePrompts.length]);

  // ✅ 4. Combine both lists (Explore results + DB results)
  // Taaki save button dabane ke baad data "dbPrompts" se load ho sake
  const allPrompts = [...dbPrompts, ...explorePrompts];

  const handleExploreMore = () => {
    dispatch(resetExplore());
    dispatch(startExploreThunk());
    navigate('/explore');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Skeleton UI for loading states
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
        {/* Section 1: Tools Grid (Inventory) */}
        <InventorySection 
          items={items} 
          onExploreMore={handleExploreMore} 
        />

        {/* Dynamic Separator: Trigger if either DB or Explore has prompts */}
        {allPrompts.length > 0 && (
          <div className="workspace-separator">
            <span>AI Command Center</span>
          </div>
        )}

        {/* Section 2: AI Prompts (Passing the merged "allPrompts" list) */}
        <WorkspaceSection 
          prompts={allPrompts} 
          onCopy={copyToClipboard} 
        />
      </main>
    </div>
  );
};

export default SavedTools;