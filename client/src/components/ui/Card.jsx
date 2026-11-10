import React from "react";

export const Card = ({
  children,
  className = "",
  hover = false,
  padding = "p-6",
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
        hover
          ? "hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] transition-all duration-150 cursor-pointer"
          : ""
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

