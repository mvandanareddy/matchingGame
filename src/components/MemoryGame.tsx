import { useState, useEffect } from "react";
import Card from "./Card";

const categories = {
  animal: ["🐶", "🐱", "🐭", "🦊", "🐻", "🐸", "🐯", "🐷", "🐵", "🦁", "🐰", "🐨", "🐢", "🐙", "🦉", "🐺", "🐵", "🐘", "🐖", "🐏", "🐑", "🐄", "🦧", "🐂", "🦞", "🐅", "🐆", "🦓", "🦘", "🦋", "🪿", "🦄", "🐤", "🐀", "🐿️", "🦢", "🦚", "🐪", "🐓", "🦃", "🦒", "🐊"],
  flower: ["🌵", "🎄", "🌲", "🌳", "🌴", "🪵", "🌱", "🌿", "☘️", "🍀", "🎍", "🪴", "🎋", "🍃", "🍂", "🌹", "🌷", "💐", "🌾", "🪨", "🪸", "🍄", "🍁", "🥀", "🪻", "🪷", "🌺", "🌸", "🌼", "🌻"],
  food: ["🌭", "🍔", "🍟", "🍕", "🫓", "🥙", "🧆", "🌮", "🍣", "🍛", "🍲", "🍝", "🫕", "🥘", "🥗", "🫔", "🌯", "🍱", "🥟", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍫", "🍿", "🍬", "🍭", "🍮", "🎂", "🍰", "🍩", "🍧", "🍨", "🍒", "🍑", "🥥", "🥝", "🍆", "🥑", "🍠", "🫚", "🥐", "🥞", "🧇", "🍳", "🥕", "🌽", "🥣"],
  space: ["🚀", "🌍", "🌕", "☄️", "🌟", "🔭", "🛸", "🪐", "👽", "⚡", "🔥", "🎇", "🎆", "🛰", "⚙️", "💡"],
  countries: ["🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇮", "🇧🇫", "🇮🇴", "🇧🇷", "🇰🇾", "🇯🇵", "🇯🇪", "🇰🇿", "🇮🇳", "🇮🇷", "🇮🇶", "🇮🇪", "🇾🇹", "🇳🇹", "🇵🇲", "🇽🇲", "🇲🇸", "🇲🇪", "🇮🇹", "🇱🇦", "🇲🇾", "🇲🇨", "🇵🇼", "🇵🇰", "🇴🇲", "🇳🇴", "🇲🇳", "🇲🇰", "🇰🇵", "🇳🇫", "🇳🇺", "🇳🇬", "🇳🇪", "🇵🇦", "🇵🇬", "🇵🇪", "🇸🇲", "🇰🇳", "🇱🇰", "🇬🇧"],
};

type Difficulty = {
  name: string;
  size: number; 
  pairs: number; 
};

const getAvailableDifficulties = (category: string): Difficulty[] => {
  const totalEmojis = category === "mixed"
    ? Object.values(categories).flat().length
    : categories[category as keyof typeof categories].length;
  
  // We need pairs, so divide by 2
  const maxPairs = Math.floor(totalEmojis / 2);
  const difficulties: Difficulty[] = [];

  if (maxPairs >= 2) difficulties.push({ name: "2×2", size: 2, pairs: 2 });
  if (maxPairs >= 8) difficulties.push({ name: "4×4", size: 4, pairs: 8 });
  if (maxPairs >= 18) difficulties.push({ name: "6×6", size: 6, pairs: 18 });
  if (maxPairs >= 32) difficulties.push({ name: "8×8", size: 8, pairs: 32 });

  return difficulties;
};

const getMaxMistakes = (size: number): number => {
  switch (size) {
    case 4: return 10;
    case 6: return 15;
    case 8: return 20;
    default: return 1;  // for 2x2
  }
};

const MemoryGame = () => {
  const [category, setCategory] = useState("animal");
  const [difficulty, setDifficulty] = useState<Difficulty>({ name: "2×2", size: 2, pairs: 2 });
  const [cards, setCards] = useState<string[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Set initial difficulty when category changes
  useEffect(() => {
    const availableDifficulties = getAvailableDifficulties(category);
    if (availableDifficulties.length > 0) {
      setDifficulty(availableDifficulties[0]);
    }
  }, [category]);

  // Reset mistakes when changing difficulty or category
  useEffect(() => {
    setMistakes(0);
    setGameOver(false);
  }, [category, difficulty]);

  const shuffleCards = () => {
    let selectedCards = category === "mixed"
      ? Object.values(categories).flat().sort(() => 0.5 - Math.random())
      : [...categories[category as keyof typeof categories]];
    
    const requiredPairs = difficulty.pairs;
    const availablePairs = Math.min(Math.floor(selectedCards.length / 2), requiredPairs);
    selectedCards = selectedCards.slice(0, availablePairs);
    
    // Create pairs and shuffle
    const shuffledCards = [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMatchedCards([]);
    setMistakes(0);
    setGameOver(false);
  };

  // Initial setup when category or difficulty changes
  useEffect(() => {
    shuffleCards();
  }, [category, difficulty]);

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length >= 2 || 
        flippedIndexes.includes(index) || 
        matchedCards.includes(cards[index])) {
      return;
    }
    setFlippedIndexes([...flippedIndexes, index]);
  };

  // Check for non-matching pairs and update mistakes
  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const [first, second] = flippedIndexes;
      if (cards[first] === cards[second]) {
        setMatchedCards([...matchedCards, cards[first]]);
      } else {
        // Increment mistakes for non-matching pairs
        setMistakes(prev => prev + 1);
      }
      setTimeout(() => setFlippedIndexes([]), 1000);
    }
  }, [flippedIndexes, cards]);

  // Check for game over
  useEffect(() => {
    const maxMistakes = getMaxMistakes(difficulty.size);
    if (mistakes >= maxMistakes) {
      setGameOver(true);
    }
  }, [mistakes, difficulty.size]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-green-100 p-4 w-full w-screen">
      <div className="text-center mb-8 p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Memory Game</h1>
        <p className="text-gray-600">Match pairs of cards to win!</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-4 text-red-500">Select a Category</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {[...Object.keys(categories), "mixed"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-200
                ${category === cat 
                  ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Grid Size</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {getAvailableDifficulties(category).map((diff) => (
            <button
              key={diff.name}
              onClick={() => setDifficulty(diff)}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-200
                ${difficulty?.name === diff.name 
                  ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {diff.name}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-600">
            Mistakes: <span className={`font-bold ${mistakes > getMaxMistakes(difficulty.size) / 2 ? 'text-red-500' : 'text-gray-800'}`}>
              {mistakes}/{getMaxMistakes(difficulty.size)}
            </span>
          </p>
        </div>
      </div>

      <div className="p-4">
        <div 
          className="grid gap-3 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${difficulty.size}, minmax(60px, 1fr))`,
            width: 'fit-content'
          }}
        >
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

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Game Over! 😢</h2>
            <p className="text-gray-600 mb-4">You've made too many mistakes.</p>
            <button
              onClick={shuffleCards}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {!gameOver && matchedCards.length === difficulty.pairs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Congratulations! 🎉</h2>
            <p className="text-gray-600 mb-4">You've matched all the pairs with {mistakes} mistakes!</p>
            <button
              onClick={shuffleCards}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;