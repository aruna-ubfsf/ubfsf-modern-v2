import React from "react";

interface SmartPlaceholderProps {
  title?: string;
  description?: string;
  className?: string;
}

export const SmartPlaceholder: React.FC<SmartPlaceholderProps> = ({
  title = "Content Coming Soon",
  description = "This section is pending real assets and will be replaced with verified content.",
  className = "",
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-8 text-center ${className}`} role="img" aria-label={`${title} placeholder`}>
      <div className="text-5xl mb-4">📷</div>
      <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm">{description}</p>
    </div>
  );
};
