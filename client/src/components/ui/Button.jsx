import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white focus:ring-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]",
    secondary:
      "bg-white dark:bg-[#111A2B] text-[#0F1B2D] dark:text-[#F1F5F9] border border-[#E3E8EE] dark:border-[#1F2A3D] hover:bg-[#F5F8FA] dark:hover:bg-[#162035] focus:ring-[#1D4ED8]",
    outline:
      "bg-transparent text-[#1D4ED8] dark:text-[#3B82F6] border border-[#1D4ED8] dark:border-[#3B82F6] hover:bg-blue-50 dark:hover:bg-blue-950/30 focus:ring-[#1D4ED8]",
    accent:
      "bg-[#0F766E] hover:bg-[#115E59] text-white focus:ring-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#0D9488]",
    danger:
      "bg-[#B91C1C] hover:bg-[#991B1B] text-white focus:ring-[#B91C1C] dark:bg-[#DC2626] dark:hover:bg-[#B91C1C]",
    ghost:
      "bg-transparent text-[#5B6B7F] hover:text-[#0F1B2D] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

