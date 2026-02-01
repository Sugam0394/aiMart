 import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useCaseMeta } from "../../../../server/src/moment/useCaseMeta";
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
  // Auth state section - 1
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;



  // Local state  // sections 3
 const [activeUseCaseKey, setActiveUseCaseKey] = useState("code-smarter");
const activeMeta = useCaseMeta[activeUseCaseKey];



 

 
 




  return (
    <div className="home-container"> 
    <main className="home-page">
      
      {/* 🔹 Greeting Section (Special / Non-wrapper) */}
      <GreetingSection
        isAuthenticated={isAuthenticated}
        user={user}

      />

        {/* 🔹 SECTION 0 — Smart Search (Signal Generator) */}
      <SectionWrapper
        variant="soft"
        title="Find the right AI tool"
        subtitle="Search by role, intent, or tool name"
      >
        <SearchSection />
      </SectionWrapper>


      {/* 🔹 SECTION 1 — Trending For You */}
      <SectionWrapper
        variant="default"
        title="Trending For You"
        subtitle="Based on your current intent and activity"
      >
        <TrendingForYouSection />
      </SectionWrapper>

  {/* 🔹 Section 3 - Dynamic Use Case Sections */}
 {/* 🔹 Use-Case Switcher */}
<UseCaseSwitcher
  activeUseCase={activeUseCaseKey}
  onChange={setActiveUseCaseKey}
/>

{/* 🔹 Section 3 - Dynamic Use Case Sections */}
 {activeMeta && (
  <SectionWrapper
    variant="default"
    title={activeMeta.title}
    subtitle={activeMeta.subtitle}
  >
    <UseCaseSection useCaseKey={activeUseCaseKey} />
  </SectionWrapper>
)}


 
 




		 
 

       

    </main>
    </div>
  );
}

export default Home;
