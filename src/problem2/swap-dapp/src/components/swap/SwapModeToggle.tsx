import React from "react";

const SwapModeToggle = () => {
  return (
    <div className="flex border-b border-gray-700 mb-6">
      <button className="flex-1 py-2 text-white font-medium border-b-2 border-blue-500">
        Swap
      </button>
      <button className="flex-1 py-2 text-gray-400">Limit</button>
    </div>
  );
};

export default SwapModeToggle;
