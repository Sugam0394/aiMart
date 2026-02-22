 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from 'react';
 

// Styles
import "./App.css"
import './styles/mobile-optimization.css';

// 🟢 EAGER IMPORTS (Inhe lazy nahi karna taaki initial experience smooth ho)
import AppInitializer from './components/DataInit/AppInitializer.jsx'
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout.jsx"; // 🛠️ Eager import for Google SDK stability
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// 🟡 LAZY IMPORTS (Bhaari pages jo user ke click par load honge)
const UserLayout = lazy(() => import("./layouts/UserLayout.jsx"));
const ToolOwnerLayout = lazy(() => import("./layouts/ToolOwnerLayout.jsx"));
const FounderLayout = lazy(() => import("./layouts/FounderLayout.jsx"));

const Explore = lazy(() => import("./pages/Explore/Explore.jsx"));
const AiArt = lazy(() => import("./pages/aiArt/AiArt.jsx"));
const SavedTools = lazy(() => import("./components/SavedTools/SavedTools.jsx"));

const FounderDashboard = lazy(() => import("./pages/founder/Dashboard/FounderDashboard.jsx"));
const ToolOwnerDashboard = lazy(() => import("./pages/toolOwner/dashboard/ToolOwnerDashboard.jsx"));
const CreateTool = lazy(() => import("./pages/toolOwner/dashboard/CreateTool.jsx"));
const EditTool = lazy(() => import("./pages/toolOwner/dashboard/EditTool.jsx"));
const MyTool = lazy(() => import("./pages/toolOwner/dashboard/MyTool.jsx"));

const ToolOwnerSettings = lazy(() => import("./pages/toolOwner/settings/ToolOwnerSettings.jsx"));
const FounderSettings = lazy(() => import("./pages/founder/settings/FounderSettings.jsx"));
const UserSettings = lazy(() => import("./pages/user/settings/UserSettings.jsx"));

// Shared Loader (Minimal and clean)
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4 mx-auto"></div>
      <p className="text-white opacity-70 font-medium">Loading AI Mart...</p>
    </div>
  </div>
);

function App() {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  // Theme Logic (Keeps UI consistent)
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
      {/* 🛠️ background mein session check karega bina app ko block kiye */}
      <AppInitializer />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 🌍 1. PUBLIC ROUTES (Instant access for Guests) */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="tools/:id" element={<AiArt />} />
          </Route>

          {/* 🔐 2. AUTH ROUTES (Google SDK wraps these via AuthLayout) */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* 🔐 3. COMMON PROTECTED ROUTES (Wait happens inside ProtectedRoute) */}
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

          {/* 🔐 4. TOOL OWNER DASHBOARD */}
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

          {/* 🔐 5. FOUNDER DASHBOARD */}
          <Route element={<ProtectedRoute allowedRoles={["founder"]} />}>
            <Route element={<FounderLayout />}>
              <Route path="founder/dashboard" element={<FounderDashboard />} />
              <Route
                path="founder/settings"
                element={<FounderSettings isDark={isDark} setIsDark={setIsDark} />}
              />
            </Route>
          </Route>

          {/* 🛡️ Redirect if path not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

 
