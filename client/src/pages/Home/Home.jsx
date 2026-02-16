 { /* import React, { useState, useMemo } from "react";


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

export default Home;  */ }


import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
 

import GreetingSection from "./GreetingSection/GreetingSection";
import TrendingForYouSection from "./TrendingSection/TrendingForYou";
import SearchSection from "./SearchSection/SearchSection";
import UseCaseSwitcher from "./useCasedSection/components/UseCaseSwitcher";
import UseCaseSection from "./useCasedSection/UseCasedSection";
import RisingToolsSection from "./RisingTool/RisingToolSection";
import RecommendedSection from "./RecommendSection/RecommendSection";
import SectionWrapper from "../../layouts/section/SectionWrapper";

import "./Home.css";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const { availableUseCases } = useSelector((state) => state.moment);
  const dispatch = useDispatch();
  
  const isAuthenticated = !!user;
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [activeUseCaseKey, setActiveUseCaseKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  
 useEffect(() => {
  const prefetchData = async () => {
    try {
      setIsLoading(true);
      console.log("🚀 Parallel Fetching Started...");

      // Render free tier ko jagane ke liye aur error handle karne ke liye
      // Agar aapke paas abhi actions ready nahi hain, toh ise khali mat chhodiye
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      // Ye line execution ko aage badhayegi aur 'hidden' class hatayegi
      setIsLoading(false); 
    }
  };
  prefetchData();
}, [dispatch]);

  const currentUseCaseKey = useMemo(() => {
    if (activeUseCaseKey) return activeUseCaseKey;
    if (availableUseCases && availableUseCases.length > 0) {
      return availableUseCases[0].key;
    }
    return "";
  }, [availableUseCases, activeUseCaseKey]);

  const activeMeta = availableUseCases.find((uc) => uc.key === currentUseCaseKey);

  return (
    <div className="home-container">
      {/* Agar loading ho rahi hai toh full page loader dikhao */}
      {isLoading && (
        <div className="loading-overlay">
          <p>Optimizing aiMart for you...</p>
        </div>
      )}
       <main className={`home-page ${isLoading ? "hidden" : ""}`}>
        <div className="home-hero-container">
          <GreetingSection isAuthenticated={isAuthenticated} user={user} />
          <div className="search-overlay-box">
            <SearchSection />
          </div>
        </div>

        <div className="sections-stack">
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
                <UseCaseSection useCaseKey={currentUseCaseKey} />
              </div>
            </SectionWrapper>
          )}

          {/* TRENDING */}
          <SectionWrapper title="Trending For You" subtitle="Trending for you today!">
            <div className="horizontal-scroll-section">
              <TrendingForYouSection />
            </div>
          </SectionWrapper>

          {/* RISING TOOLS */}
          <SectionWrapper title="🚀 Rising Tools" subtitle="New and featured AI tools">
            <RisingToolsSection />
          </SectionWrapper>

          {/* RECOMMENDED */}
          <SectionWrapper 
            title={isPersonalized ? "🎯 Based on Your Interests" : "🌟 Handpicked For You"} 
            subtitle={isPersonalized ? "Based on your recent activity" : "Top rated tools"}
          >
            <RecommendedSection onDataLoaded={(val) => setIsPersonalized(val)} />
          </SectionWrapper>
        </div>
      </main>
    </div>
  );
}

export default Home;



