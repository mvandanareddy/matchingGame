import { useState, useEffect } from "react";
import Card from "./Card";

const categories = {
  animal: ["🐶", "🐱", "🐭", "🦊", "🐻", "🐸", "🐯", "🐷",],
  flower: ["🌵", "🎄", "🌲", "🌳", "🌴", "🌿", "☘️", "🍀"],
  food: ["🌭", "🍔", "🍟", "🍕", "🍣", "🍛", "🥗", "🍤"],
  space: ["🚀", "🌍", "🌕", "☄️", "🌟", "🔭", "🛸", "🪐"],
  countries: ["🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲"],
};

const MemoryGame = () => {
  const [category, setCategory] = useState<string>("animal");
  const [difficulty, setDifficulty] = useState<number>(3);
  const [cards, setCards] = useState<string[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);

  useEffect(() => {
    let selectedCards = categories[category as keyof typeof categories] || categories.animal;
    selectedCards = selectedCards.slice(0, difficulty); // Limit based on difficulty
    const shuffledCards = [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMatchedCards([]);
  }, [category, difficulty]);

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length < 2 && !flippedIndexes.includes(index)) {
      setFlippedIndexes([...flippedIndexes, index]);
    }
  };

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const [first, second] = flippedIndexes;
      if (cards[first] === cards[second]) {
        setMatchedCards([...matchedCards, cards[first]]);
      }
      setTimeout(() => setFlippedIndexes([]), 1000);
    }
  }, [flippedIndexes]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2>Select a category:</h2>
        {Object.keys(categories).map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className="p-2 m-1 bg-blue-500 text-white rounded">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h2>Select difficulty:</h2>
        {[3, 4, 5, 6, 7, 8].map((level) => (
          <button key={level} onClick={() => setDifficulty(level)} className="p-2 m-1 bg-green-500 text-white rounded">
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((emoji, index) => (
          <Card
            key={index}
            emoji={emoji}
            isFlipped={flippedIndexes.includes(index) || matchedCards.includes(emoji)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
