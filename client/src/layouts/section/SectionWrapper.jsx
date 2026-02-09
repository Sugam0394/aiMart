 import React, { useRef } from "react";
import "./SectionWrapper.css";

const SectionWrapper = ({
  children,
  variant = "default",
  title,
  subtitle,
}) => {
  const scrollRef = useRef(null);

  return (
    <section className={`section-wrapper section-${variant}`}>
      <div className="section-container">
        <div className="section-header">
          <div className="header-text">
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {/* Future mein yahan Arrow Buttons add kar sakte ho */}
        </div>
        
        <div className="section-content-viewport" ref={scrollRef}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
