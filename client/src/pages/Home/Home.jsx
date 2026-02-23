 import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomeData } from "../../app/features/MomentSlice";
  
import { fetchWorkflow } from "../../app/features/workFlowSlice";

import GreetingSection from "./GreetingSection/GreetingSection";
import TrendingForYouSection from "./TrendingSection/TrendingForYou";
import SearchSection from "./SearchSection/SearchSection";
import UseCaseSwitcher from "./useCasedSection/components/UseCaseSwitcher";
import UseCaseSection from "./useCasedSection/UseCasedSection";
import RisingToolsSection from "./RisingTool/RisingToolSection";
import RecommendedSection from "./RecommendSection/RecommendSection";
import SectionWrapper from "../../layouts/section/SectionWrapper";
 
 

 
 import ToolCardSkeleton from "../aiArt/components/ToolCardSkeleton";
import PersonalizedWorkflowSection from "./WorkFlowSection/WorkFlowSection";

import "./HomeRedesign.css";   

 function HomeSkeleton() {
  return (
    <div className="home-container">
      <main className="home-page">
        {/* Hero Section Skeleton */}
        <div className="home-hero-container">
          <div className="skeleton-greeting skeleton-shimmer"></div>
          <div className="skeleton-search skeleton-shimmer"></div>
        </div>

        <div className="sections-stack">
          {/* 🚀 NEW: Workflow Section Skeleton */}
          <div className="skeleton-workflow-card">
            <div className="skeleton-workflow-header skeleton-shimmer"></div>
            <div className="skeleton-steps-stack">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-step-item">
                  <div className="skeleton-circle skeleton-shimmer"></div>
                  <div className="skeleton-line-group">
                    <div className="skeleton-title-line skeleton-shimmer"></div>
                    <div className="skeleton-body-line skeleton-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Bar Skeleton */}
          <div className="skeleton-filter-bar">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-pill skeleton-shimmer"></div>
            ))}
          </div>

          {/* Cards Rows Skeletons */}
          {[1, 2].map((row) => (
            <div key={row} className="skeleton-section">
              <div className="skeleton-section-title skeleton-shimmer"></div>
              <div className="skeleton-cards-row">
                {[1, 2, 3, 4].map(i => <ToolCardSkeleton key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Home() {
  const dispatch = useDispatch(); 
  const { user, isInitialized } = useSelector((state) => state.auth); 
  const { availableUseCases = [], homeStatus = "idle" } = useSelector((state) => state.moment || {});
  
  // ✅ 1. Get Workflow State
  const workflowState = useSelector((state) => state.workflow);

  const isAuthenticated = !!user;
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [activeUseCaseKey, setActiveUseCaseKey] = useState("");

  // ✅ 2. Initialize Profile from LocalStorage
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user_workflow_profile")) || null;
    } catch { return null; }
  });

  // ✅ 3. Logic to fetch Workflow Data
  useEffect(() => {
    if (userProfile?.role && workflowState.status === "idle") {
      dispatch(fetchWorkflow(userProfile.role));
    }
  }, [userProfile, workflowState.status, dispatch]);

  // ✅ 4. Workflow Handlers
  const handleRolePicked = (role) => {
    const profile = { role, updatedAt: new Date().toISOString() };
    localStorage.setItem("user_workflow_profile", JSON.stringify(profile));
    setUserProfile(profile);
    dispatch(fetchWorkflow(role));
  };

  const handleChangeRole = () => {
    localStorage.removeItem("user_workflow_profile");
    setUserProfile(null);
  };

  // Existing Logic for Moments
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

  if (homeStatus === "loading" && availableUseCases.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <div className="home-container">
      <main className="home-page">
        <div className="home-hero-container">
          <GreetingSection isAuthenticated={isAuthenticated} user={user} />
          <div className="search-overlay-box">
            <SearchSection />
          </div>
        </div>

        <div className="sections-stack">
          
          {/* ✅ 5. Naya Workflow Section Placement (Hero ke thik baad) */}
          <PersonalizedWorkflowSection 
            userProfile={userProfile}
            workflowState={workflowState}
            onRolePicked={handleRolePicked}
            onChangeRole={handleChangeRole}
          />

          <div className="filter-sticky-bar">
            <div className="filter-inner-content">
              <span className="filter-label">Filters</span>
              <UseCaseSwitcher 
                activeUseCase={currentUseCaseKey} 
                onChange={setActiveUseCaseKey} 
              />
            </div>
          </div>

          {activeMeta && (
            <SectionWrapper 
              title={activeMeta.label} 
              subtitle={`${activeMeta.toolCount} AI tools available`}
            >
              <div className="horizontal-scroll-section">
                <UseCaseSection useCaseKey={currentUseCaseKey} />
              </div>
            </SectionWrapper>
          )}

          <SectionWrapper 
            title="Trending For You" 
            subtitle="Trending for you today!"
          >
            <div className="horizontal-scroll-section">
              <TrendingForYouSection />
            </div>
          </SectionWrapper>
        </div>

        <SectionWrapper 
          title="🚀 Rising Tools" 
          subtitle="New and featured AI tools gaining momentum"
        >
          <RisingToolsSection />
        </SectionWrapper>

        <SectionWrapper 
          title={isPersonalized ? "🎯 Based on Your Interests" : "🌟 Handpicked For You"} 
          subtitle={isPersonalized ? "Based on your recent activity" : "Top rated tools you might like"}
        >
          <RecommendedSection onDataLoaded={(val) => setIsPersonalized(val)} />
        </SectionWrapper>

      </main>
    </div>
  );
}

export default Home;


 



