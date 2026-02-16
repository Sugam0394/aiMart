import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchToolsByUseCase } from "../../../app/features/MomentSlice";
import ToolCard from "../../aiArt/components/ToolCard";
import './UseCasedSection.css';
import ToolCardSkeleton from "../../aiArt/components/ToolCardSkeleton";



function UseCaseSection({ useCaseKey }) {
  const dispatch = useDispatch();
  
  // Redux state se section data nikaalo
  const section = useSelector(
    (state) => state.moment.useCaseSections?.[useCaseKey]
  );

  const tools = section?.tools || [];
  const status = section?.status;

 
 useEffect(() => {
  
    if (!useCaseKey) return;

  
    const shouldFetch = !section || section.status === "idle";

    if (shouldFetch) {
      dispatch(fetchToolsByUseCase(useCaseKey));
    }
    
    
  }, [useCaseKey, section, dispatch]);

 
  if (status === "loading") {
    return (
      <div className="usecase-row-container skeleton-active">
        {[1, 2, 3, 4].map((n) => (
           <ToolCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (status === "failed") {
    return <p className="error-text">Unable to load tools for this section.</p>;
  }

  // 3. Empty State (Pura section gayab kar do agar tools zero hain)
  if (status === "succeeded" && tools.length === 0) {
    return null;
  }

  return (
    <div className="usecase-section-wrapper">
      {/* Agar hum chahein toh yahan meta.title bhi dikha sakte hain, 
          lekin humne SectionWrapper Home.jsx mein rakha hai, toh yahan sirf cards dikhayenge */}
      <div className="usecase-row-container">
        {tools.map((tool) => (
          <ToolCard key={tool._id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default UseCaseSection; 
