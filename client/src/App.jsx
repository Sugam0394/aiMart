import { BrowserRouter, Routes, Route, Navigate }from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';


// Styles
 import "./App.css"
 import './styles/mobile-optimization.css';  
 

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
import AppInitializer from './components/DataInit/AppInitializer.jsx'






 
 function App() {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const { isInitialized } = useSelector((state) => state.auth);
  

  // Theme Logic
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

 return (
    <BrowserRouter>
      {/* 🟢 Step 1: Initialize App Data & Session */}
      <AppInitializer /> 

      {/* 🟢 Step 2: Global Wait (Sirf tab tak jab tak Session Verify nahi hota) */}
      {!isInitialized ? (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">AI Mart is Loading...</h2>
            <p className="mt-2 text-gray-400">Setting up your experience</p>
          </div>
        </div>
      ) : (
        /* 🟢 Step 3: Routes Render Only After Initialization */
        <Routes>
          {/* 🌍 1. PUBLIC ROUTES */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="tools/:id" element={<AiArt />} />
          </Route>

          {/* 🔐 2. AUTH ROUTES (Isme logout user hi ja sakta hai) */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* 🔐 3. COMMON PROTECTED ROUTES (User, Owner, Founder) */}
          <Route element={<ProtectedRoute allowedRoles={["user", "toolOwner", "founder"]} />}>
            <Route element={<UserLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="saved" element={<SavedTools />} />
              <Route path="tools/:id" element={<AiArt />} /> 
              <Route 
                path="settings" 
                element={<UserSettings isDark={isDark} setIsDark={setIsDark} />} 
              />
            </Route>
          </Route>

          {/* 🔐 4. TOOL OWNER DASHBOARD (Owner Only) */}
          <Route element={<ProtectedRoute allowedRoles={["toolOwner"]} />}>
            <Route path="toolowner" element={<ToolOwnerLayout />}>
              <Route path="dashboard" element={<ToolOwnerDashboard />}>
                <Route index element={<MyTool />} />
                <Route path="create-tool" element={<CreateTool />} />
                <Route path="edit-tool/:id" element={<EditTool />} />
              </Route>
              <Route 
                path="settings" 
                element={<ToolOwnerSettings isDark={isDark} setIsDark={setIsDark} />} 
              />
            </Route>
          </Route>

          {/* 🔐 5. FOUNDER DASHBOARD (Founder Only) */}
          <Route element={<ProtectedRoute allowedRoles={["founder"]} />}>
            <Route element={<FounderLayout />}>
              <Route path="founder/dashboard" element={<FounderDashboard />} />
              <Route 
                path="founder/settings" 
                element={<FounderSettings isDark={isDark} setIsDark={setIsDark} />} 
              />
            </Route>
          </Route>

          {/* 🛡️ CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

 
