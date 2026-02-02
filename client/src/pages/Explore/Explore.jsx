import React from 'react'
import './styles/Explore.css'

function Explore() {

  // Dummy intents (temporary)
const DUMMY_INTENTS = [
  "Study better",
  "Create content",
  "Code faster",
  "Grow business",
  "Design visuals",
  "Automate tasks"
];

  return (
      <div className="explore-container">
      
      {/* Page Heading */}
      <h1 className="explore-title">Explore AI Tools</h1>
      <p className="explore-subtitle">
        Discover tools based on what you want to achieve
      </p>

      {/* Intent-based section */}
     <section className="explore-intents">
  <h2>What do you want to do?</h2>

  <div className="intent-grid">
    {DUMMY_INTENTS.map((intent, index) => (
      <div key={index} className="intent-card">
        {intent}
      </div>
    ))}
  </div>
</section>


      {/* Filters / Categories */}
      <section className="explore-filters">
        <h2>Filter tools</h2>
        <div className="filter-placeholder">
          Categories & filters will live here
        </div>
      </section>

    </div>
  )
}

export default Explore