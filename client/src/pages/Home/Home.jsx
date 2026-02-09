import React from "react";
import { useSelector } from "react-redux";
import { useState , useMemo } from "react";

// moment 
import useCaseMeta from "../../../../server/src/moment/useCaseMeta";
import "./Home.css";



// Layout
import SectionWrapper from "../../layouts/section/SectionWrapper";



// Sections
import GreetingSection from "./GreetingSection/GreetingSection";
import TrendingForYouSection from "./TrendingSection/TrendingForYou";
import SearchSection from "./SearchSection/SearchSection";
import UseCaseSection from "./useCasedSection/UseCasedSection";



// components
import UseCaseSwitcher from "./useCasedSection/components/UseCaseSwitcher";

 



  function Home() {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;

  // useMemo use karenge taaki RANDOM sirf PEHLI BAAR (Mount) par chale
  // Baad mein user switcher se badle toh wahi rahe
  const initialRandomKey = useMemo(() => {
    const keys = Object.keys(useCaseMeta);
    return keys[Math.floor(Math.random() * keys.length)];
  }, []);

  const [activeUseCaseKey, setActiveUseCaseKey] = useState(initialRandomKey);
  const activeMeta = useCaseMeta[activeUseCaseKey];

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
          <SectionWrapper title="Trending For You" subtitle="Trending for you today!">
            <div className="horizontal-scroll-section">
              <TrendingForYouSection />
            </div>
          </SectionWrapper>




          {/* STICKY FILTER BAR */}
          <div className="filter-sticky-bar">
            <div className="filter-inner-content">
              <span className="filter-label"> Filters</span>
              <UseCaseSwitcher 
                activeUseCase={activeUseCaseKey} 
                onChange={setActiveUseCaseKey} 
              />
            </div>
          </div>  

          

          {/* DYNAMIC SECTION (Random on refresh, but stable on click) */}
          {activeMeta && (
            <SectionWrapper title={activeMeta.title} subtitle={activeMeta.subtitle}>
              <div className="horizontal-scroll-section">
                <UseCaseSection useCaseKey={activeUseCaseKey} />
              </div>
            </SectionWrapper>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
