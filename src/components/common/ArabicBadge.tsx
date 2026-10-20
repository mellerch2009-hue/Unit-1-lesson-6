import React from 'react';

interface ArabicBadgeProps {
  text: string;
  className?: string;
  showIcon?: boolean;
}

export const ArabicBadge: React.FC<ArabicBadgeProps> = ({
  text,
  className = '',
  showIcon = false,
}) => {
  if (!text) return null;

  return (
    <div
      dir="rtl"
      className={`font-arabic text-xs md:text-sm text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1 rounded-xl inline-flex items-center gap-1.5 leading-relaxed ${className}`}
    >
      {showIcon && <span className="text-emerald-600 font-bold">💡</span>}
      <span>{text}</span>
    </div>
  );
};
