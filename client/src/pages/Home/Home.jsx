 import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomeData } from "../../app/features/MomentSlice";

import GreetingSection from "./GreetingSection/GreetingSection";
import TrendingForYouSection from "./TrendingSection/TrendingForYou";
import SearchSection from "./SearchSection/SearchSection";
import UseCaseSwitcher from "./useCasedSection/components/UseCaseSwitcher";
import UseCaseSection from "./useCasedSection/UseCasedSection";
import RisingToolsSection from "./RisingTool/RisingToolSection";
import RecommendedSection from "./RecommendSection/RecommendSection";
import SectionWrapper from "../../layouts/section/SectionWrapper";

 
import ToolCardSkeleton from "../aiArt/components/ToolCardSkeleton"; 
import WorkFlowStrategy from "./WorkFlowStrategy/WorkFlowStrategy"; // ✅ NEW STRATEGY COMPONENT


 
import "./HomeRedesign.css";  
 
 

// ── HomeSkeleton Component ──────────────────────────────
function HomeSkeleton() {
  return (
    <div className="home-container">
      <main className="home-page">

        {/* Greeting Card Skeleton */}
        <div className="home-hero-container">
          <div className="skeleton-greeting skeleton-shimmer"></div>
          <div className="skeleton-search skeleton-shimmer"></div>
        </div>

        {/* Filter Pills Skeleton */}
        <div className="skeleton-filter-bar">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton-pill skeleton-shimmer"></div>
          ))}
        </div>

        {/* Cards Row 1 Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-section-title skeleton-shimmer"></div>
          <div className="skeleton-cards-row">
            {[1, 2, 3, 4].map(i => <ToolCardSkeleton key={i} />)}
          </div>
        </div>

        {/* Cards Row 2 Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-section-title skeleton-shimmer"></div>
          <div className="skeleton-cards-row">
            {[1, 2, 3, 4].map(i => <ToolCardSkeleton key={i} />)}
          </div>
        </div>

      </main>
    </div>
  );
}

function Home() {
  const dispatch = useDispatch(); 
  // ✅ FIX: isInitialized ko bhi yahan se nikaalo
  const { user, isInitialized } = useSelector((state) => state.auth); 
  const { availableUseCases = [], homeStatus = "idle" } = useSelector((state) => state.moment || {});
  
  const isAuthenticated = !!user;
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [activeUseCaseKey, setActiveUseCaseKey] = useState("");

  useEffect(() => {
    // ✅ FIX: "isInitialized" check add kiya taaki register page par toast error na aaye [cite: 142, 148]
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

         
        <SectionWrapper 
  title="AI Workflows" 
  subtitle="Boost your productivity with these strategies"
> 
  <WorkFlowStrategy />
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


 



