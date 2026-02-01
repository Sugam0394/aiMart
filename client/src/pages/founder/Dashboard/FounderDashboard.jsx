import React from 'react'
import FounderToolOwnerRequests from './FounderToolOwnerRequests'
import ApprovedToolOwners from './ApprovedToolOwner'
import FounderSidebar from '../../../components/sidebar/FounderSidebar'
import PendingToolFormRequest from '../Dashboard/PendingToolFormRequest'
import ApprovedToolFormRequest from '../Dashboard/ApprovedToolFormRequest'
import "../css/FounderDashboard.css"
import { useState } from 'react'

function FounderDashboard() {
 const [activeView, setActiveView] = useState("pending");




  return (
  
  <div className="founder-dashboard-wrapper">
      {/* Sidebar */}
      <FounderSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main content */}
      <div className="dashboard-content">
        {activeView === "pendingTO" && (
          <div className="view-section">
            <FounderToolOwnerRequests />
          </div>
        )}

        {activeView === "approvedTO" && (
          <div className="view-section">
            <ApprovedToolOwners />
          </div>
        )}

        {activeView === "pendingTF" && (
          <div className="view-section">
            <PendingToolFormRequest />
          </div>
        )}

        {activeView === "approvedTF" && (
          <div className="view-section">
            <ApprovedToolFormRequest />
          </div>
        )}
      </div>
    </div>

  )
}

export default FounderDashboard