import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";


import GreetingSection from "./GreetingSection/GreetingSection";
import TrendingForYouSection from "./TrendingSection/TrendingForYou";
import SearchSection from "./SearchSection/SearchSection";
 
import UseCaseSwitcher from "./useCasedSection/components/UseCaseSwitcher";
import UseCaseSection from "./useCasedSection/UseCasedSection";
import RisingToolsSection from "./RisingTool/RisingToolSection";
import RecommendedSection from "./RecommendSection/RecommendSection";
 
// Layout
import SectionWrapper from "../../layouts/section/SectionWrapper";



import "./Home.css";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const { availableUseCases } = useSelector((state) => state.moment);
  
  const isAuthenticated = !!user;
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [activeUseCaseKey, setActiveUseCaseKey] = useState("");

 
  const currentUseCaseKey = useMemo(() => {
 
    if (activeUseCaseKey) return activeUseCaseKey;

    
    if (availableUseCases && availableUseCases.length > 0) {
      
    return availableUseCases[0].key;
    }

    return "";
  }, [availableUseCases, activeUseCaseKey]);

  // 2. Metadata nikalne ke liye hum "currentUseCaseKey" ka use karenge
  const activeMeta = availableUseCases.find(
    (uc) => uc.key === currentUseCaseKey
  );

  return (
   <div className="home-container">
      <main className="home-page">
        {/* HERO SECTION */}
        <div className="home-hero-container">
          <GreetingSection isAuthenticated={isAuthenticated} user={user} />
          <div className="search-overlay-box">
            <SearchSection />
          </div>
        </div>

        <div className="sections-stack">
          {/* TRENDING */}
         

          {/* STICKY FILTER BAR */}
          <div className="filter-sticky-bar">
            <div className="filter-inner-content">
              <span className="filter-label">Filters</span>
              <UseCaseSwitcher 
                activeUseCase={currentUseCaseKey} 
                onChange={setActiveUseCaseKey} 
              />
            </div>
          </div>

          {/* DYNAMIC USE CASE SECTION */}
          {activeMeta && (
            <SectionWrapper 
              title={activeMeta.label} 
              subtitle={`${activeMeta.toolCount} AI tools available`}
            >
              <div className="horizontal-scroll-section">
                {/* Yahan bhi currentUseCaseKey pass karein */}
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

        {/* RISING TOOLS */}
        <SectionWrapper 
          title="🚀 Rising Tools" 
          subtitle="New and featured AI tools gaining momentum"
        >
          <RisingToolsSection />
        </SectionWrapper>

        {/* RECOMMENDED */}
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
