import React from "react";
import "./GreetingSection.css";

function GreetingSection({ isAuthenticated, user }) {

  const getTimeContext = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Let's build something great today";
    if (hour < 17) return "Ready to make progress?";
    if (hour < 21) return "Let’s finish strong";
    return "Still creating? I like that";
  };

  const greetingTitle = isAuthenticated
    ? `Hey ${user?.name || "there"}`
    : "Discover the right AI tools";

  const greetingSubtitle = isAuthenticated
    ? getTimeContext()
    : "Built to help you ship faster and smarter.";

  return (
    <section className="greeting-section">
      <div className="greeting-card">
        <h1 className="greeting-title">{greetingTitle}</h1>
        <p className="greeting-subtitle">{greetingSubtitle}</p>
      </div>
    </section>
  );
}

export default GreetingSection;
 
