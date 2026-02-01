 import React from "react";
import "./SectionWrapper.css";

const SectionWrapper = ({
  children,
  variant = "default",
  title,
  subtitle,
}) => {
  return (
    <section className={`section-wrapper section-${variant}`}>
      <div className="section-container">
        {title && <h2 className="section-title">{title}</h2>}
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
