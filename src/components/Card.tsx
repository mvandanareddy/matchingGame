import React from "react";

type CardProps = {
  emoji: string;
  isFlipped: boolean;
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ emoji, isFlipped, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 flex items-center justify-center border bg-gray-300 text-2xl font-bold rounded-lg transition-transform transform duration-300"
    >
      {isFlipped ? <div className="text-4xl">{emoji}</div> : "❓"}
    </button>
  );
};

export default Card;
