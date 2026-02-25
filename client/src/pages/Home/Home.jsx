import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData } from '../../app/features/MomentSlice'; // Adjust paths as per your project
import { fetchWorkflow } from '../../app/features/WorkflowSlice';
import SearchSection from './SearchSection/SearchSection';
import AiStackSection from './aiStackSection/AiStackSection';
 
 
import UseCaseSwitcher from './useCasedSection/components/UseCaseSwitcher';
 import UseCaseSection from './useCasedSection/UseCasedSection';
import TrendingForYouSection from './TrendingSection/TrendingForYou';
import RisingToolsSection from './RisingTool/RisingToolSection';
 import RecommendedSection from './RecommendSection/RecommendSection';
import SectionWrapper from '../../layouts/section/SectionWrapper';
 

function Home() {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.auth);
  const { availableUseCases = [], homeStatus = "idle" } = useSelector((state) => state.moment || {});
  const workflowState = useSelector((state) => state.workflow);

  // ESLint Fix: In states ka use niche RecommendedSection mein kiya gaya hai
  const [isPersonalized, setIsPersonalized] = useState(false);
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
        
        {/* ── Hero Section ── */}
        <header className="hero-intent-section">
          <h1 className="section-title">
            {isAuthenticated ? `Welcome back, ${user?.name || 'User'}!` : "Find the right AI tool for your work"}
          </h1>
          <p className="section-subtitle">
            {isAuthenticated ? "What's on your agenda today?" : "Describe your goal and let AI find the perfect stack."}
          </p>
          
          <div className="search-controls">
            <SearchSection placeholder="Describe your goal (e.g. 'Build a website')" />
          </div>
        </header>

        <div className="sections-stack">
          <AiStackSection />
           

          {/* ── Sticky Filter ── */}
          <div className="filter-sticky-bar">
            <div className="filter-inner-content">
              <span className="filter-label">Filters</span>
              <UseCaseSwitcher 
                activeUseCase={currentUseCaseKey} 
                onChange={setActiveUseCaseKey} 
              />
            </div>
          </div>

          {/* ── Dynamic Grid Section ── */}
          {activeMeta && (
            <SectionWrapper 
              className="section-wrapper"
              title={activeMeta.label} 
              subtitle={`${activeMeta.toolCount} AI tools available`}
            >
              <div className="usecase-row-container">
                <UseCaseSection useCaseKey={currentUseCaseKey} />
              </div>
            </SectionWrapper>
          )}

          {/* ── Trending ── */}
          <SectionWrapper title="Trending For You" subtitle="Trending for you today!">
            <div className="usecase-row-container">
              <TrendingForYouSection />
            </div>
          </SectionWrapper>

          {/* ── Rising Tools ── */}
          <SectionWrapper title="🚀 Rising Tools" subtitle="New and featured tools gaining momentum">
            <RisingToolsSection />
          </SectionWrapper>

          {/* ── Personalized Recommendation (Solves ESLint Error) ── */}
          <SectionWrapper 
            title={isPersonalized ? "🎯 Based on Your Interests" : "🌟 Handpicked For You"} 
            subtitle={isPersonalized ? "Based on your recent activity" : "Top rated tools you might like"}
          >
            <RecommendedSection onDataLoaded={(val) => setIsPersonalized(val)} />
          </SectionWrapper>

        </div>
      </main>
    </div>
  );
}

export default Home; 


 



