import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import detectRoleFromIntent from '../../utils/roleDetector'
import "./ExploreResult.css";

const ExploreResult = ({ intent }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Role detect karo intent se
    const detectedRole = detectRoleFromIntent(intent);
    
    // 2. LocalStorage mein save karo taaki Home page ise use kare
    const profile = { 
      role: detectedRole, 
      updatedAt: new Date().toISOString(),
      source: "explore_wizard" 
    };
    localStorage.setItem("user_workflow_profile", JSON.stringify(profile));
  }, [intent]);

  return (
    <div className="explore-result-container">
      <div className="result-card">
        <div className="sparkle-icon"><Sparkles size={40} color="#FBBF24" /></div>
        <CheckCircle size={60} color="#10B981" className="main-check" />
        
        <h2>Aapka AI Blueprint Taiyaar Hai!</h2>
        <p className="intent-preview">Humne aapke goal: <span>"{intent}"</span> ke liye 5-step workflow create kiya hai.</p>
        
        <div className="role-reveal">
          <span>Detected Role:</span>
          <strong>{detectRoleFromIntent(intent).toUpperCase()}</strong>
        </div>

        <button className="cta-button" onClick={() => navigate("/")}>
          Mera Personalized Workflow Dekhein <ArrowRight size={20} />
        </button>
        
        <p className="note">Ab aap jab bhi Home page par jayenge, aapko tools aapke role ke hisaab se milenge.</p>
      </div>
    </div>
  );
};

export default ExploreResult;