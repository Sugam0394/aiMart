 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
 import { getMyTools , updateTool } from "../../../api/toolOwner/tool.services";
 import Toast from "../../../components/Toast/Toast";
 import '../css/CreateTool.css'

function EditTool() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);


  // 🔹 Add state for logo
const [logoFile, setLogoFile] = useState(null);
const [logoPreview, setLogoPreview] = useState(formData?.logo || "");

  // 🔹 Fetch tool & prefill
  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await getMyTools();
        const tool = res.data.tools.find((t) => t._id === id);

        if (!tool || tool.status !== "live") {
          navigate("/toolowner/dashboard");
          return;
        }

         setFormData({
          name: tool.name || "",
          tagline: tool.tagline || "",
          description: tool.description || "",
          url: tool.url || "",
          primaryCategory: tool.primaryCategory || "",
          categories: tool.categories || [],
          intentTags: tool.intentTags || [],
          outputType: tool.outputType || [],
          usageMode: tool.usageMode || "online",
          pricingType: tool.pricingType || "free",
          logo: tool.logo || "",
        });

        setLogoPreview(tool.logo || "");
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTool();
  }, [id, navigate]);

  // 🔹 Handlers (same as CreateTool)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle logo change
const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file)); // preview
  }
};

  const handleArrayChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()).filter(Boolean),
    }));
  };
 
 // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

   try {
      setLoading(true);
      const data = { ...formData };

      // If new logo uploaded, append file
      if (logoFile) {
        const formDataObj = new FormData();
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            formDataObj.append(key, JSON.stringify(data[key]));
          } else {
            formDataObj.append(key, data[key]);
          }
        });
        formDataObj.append("logo", logoFile);
        await updateTool(id, formDataObj, true); // true = multipart
      } else {
        await updateTool(id, data);
      }

      setToast({
        type: "success",
        message: "Tool updated successfully ✅",
      });

      setTimeout(() => navigate("/toolowner/dashboard"), 1500);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <p>Loading tool...</p>;
  if (!formData) return null;

  return (
    <div className="create-tool-wrapper">
      <div className="form-header">
        <h2>Update Tool Details</h2>
        <p>Refine your tool's information to keep it competitive and accurate.</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-grid">
          
          {/* LEFT COLUMN: PRIMARY INFO */}
          <div className="form-column">
            <div className="section-card">
              <h3>Core Identity</h3>
              <div className="input-box">
                <label>Tool Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="input-box">
                <label>Tagline</label>
                <input name="tagline" value={formData.tagline} onChange={handleChange} />
              </div>

              <div className="input-box">
                <label>Website URL</label>
                <input name="url" value={formData.url} onChange={handleChange} required />
              </div>

              <div className="input-box">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </div>
            </div>

            <div className="section-card">
              <h3>Visual Assets</h3>
              <div className="logo-upload-zone has-file">
                 <input type="file" id="edit-logo" onChange={handleLogoChange} hidden />
                 <label htmlFor="edit-logo" className="upload-label">
                    {logoPreview ? (
                      <div className="preview-container">
                        <img src={logoPreview} alt="Tool Logo" />
                        <span className="change-hint">Click to replace logo</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="icon">📁</span>
                        <span>Upload New Logo</span>
                      </div>
                    )}
                 </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CLASSIFICATION & SETTINGS */}
          <div className="form-column">
            <div className="section-card">
              <h3>Taxonomy & Discovery</h3>
              
              <div className="input-box">
                <label>Primary Category</label>
                <input name="primaryCategory" value={formData.primaryCategory} onChange={handleChange} required />
              </div>

              <div className="input-box">
                <label>Intent Tags</label>
                <input 
                  value={formData.intentTags.join(", ")} 
                  onChange={(e) => handleArrayChange("intentTags", e.target.value)} 
                  placeholder="e.g. ai-writing, summarizer"
                  required 
                />
              </div>

              <div className="input-box">
                <label>Output Types</label>
                <input 
                  value={formData.outputType.join(", ")} 
                  onChange={(e) => handleArrayChange("outputType", e.target.value)} 
                  placeholder="e.g. Text, PDF, Image"
                />
              </div>
            </div>

            <div className="section-card">
              <h3>Service Configuration</h3>
              <div className="input-row">
                <div className="input-box">
                  <label>Usage Mode</label>
                  <select name="usageMode" value={formData.usageMode} onChange={handleChange}>
                    <option value="online">Online/Web</option>
                    <option value="download">Downloadable</option>
                  </select>
                </div>
                <div className="input-box">
                  <label>Pricing Model</label>
                  <select name="pricingType" value={formData.pricingType} onChange={handleChange}>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="freemium">Freemium</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn update-theme" disabled={loading}>
                {loading ? "Saving Changes..." : "Save Updates"}
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/toolowner/dashboard")}>
                Discard Changes
              </button>
            </div>
          </div>

        </div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

export default EditTool;

