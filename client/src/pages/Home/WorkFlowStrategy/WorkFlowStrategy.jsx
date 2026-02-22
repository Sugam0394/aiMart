 import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; 
import './WorkflowStrategy.css';

const workflowData = {
  founder: {
    title: "Founder", icon: "🚀", saved: 23, unit: "ghante", week: "is hafte",
    steps: [
      { time: "9:00 AM", task: "Business idea validate kiya", tool: "Perplexity AI", link: "/tool/perplexity-ai", manual: "2 din research", saved: "16 hrs", icon: "💡" },
      { time: "9:30 AM", task: "Full pitch deck ready", tool: "Gamma AI", link: "/tool/gamma-ai", manual: "1 din kaam", saved: "8 hrs", icon: "📄" },
      { time: "12:00 PM", task: "Product visuals generate kiye", tool: "Midjourney", link: "/tool/midjourney", manual: "2 din design", saved: "14 hrs", icon: "🎨" },
    ]
  },
  freelancer: {
    title: "Freelancer", icon: "💼", saved: 19, unit: "ghante", week: "is hafte",
    steps: [
      { time: "9:00 AM", task: "Client proposal draft", tool: "Copy.ai", link: "/tool/copy-ai", manual: "3 ghante", saved: "3 hrs", icon: "📄" },
      { time: "10:30 AM", task: "3 client deliverables draft", tool: "Jasper AI", link: "/tool/jasper-ai", manual: "1 din", saved: "8 hrs", icon: "✍️" },
      { time: "2:30 PM", task: "Weekly invoice automated", tool: "Notion AI", link: "/tool/notion-ai", manual: "1 ghanta", saved: "1 hr", icon: "📊" },
    ]
  },
  student: {
    title: "Student", icon: "🎓", saved: 18, unit: "ghante", week: "exam week",
    steps: [
      { time: "9:00 AM", task: "Lecture notes summarize", tool: "Otter.ai", link: "/tool/otter-ai", manual: "4 ghante", saved: "4 hrs", icon: "📝" },
      { time: "10:00 AM", task: "Research paper first draft", tool: "ChatGPT", link: "/tool/chatgpt", manual: "1 din", saved: "8 hrs", icon: "🔬" },
      { time: "1:30 PM", task: "Flash cards for revision", tool: "Quizlet AI", link: "/tool/quizlet-ai", manual: "2 ghante", saved: "2 hrs", icon: "🃏" },
    ]
  },
  marketer: {
    title: "Marketer", icon: "📣", saved: 28, unit: "ghante", week: "is hafte",
    steps: [
      { time: "9:00 AM", task: "30 posts content calendar", tool: "Buffer AI", link: "/tool/buffer-ai", manual: "2 din", saved: "16 hrs", icon: "📅" },
      { time: "11:30 AM", task: "SEO blog post (1500 words)", tool: "Surfer SEO", link: "/tool/surfer-seo", manual: "6 ghante", saved: "6 hrs", icon: "🔍" },
      { time: "2:30 PM", task: "Campaign analytics report", tool: "Tableau AI", link: "/tool/tableau-ai", manual: "2 ghante", saved: "2 hrs", icon: "📈" },
    ]
  }
};

const WorkFlowStrategy = () => {
  const { user } = useSelector((state) => state.auth);
  
  // 1. Initial State Logic (Persistence)
  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem("aimart_preferred_role");
    if (saved && workflowData[saved]) return saved;
    return user?.role && workflowData[user.role.toLowerCase()] 
      ? user.role.toLowerCase() 
      : 'founder';
  });

  const [displayTime, setDisplayTime] = useState(0);
  const data = workflowData[activeRole] || workflowData.founder;

  // 2. Counter Animation Logic for Dopamine Hit
  useEffect(() => {
    let start = 0;
    const end = data.saved;
    if (start === end) return;

    let totalMiliseconds = 800; // Animation speed
    let timer = setInterval(() => {
      start += 1;
      setDisplayTime(start);
      if (start === end) clearInterval(timer);
    }, totalMiliseconds / end);

    return () => clearInterval(timer);
  }, [activeRole, data.saved]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    localStorage.setItem("aimart_preferred_role", role);
  };

  const handleCopyPrompt = (task, tool) => {
    const prompt = `I need to ${task} using ${tool}. Give me the best way to do this in half the time.`;
    navigator.clipboard.writeText(prompt);
    // Aap yahan ek toast notification bhi add kar sakte hain
    alert("🚀 Prompt copied! Use it in " + tool);
  };

  return (
    <div className="strategy-wrapper">
      <div className="strategy-header">
        <span className="eyebrow">🚀 Workflow Engine</span>
        <h2>1 hafte ka kaam — <span>10 minute mein.</span></h2>
        <p>aiMart tool directory nahi, tera growth engine hai.</p>
      </div>

      <div className="role-tabs">
        {Object.keys(workflowData).map((key) => (
          <button 
            key={key} 
            className={`role-tab ${activeRole === key ? 'active' : ''}`}
            onClick={() => handleRoleChange(key)}
          >
            <span className="tab-icon">{workflowData[key].icon}</span>
            {workflowData[key].title}
          </button>
        ))}
      </div>

      <div className="timeline-container">
        {data.steps.map((step, index) => (
          <div className="timeline-card" key={`${activeRole}-${index}`}>
            <div className="step-icon">{step.icon}</div>
            <div className="step-content">
              <div className="step-header">
                <span className="step-time">{step.time}</span>
                <span className="time-badge">⚡ {step.saved} saved</span>
              </div>
              <h3>{step.task}</h3>
              <div className="step-footer">
                <div className="footer-links">
                  <Link to={step.link} className="tool-name">
                    🛠 {step.tool}
                  </Link>
                  <button 
                    className="copy-prompt-btn"
                    onClick={() => handleCopyPrompt(step.task, step.tool)}
                  >
                    📋 Copy Prompt
                  </button>
                </div>
                <span className="manual-time">pehle: {step.manual}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-bar">
        <div className="summary-text">
          Total time saved <strong>{data.week}</strong>
        </div>
        <div className="summary-total">⏱ {displayTime} {data.unit} bachaye 🔥</div>
      </div>

      <div className="myth-buster-grid">
        <div className="myth-card">
          <div className="myth-bad">❌ "AI tools mehenge hain"</div>
          <div className="myth-good">✅ aiMart pe 70% tools free tier ke saath hain</div>
        </div>
        <div className="myth-card">
          <div className="myth-bad">❌ "AI mera kaam chheen lega"</div>
          <div className="myth-good">✅ AI tera assistant hai, tu boss hai</div>
        </div>
        <div className="myth-card">
          <div className="myth-bad">❌ "Mushkil lagta hai"</div>
          <div className="myth-good">✅ Agar Google chala sakte ho, toh ye bhi chala loge</div>
        </div>
      </div>
      {/* Strategy Section ke end mein (Myth Buster ke baad) */}
<div className="strategy-cta">
  <p>Tere role ke liye 50+ aur tools hain</p>
  <Link to="/explore" className="explore-btn">
    Saare {activeRole} Tools Dekho →
  </Link>
</div>
    </div>
  );
};

export default WorkFlowStrategy;