import React from "react";

export const Input = ({
  label,
  id,
  type = "text",
  error,
  helperText,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B6B7F] dark:text-[#94A3B8]">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`w-full h-11 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors duration-150 placeholder:text-[#5B6B7F]/60 dark:placeholder:text-[#94A3B8]/60 ${
            leftIcon ? "pl-10" : "px-3.5"
          } ${rightIcon ? "pr-10" : "px-3.5"} ${
            error ? "border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/20" : ""
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5B6B7F] dark:text-[#94A3B8]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-[#B91C1C] dark:text-red-400 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">{helperText}</p>
      )}
    </div>
  );
};

export default Input;

