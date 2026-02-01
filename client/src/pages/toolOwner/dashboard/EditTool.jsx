 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
 import { getMyTools , updateTool } from "../../../api/toolOwner/tool.services";
 import Toast from "../../../components/Toast/Toast";
import "../css/createTool.css"; // reuse same CSS

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
      <>
      <form onSubmit={handleSubmit} className="create-tool-form">
        <h2>Edit Tool</h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />

        <input
          name="primaryCategory"
          value={formData.primaryCategory}
          onChange={handleChange}
          required
        />

        <input
          placeholder="Categories (comma separated)"
          value={formData.categories.join(", ")}
          onChange={(e) => handleArrayChange("categories", e.target.value)}
        />

        <input
          placeholder="Intent Tags (comma separated)"
          value={formData.intentTags.join(", ")}
          onChange={(e) => handleArrayChange("intentTags", e.target.value)}
          required
        />

        <input
          placeholder="Output Type (comma separated)"
          value={formData.outputType.join(", ")}
          onChange={(e) => handleArrayChange("outputType", e.target.value)}
        />

        <select
          name="usageMode"
          value={formData.usageMode}
          onChange={handleChange}
        >
          <option value="online">Online</option>
          <option value="download">Download</option>
        </select>

        <select
          name="pricingType"
          value={formData.pricingType}
          onChange={handleChange}
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {/* Logo */}
        <input type="file" onChange={handleLogoChange} />
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Logo Preview"
            style={{ width: "80px", marginTop: "10px" }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Tool"}
        </button>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default EditTool;

