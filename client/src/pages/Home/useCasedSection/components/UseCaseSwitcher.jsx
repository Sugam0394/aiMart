import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableUseCases } from "../../../../app/features/MomentSlice";
import "./UseCaseSwitcher.css";

const fallbackUseCases = [
  { key: "blog-writing", label: "Blog Writing" },
  { key: "coding-help", label: "Coding Help" },
  { key: "digital-art", label: "Digital Art" },
  { key: "video-editing", label: "Video Editing" },
];

function UseCaseSwitcher({ activeUseCase, onChange }) {
  const dispatch = useDispatch();
  const { availableUseCases, useCasesStatus } = useSelector((state) => state.moment);

  useEffect(() => {
    if (useCasesStatus === "idle") {
      dispatch(fetchAvailableUseCases());
    }
  }, [dispatch, useCasesStatus]);

  // Loading State
  if (useCasesStatus === "loading") {
    return (
      <div className="usecase-switcher">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="pill skeleton shimmer"></div>
        ))}
      </div>
    );
  }

  // Error or Empty State
  const data = (useCasesStatus === "failed" || !availableUseCases?.length) 
    ? fallbackUseCases 
    : availableUseCases;

  return (
    <div className="usecase-container">
      <div className="usecase-switcher">
        {data.map((item) => (
          <button
            key={item.key}
            className={`pill ${activeUseCase === item.key ? "active" : ""}`}
            onClick={() => onChange(item.key)}
            title={item.toolCount ? `${item.toolCount} tools available` : ""}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UseCaseSwitcher; 
