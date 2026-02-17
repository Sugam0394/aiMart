import { BrowserRouter, Routes, Route, Navigate }from "react-router-dom";
import { useSelector } from "react-redux";
 import { getAccessToken } from "./utils/token.js";
 import { Link } from "react-router-dom";
 import "./App.css"
 

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
  const { isInitialized , user } = useSelector((state) => state.auth);
  const token = getAccessToken();
 
  if (token && !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold animate-pulse">aiMart </h2>
          <p className="mt-2 text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
  <BrowserRouter>
    {/* Background sync chalta rahega */}
    <AppInitializer /> 

    <Routes>
      {/* 🌍 1. PUBLIC ROUTES (Landing Page with Navbar) */}
      <Route element={<PublicLayout />}>
        <Route 
          path="/home" 
          element={
            // Agar logged in hai, toh redirect. Nahi toh Home dikhao.
            isInitialized && user ? (
              <Navigate to={user.role === "toolOwner" ? "/toolowner/dashboard" : "/explore"} replace />
            ) : (
              <Home />
            )
          } 
        />
      </Route>

      {/* 🔐 2. AUTH ROUTES (Login/Register) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔐 3. COMMON PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["user", "toolOwner", "founder"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<SavedTools />} />
          <Route path="/tools/:id" element={<AiArt />} />
          <Route path="/settings" element={<UserSettings />} />
        </Route>
      </Route>

      {/* 🔐 4. TOOL OWNER DASHBOARD */}
      <Route element={<ProtectedRoute allowedRoles={["toolOwner"]} />}>
        <Route path="/toolowner" element={<ToolOwnerLayout />}>
          <Route path="dashboard" element={<ToolOwnerDashboard />}>
            <Route index element={<MyTool />} />
            <Route path="create-tool" element={<CreateTool />} />
            <Route path="edit-tool/:id" element={<EditTool />} />
          </Route>
          <Route path="settings" element={<ToolOwnerSettings />} />
        </Route>
      </Route>

      {/* 🔐 5. FOUNDER DASHBOARD */}
      <Route element={<ProtectedRoute allowedRoles={["founder"]} />}>
        <Route element={<FounderLayout />}>
          <Route path="/founder/dashboard" element={<FounderDashboard />} />
          <Route path="/founder/settings" element={<FounderSettings />} />
        </Route>
      </Route>
      
    </Routes> {/* ✅ Sirf ek baar band hoga yahan */}
  </BrowserRouter>
);
}



export default App;

 
