import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableUseCases } from "../../../../app/features/MomentSlice";
import "./UseCaseSwitcher.css";

function UseCaseSwitcher({ activeUseCase, onChange }) {
  const dispatch = useDispatch();
  
  const { availableUseCases, useCasesStatus } = useSelector(
    (state) => state.moment
  );

  useEffect(() => {
    if (useCasesStatus === "idle") {
      dispatch(fetchAvailableUseCases());
    }
  }, [dispatch, useCasesStatus]);

  if (useCasesStatus === "loading") {
    return (
      <div className="usecase-switcher">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="pill skeleton shimmer"></div>
        ))}
      </div>
    );
  }

  if (useCasesStatus === "failed" || availableUseCases.length === 0) {
    const fallbackUseCases = [
      { key: "blog-writing", label: "Blog Writing" },
      { key: "coding-help", label: "Coding Help" },
      { key: "digital-art", label: "Digital Art" },
      { key: "video-editing", label: "Video Editing" },
    ];
    
    return (
      <div className="usecase-switcher">
        {fallbackUseCases.map((item) => (
          <button
            key={item.key}
            className={`pill ${activeUseCase === item.key ? "active" : ""}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="usecase-switcher">
      {availableUseCases.map((item) => (
        <button
          key={item.key}
          className={`pill ${activeUseCase === item.key ? "active" : ""}`}
          onClick={() => onChange(item.key)}
          title={`${item.toolCount} tools available`}
        >
          {item.label} {/* ✅ Label wapas aa gaya, number nahi aayega */}
        </button>
      ))}
    </div>
  );
}

export default UseCaseSwitcher; 
