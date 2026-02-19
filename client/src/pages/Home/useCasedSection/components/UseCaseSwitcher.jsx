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
  // Hum homeStatus bhi check karenge taaki agar Home.jsx ne data fetch kar liya ho toh dobara call na ho
  const { availableUseCases, useCasesStatus, homeStatus } = useSelector((state) => state.moment);

  useEffect(() => {
    // Optimization: Agar homeData load ho gaya hai ya useCases loading mein hain toh skip karo
    if (useCasesStatus === "idle" && homeStatus !== "loading" && homeStatus !== "succeeded") {
      dispatch(fetchAvailableUseCases());
    }
  }, [dispatch, useCasesStatus, homeStatus]);

  // Loading State
  if (useCasesStatus === "loading" || (homeStatus === "loading" && availableUseCases.length === 0)) {
    return (
      <div className="usecase-switcher">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="pill skeleton shimmer"></div>
        ))}
      </div>
    );
  }

  const data = (useCasesStatus === "failed" || !availableUseCases?.length) 
    ? fallbackUseCases 
    : availableUseCases;

  return (
    <div className="usecase-container">
      <div className="usecase-switcher">
        {data.map((item) => (
          <button
            key={item.key}
            type="button"
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
