import React from 'react'
import { useState , useEffect, useRef } from 'react';
import { createTool } from '../../../api/toolOwner/tool.services'
import '../css/CreateTool.css'
import Toast from '../../../components/Toast/Toast';
import { useNavigate } from "react-router-dom";
import { getMyTools } from '../../../api/toolOwner/tool.services';
 

function CreateTool() {
 const navigate = useNavigate();
const fileInputRef = useRef(null);
const [activeHint, setActiveHint] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    url: "",
    primaryCategory: "",
    categories: [],
    intentTags: [],
    outputType: [],
    toolType: "",
    usageMode: "online",
    pricingType: "free",
  });

  const [logoFile, setLogoFile] = useState(null); // for file
  const [logoPreview, setLogoPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
   const [checking, setChecking] = useState(true);


 
 useEffect(() => {
  const checkPendingTool = async () => {
    try {
      const res = await getMyTools();
      const hasPending = res.data.tools.some(
        tool => tool.status === "pending"
      );

      if (hasPending) {
        setToast({
          type: "error",
          message:
            "You already have a tool pending approval. You cannot submit another tool.",
        });

        setTimeout(() => {
          navigate("/toolowner/dashboard");
        }, 2000);
      } else {
        setChecking(false);
      }
    } catch (err) {
      console.error(err);
      setChecking(false);
    }
  };

  checkPendingTool();
}, [navigate]);

if (checking) {
  return <p style={{ padding: "2rem" }}>Checking eligibility...</p>;
}
 




 

// clear handler Main Logi

 


  // 🔹 Text/Select input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Comma separated → array
  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.split(",").map(v => v.trim()).filter(Boolean),
    }));
  };

  // 🔹 Logo file input
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setToast({ type: "error", message: "Please upload a valid image file" });
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;


    if (formData.intentTags.length === 0) {
      return setToast({ type: "error", message: "Please add at least one intent tag" });
    }



    try {
      setLoading(true);

      // 🔹 FormData for file upload
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => data.append(key, v));
        } else {
          data.append(key, value);
        }
      });
      if (logoFile) {
  data.append("logo", logoFile);
}


      await createTool(data, { headers: { "Content-Type": "multipart/form-data" } });

      setToast({ type: "success", message: "Tool submitted successfully! Pending founder approval 🚀" });

      setTimeout(() => navigate("/toolowner/dashboard"), 2000);
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
 
  
}



  
  return (
 <div className="create-tool-wrapper">
    <div className="form-header">
      <h2>List Your AI Tool</h2>
      <p>Fill in the details to submit your tool for community approval.</p>
    </div>

    <form onSubmit={handleSubmit} className="modern-form">
      <div className="form-grid">
        
        {/* LEFT COLUMN: BASIC INFO */}
        <div className="form-column">
          <div className="section-card">
            <h3>Basic Details</h3>
            <div className="input-box">
              <label>Tool Name</label>
              <input name="name" placeholder="e.g. ChatGP-Pro" onChange={handleChange} required />
            </div>
            
            <div className="input-box">
              <label>Tagline</label>
              <input name="tagline" placeholder="Briefly describe its power" onChange={handleChange} />
            </div>

            <div className="input-box">
              <label>Website URL</label>
              <input name="url" placeholder="https://yourtool.com" value={formData.url} onChange={handleChange} required />
            </div>

            <div className="input-box">
              <label>Description</label>
              <textarea name="description" placeholder="What makes this tool special?" onChange={handleChange} required />
            </div>
          </div>

          <div className="section-card">
            <h3>Visual Identity</h3>
            <div className={`logo-upload-zone ${logoPreview ? 'has-file' : ''}`}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoChange} id="logo-input" hidden />
              <label htmlFor="logo-input" className="upload-label">
                {logoPreview ? (
                  <div className="preview-container">
                    <img src={logoPreview} alt="Preview" />
                    <span className="change-hint">Change Logo</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="icon">📁</span>
                    <span>Upload Tool Logo</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLASSIFICATION */}
        <div className="form-column">
          <div className="section-card">
            <h3>Categories & Tags</h3>
            
            <div className="input-box">
              <label>Primary Category</label>
              <input
                name="primaryCategory"
                placeholder="e.g. Productivity"
                onChange={handleChange}
                required
                onFocus={() => setActiveHint("primaryCategory")}
                onBlur={() => setActiveHint(null)}
              />
              {activeHint === "primaryCategory" && <p className="hint-box">Main purpose of the tool.</p>}
            </div>

            <div className="input-box">
              <label>Intent Tags (Comma separated)</label>
              <input placeholder="write-code, edit-video..." onChange={(e) => handleArrayChange("intentTags", e.target.value)} required />
            </div>

            <div className="input-box">
              <label>Pricing Model</label>
              <select name="pricingType" onChange={handleChange}>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="freemium">Freemium</option>
              </select>
            </div>
          </div>

          <div className="section-card">
            <h3>Deployment</h3>
            <div className="input-row">
              <div className="input-box">
                <label>Type</label>
                <select name="toolType" onChange={handleChange} required>
                  <option value="ai">AI Tool</option>
                  <option value="utility">Utility</option>
                </select>
              </div>
              <div className="input-box">
                <label>Mode</label>
                <select name="usageMode" onChange={handleChange}>
                  <option value="online">Online/Web</option>
                  <option value="download">Downloadable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Submit for Approval"}
            </button>
          </div>
        </div>

      </div>
    </form>
    {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
  </div>
  ); 

}
  


export default CreateTool