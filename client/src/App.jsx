 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
 

// Styles
import "./App.css"
import './styles/mobile-optimization.css';
import './styles/animations.css';


 

 // Components
import AppInitializer from './components/DataInit/AppInitializer.jsx'
import SkeletonLoader from "./components/SkeletonLoader/SkeletonLoader.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";

// Pages (Eagerly loaded for instant access on critical routes)
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout.jsx"; 
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

 // Layout  Static
const UserLayout = lazy(() => import("./layouts/UserLayout.jsx"));
const ToolOwnerLayout = lazy(() => import("./layouts/ToolOwnerLayout.jsx"));
const FounderLayout = lazy(() => import("./layouts/FounderLayout.jsx"));
const PublicStackPage = lazy(() => import("./components/PublicStackPage/PublicStackPage.jsx"));

// Pages (Dynamically imported for better performance)
const Explore = lazy(() => import("./pages/Explore/Explore.jsx"));
const AiArt = lazy(() => import("./pages/aiArt/AiArt.jsx"));
const SavedTools = lazy(() => import("./pages/SavedTools/SavedTools.jsx"));


// Dashboards & Settings (Less frequently accessed, so lazy load them)
const FounderDashboard = lazy(() => import("./pages/founder/Dashboard/FounderDashboard.jsx"));
const ToolOwnerDashboard = lazy(() => import("./pages/toolOwner/dashboard/ToolOwnerDashboard.jsx"));
const CreateTool = lazy(() => import("./pages/toolOwner/dashboard/CreateTool.jsx"));
const EditTool = lazy(() => import("./pages/toolOwner/dashboard/EditTool.jsx"));
const MyTool = lazy(() => import("./pages/toolOwner/dashboard/MyTool.jsx"));


// Settings pages (even less frequently accessed, so lazy load them)
const ToolOwnerSettings = lazy(() => import("./pages/toolOwner/settings/ToolOwnerSettings.jsx"));
const FounderSettings = lazy(() => import("./pages/founder/settings/FounderSettings.jsx"));
const UserSettings = lazy(() => import("./pages/user/settings/UserSettings.jsx"));

 
 


 // ✅ SplashScreen Component using your CSS classes

const SplashScreen = () => {
  const cachedUser = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <div className="splash-container">
      {cachedUser?.name && (
        <p className="splash-greeting">
          Welcome back, {cachedUser.name.split(" ")[0]} 👋
        </p>
      )}
      <h1 className="splash-logo">aiMart</h1>
      <div className="splash-spinner"></div>
    </div>
  );
};

function App() {

  const isInitialized = useSelector((state) => state.auth.isInitialized);
  return (
    <ErrorBoundary>
    <BrowserRouter>
      {/* 🛠️ background mein session check karega bina app ko block kiye */}
      <AppInitializer />
    {/* ✅ Logic: If not initialized, show Splash. Once done, show Routes. */}
        {!isInitialized ? (
          <SplashScreen />
        ) : (
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          {/* 🌍 1. PUBLIC ROUTES (Instant access for Guests) */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="tools/:id" element={<AiArt />} />
            <Route path="stack/:role" element={<PublicStackPage />} />
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
            
              <Route
                path="settings"
                element={<UserSettings   />}
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
                element={<ToolOwnerSettings  />}
              />
            </Route>
          </Route>

          {/* 🔐 5. FOUNDER DASHBOARD */}
          <Route element={<ProtectedRoute allowedRoles={["founder"]} />}>
            <Route element={<FounderLayout />}>
              <Route path="founder/dashboard" element={<FounderDashboard />} />
              <Route
                path="founder/settings"
                element={<FounderSettings  />}
              />
            </Route>
          </Route>

          {/* 🛡️ Redirect if path not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
        )}
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

 
