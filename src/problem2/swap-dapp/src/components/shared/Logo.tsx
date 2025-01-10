"use client";
import { useTheme } from "next-themes";

const Logo = () => {
  const { theme } = useTheme();

  const fillColor = theme === "dark" ? "#fff" : "#000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1155 1000"
      className="w-6 h-6"
    >
      <path d="m577.3 0 577.4 1000H0z" fill={fillColor} />
    </svg>
  );
};

export default Logo;
