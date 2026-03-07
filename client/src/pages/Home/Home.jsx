import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData } from '../../app/features/MomentSlice';
import { fetchWorkflow } from '../../app/features/workFlowSlice';
import { fetchToolsCount } from '../../app/features/stackSlice';
import SearchSection from './SearchSection/SearchSection';
import AiStackSection from './aiStackSection/AiStackSection';

 
 
import UseCaseSwitcher from './useCasedSection/components/UseCaseSwitcher';
import UseCaseSection from './useCasedSection/UseCasedSection';
import TrendingForYouSection from './TrendingSection/TrendingForYou';
import RisingToolsSection from './RisingTool/RisingToolSection';
 
 
import SectionWrapper from '../../layouts/section/SectionWrapper';


import './HomeRedesign.css'
 

function Home() {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.auth);
  const { availableUseCases = [], homeStatus = "idle" } = useSelector((state) => state.moment || {});
  const workflowState = useSelector((state) => state.workflow);
 
  const { toolsCount } = useSelector((state) => state.stack);
 
  const [activeUseCaseKey, setActiveUseCaseKey] = useState("");

  const isAuthenticated = !!user;

  // ✅ Initialize Profile from LocalStorage
  const [userProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user_workflow_profile")) || null;
    } catch { return null; }
  });

  // ✅ Logic to fetch Workflow Data
  useEffect(() => {
    if (userProfile?.role && workflowState.status === "idle") {
      dispatch(fetchWorkflow(userProfile.role));
    }
  }, [userProfile, workflowState.status, dispatch]);

  // 2. Is useEffect ko add/update karo (Yahi missing hai)
  useEffect(() => {
    dispatch(fetchToolsCount()); // <--- Ye line warning hata degi aur data fetch karegi
  }, [dispatch]);

 

  // ✅ Fetch Moments/Tools Data
  useEffect(() => {
    if (isInitialized && homeStatus === "idle") { 
      const interests = JSON.parse(localStorage.getItem("user_interests") || "[]");
      const tagsParam = interests.join(",");
      dispatch(fetchHomeData(tagsParam));
    }
  }, [dispatch, homeStatus, isInitialized]); 

  const currentUseCaseKey = useMemo(() => {
    if (activeUseCaseKey) return activeUseCaseKey;
    if (availableUseCases && availableUseCases.length > 0) {
      return availableUseCases[0].key;
    }
    return "";
  }, [availableUseCases, activeUseCaseKey]);

  const activeMeta = availableUseCases.find((uc) => uc.key === currentUseCaseKey) || 
                       { label: currentUseCaseKey.replace(/-/g, ' '), toolCount: 0 };

  
 return (
  <div className="home-container">
    <main className="home-page">
      <header className="hero-intent-section">

      {/* ✅ CHANGE 2: Live Tools Count Badge */}
        {toolsCount > 0 && (
          <div className="hero-badge animate-fade-in">
            <span className="badge-dot"></span>
            Explore <strong>{toolsCount}+ AI Tools</strong> curated for you
          </div>
        )}

        <h1 className="section-title">
          {isAuthenticated ? `Welcome back, ${user?.name}!` : "Find the perfect AI tool"}
        </h1>
        <p className="section-subtitle">
          {isAuthenticated ? "Your personalized AI stack is ready." : "Describe your goal and let AI find the perfect tools."}
        </p>
        <div className="search-controls">
          <SearchSection placeholder="Describe your goal..." />
        </div>
      </header>

      <div className="sections-stack">
        <AiStackSection />

        {/* --- Unified Discovery Section (Switcher + Tools) --- */}
        <div className="discovery-unit-container">
          <div className="filter-sticky-bar">
            <div className="filter-inner-content">
              <span className="filter-label">DISCOVER</span>
              <UseCaseSwitcher 
                activeUseCase={currentUseCaseKey} 
                onChange={setActiveUseCaseKey} 
              />
            </div>
          </div>

          <div className="discovery-content-area">
            {activeMeta && (
              <SectionWrapper title={activeMeta.label} subtitle={`${activeMeta.toolCount} tools`}>
                <UseCaseSection useCaseKey={currentUseCaseKey} />
              </SectionWrapper>
            )}
          </div>
        </div>
        {/* --- End Discovery Section --- */}

        <div className="additional-sections">
          <SectionWrapper title="Trending For You">
            <TrendingForYouSection />
          </SectionWrapper>

          <SectionWrapper title="🚀 Rising Tools">
            <RisingToolsSection />
          </SectionWrapper>
        </div>
      </div>
    </main>
  </div>
);
}

export default Home; 


 
 


