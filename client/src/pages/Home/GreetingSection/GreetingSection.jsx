 import React from 'react'
 import './GreetingSection.css'
 
 function GreetingSection( { isAuthenticated , user}) {


   const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const greetingTitle = isAuthenticated
    ? `${getTimeGreeting()}, ${user?.name || "there"} 👋`
    : "Welcome to AI-Mart";

  const greetingSubtitle = isAuthenticated
    ? "What would you like to work on today?"
    : "Find the right AI tools for your real work.";


   return (
         <section className="greeting-section">
      <div className="greeting-card">
        <h1 className="greeting-title">{greetingTitle}</h1>
        <p className="greeting-subtitle">{greetingSubtitle}</p>
      </div>
    </section>
   )
 }
 
 export default GreetingSection
