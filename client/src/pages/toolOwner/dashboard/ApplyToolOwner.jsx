import React, {useState, useEffect} from "react";
 import { useSelector } from 'react-redux'
import api from "../../../api/axios";
import toast from 'react-hot-toast'
import '../css/ApplyToolOwner.css'

function ApplyToolOwner() {

   // ✅ Safe access: destructuring removed, null-safe
  const user = useSelector((state) => state.auth.user);


  const [formData, setFormData] = useState({
    toolName: "",
    website: "",
    description: "",
    proofLinks: "",
  });

   const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);


  useEffect(() => {
    if (!user) {
      setStatusLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await api.get("/my-toolowner-request");
        setRequestStatus(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, [user]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

   

    try {
      const payload = {
        ...formData,
        proofLinks: formData.proofLinks
          .split(",")
          .map((link) => link.trim()),
      };

      const res = await api.post("/request-toolowner", payload);
      toast.success(res.data.message);

      setFormData({
        toolName: "",
        website: "",
        description: "",
        proofLinks: "",
      });

      setRequestStatus({ status: "pending" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (statusLoading) {
    return <p className="status-loading">Checking your status…</p>;
  }

  if (!user) {
    return (
      <div className="toolowner-apply">
        <p className="text-red">Login required to apply</p>
      </div>
    );
  }

  if (requestStatus?.status === "pending") {
    return (
      <div className="status-card pending">
        <h3>Application under review ⏳</h3>
        <p>Please wait while our founder reviews your request.</p>
      </div>
    );
  }

  if (requestStatus?.status === "approved") {
    return (
      <div className="status-card approved">
        <h3>You are now a ToolOwner 🎉</h3>
        <a href="/toolowner/dashboard">Go to Dashboard</a>
      </div>
    );
  }

  return (
     <div className="toolowner-apply">
      <h2>Apply to become a ToolOwner</h2>

      {requestStatus?.status === "rejected" && (
        <p className="text-red">
          {requestStatus.reviewNote || "Your previous request was rejected."}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="toolName"
          placeholder="Tool / Company Name"
          value={formData.toolName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="website"
          placeholder="Website / Demo Link"
          value={formData.website}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Short description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="proofLinks"
          placeholder="Proof links (comma separated)"
          value={formData.proofLinks}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}


export default ApplyToolOwner
 