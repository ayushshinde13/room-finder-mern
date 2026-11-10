import React from "react";

export const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded tracking-wide";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantStyles = {
    verified:
      "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40",
    success:
      "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40",
    neutral:
      "bg-[#F5F8FA] text-[#5B6B7F] border border-[#E3E8EE] dark:bg-[#111A2B] dark:text-[#94A3B8] dark:border-[#1F2A3D]",
    primary:
      "bg-blue-50 text-[#1D4ED8] border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40",
    warning:
      "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40",
    danger:
      "bg-red-50 text-[#B91C1C] border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/40",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.neutral
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

