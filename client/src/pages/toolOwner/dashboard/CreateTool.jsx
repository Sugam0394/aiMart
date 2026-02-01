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
   const [activeHint, setActiveHint] = useState(null);


 
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
 


//  URL HELPER FUNCTION 
const normalizeUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
};


 

// clear handler Main Logi
 const clearUrlAndLogo = () => {
  setFormData(prev => ({ ...prev, url: "" }));
  setLogoFile(null);
  setLogoPreview(null);
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

 


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
     <>
      <form onSubmit={handleSubmit} className="create-tool-form">
        <h2>Create New Tool</h2>

        <input name="name" placeholder="Tool Name" onChange={handleChange} required />




        <input name="tagline" placeholder="Short tagline" onChange={handleChange} />




          <textarea name="description" placeholder="Full description" onChange={handleChange} required />




         <div className="url-input-wrapper">
  <input
    name="url"
    placeholder="Tool URL"
    value={formData.url}
    onChange={handleChange}
    onBlur={(e) =>
      setFormData(prev => ({
        ...prev,
        url: normalizeUrl(e.target.value.trim()),
      }))
    }
    required
  />

   
</div>

 






        <label className="logo-upload-label">Tool Logo</label>
        <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  onChange={handleLogoChange}
/>

   {logoPreview && (
  <div className="logo-preview">
    <img src={logoPreview} alt="Logo Preview" />
    <span className="clear-logo" onClick={clearUrlAndLogo}>✕</span>
  </div>
)}





  <input
  type="text"
  name="primaryCategory"
  placeholder="Primary Category"
  value={formData.primaryCategory}
  onChange={handleChange}
  required
  onFocus={() => setActiveHint("primaryCategory")}
  onBlur={() => setActiveHint(null)}
/>
   
    

{activeHint === "primaryCategory" && (
  <div className="field-hint">
    Choose the main purpose of your tool. <br />
    <strong>Examples:</strong><br />
    Study → learning, exams, notes<br />
    Content → writing, video, design<br />
    Business → marketing, finance, productivity
  </div>
)}




       <input
  placeholder="Categories "
  onFocus={() => setActiveHint("categories")}
  onBlur={() => setActiveHint(null)}
  onChange={(e) => handleArrayChange("categories", e.target.value)}
/>

{activeHint === "categories" && (
  <div className="field-hint">
    Add related topics your tool belongs to. <br />
    <strong>Example:</strong> productivity, focus, task-management
  </div>
)}

<input
  placeholder="Intent Tags (comma separated)"
  required
  onFocus={() => setActiveHint("intentTags")}
  onBlur={() => setActiveHint(null)}
  onChange={(e) => handleArrayChange("intentTags", e.target.value)}
/>

{activeHint === "intentTags" && (
  <div className="field-hint">
    What problem does your tool solve for users? <br />
    <strong>Example:</strong> write-faster, summarize-text, plan-day
  </div>
)}

         
   <input
  placeholder="Output Type (comma separated)"
  onFocus={() => setActiveHint("outputType")}
  onBlur={() => setActiveHint(null)}
  onChange={(e) => handleArrayChange("outputType", e.target.value)}
/>

{activeHint === "outputType" && (
  <div className="field-hint">
    What does your tool generate? <br />
    <strong>Example:</strong> text, pdf, image, checklist
  </div>
)}








        <select name="toolType" onChange={handleChange} required>
          <option value="">Tool Type</option>
          <option value="ai">AI</option>
          <option value="utility">Utility</option>
          <option value="service">Service</option>
        </select>






        <select name="usageMode" onChange={handleChange}>
          <option value="online">Online</option>
          <option value="download">Download</option>
        </select>

        <select name="pricingType" onChange={handleChange}>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>







        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Tool"}
        </button>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  ); 

}
  


export default CreateTool