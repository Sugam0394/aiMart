 import { useEffect,  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableUseCases } from "../../../../app/features/MomentSlice";
import "./UseCaseSwitcher.css";

const fallbackUseCases = [
  { key: "blog-writing", label: "Blog Writing", toolCount: 0 },
  { key: "coding-help", label: "Coding Help", toolCount: 0 },
  { key: "digital-art", label: "Digital Art", toolCount: 0 },
  { key: "video-editing", label: "Video Editing", toolCount: 0 },
];

function UseCaseSwitcher({ activeUseCase, onChange }) {
  const dispatch = useDispatch();
 
  
  const { availableUseCases, useCasesStatus, homeStatus } = useSelector((state) => state.moment);

  useEffect(() => {
    if (useCasesStatus === "idle" && homeStatus !== "loading") {
      dispatch(fetchAvailableUseCases());
    }
  }, [dispatch, useCasesStatus, homeStatus]);

  // Loading State
  if (useCasesStatus === "loading" || (homeStatus === "loading" && availableUseCases.length === 0)) {
    return (
      <div className="usecase-container">
        <div className="usecase-switcher">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="pill skeleton shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  const data = (useCasesStatus === "failed" || !availableUseCases?.length) 
    ? fallbackUseCases 
    : availableUseCases;

  return (
    <div className="usecase-container">
    <h3 className="filters-title">Browse by Use Case</h3>
    
    <div className="usecase-switcher">
      {data.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`pill ${activeUseCase === item.key ? "active" : ""}`}
          onClick={() => onChange(item.key)}
          // Title hover par count dikhayega, pill ke upar nahi
          title={item.toolCount ? `${item.toolCount} tools available` : "Explore tools"}
        >
          {/* Ab sirf saaf-suthra naam dikhega */}
          <span className="pill-text">{item.label}</span>
        </button>
      ))}
    </div>
  </div>
  );
}

export default UseCaseSwitcher;
