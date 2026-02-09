import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
 import { getAccessToken } from "./utils/token.js";

//layout
 import PublicLayout from "./layouts/PublicLayout";
 import AuthLayout from "./layouts/AuthLayout.jsx";
 import UserLayout from "./layouts/UserLayout.jsx";
 import ToolOwnerLayout from "./layouts/ToolOwnerLayout.jsx";
 import FounderLayout from "./layouts/FounderLayout.jsx";
 

 // Public Pages
 import Home from "./pages/Home/Home";
 import Login from "./pages/Login/Login";
 import Register from "./pages/Register/Register";
 import AiArt from "./pages/aiArt/AiArt.jsx";
 import SavedTools from "./components/SavedTools/SavedTools.jsx";



 // user Pages
 import Explore from "./pages/Explore/Explore.jsx";
 
 
 


 // Dasboard 
 import FounderDashboard from "./pages/founder/Dashboard/FounderDashboard.jsx";
 import ToolOwnerDashboard from "./pages/toolOwner/dashboard/ToolOwnerDashboard.jsx";
 import ProtectedRoute from "./routes/ProtectedRoute.jsx";
 




 // ToolOwner Dashboard
 import CreateTool from "./pages/toolOwner/dashboard/CreateTool.jsx";
 import EditTool from "./pages/toolOwner/dashboard/EditTool.jsx";
 import MyTool from "./pages/toolOwner/dashboard/MyTool.jsx";


 // settings
 import ToolOwnerSettings from "./pages/toolOwner/settings/ToolOwnerSettings.jsx";
 import FounderSettings from "./pages/founder/settings/FounderSettings.jsx";
 import UserSettings from "./pages/user/settings/UserSettings.jsx";
 
 

// Data Initializer
import DataInitializer from "./components/DataInit/DataInitializer.jsx";
import AppInitializer from "./components/DataInit/AppInitializer.jsx";







function App() {
 const { isInitialized } = useSelector((state) => state.auth);
 const token = getAccessToken();


  return (
     <BrowserRouter>
     <AppInitializer /> {/* Global data initialization component */}
    <DataInitializer /> {/* Global data initialization component */}

     {token && !isInitialized ? (
    <div className="loading-screen">
      <h2>Authenticating...</h2>
    </div>
  ) : (
  <Routes>

    {/* 🌍 PUBLIC LAYOUT */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    {/* 🔐 AUTH ONLY */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* 🔐 SMART HOME + EXPLORE (ALL LOGGED-IN ROLES) */}
    <Route element={<ProtectedRoute allowedRoles={["user","toolOwner","founder"]} />}>
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/saved" element={<SavedTools />} />
        <Route path="/tools/:id" element={<AiArt />} />
      </Route>
    </Route>

      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
      <Route element={<UserLayout />}>
        <Route path="/settings" element={<UserSettings />} />
      </Route>
        </Route>
    


       {/* 🔐 TOOL OWNER DASHBOARD ✅ FIX */}
 <Route element={<ProtectedRoute allowedRoles={["toolOwner"]} />}>
  <Route path="/toolowner" element={<ToolOwnerLayout />}>

    {/* DASHBOARD */}
    <Route path="dashboard" element={<ToolOwnerDashboard />}>
      <Route index element={<MyTool />} />
      <Route path="create-tool" element={<CreateTool />} />
      <Route path="edit-tool/:id" element={<EditTool />} />
    </Route>

    {/* SETTINGS */}
    <Route path="settings" element={<ToolOwnerSettings />} />

  </Route>
</Route>




     
 {/* 🔐 FOUNDER DASHBOARD */}
<Route element={<ProtectedRoute allowedRoles={["founder"]} />}>
  <Route element={<FounderLayout />}>
    <Route path="/founder/dashboard" element={<FounderDashboard />}>
      {/* Nested routes not needed now, sidebar state controls content */}
    </Route>
    <Route path="/founder/settings" element={<FounderSettings />} />
  </Route>
</Route>


  </Routes>
  )}
      
</BrowserRouter>

  )
}

export default App
