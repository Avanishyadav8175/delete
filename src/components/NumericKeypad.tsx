import React from 'react';
import { Delete, Check } from 'lucide-react';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress }) => {
  const keys = [
    '1', '2', '3', '-',
    '4', '5', '6', '←',
    '7', '8', '9', '⌫',
    ',', '0', '.', '✓'
  ];

  const handleKeyPress = (key: string) => {
    switch(key) {
      case '⌫':
        onKeyPress('backspace');
        break;
      case '✓':
        onKeyPress('enter');
        break;
      case '←':
        onKeyPress('back');
        break;
      case '-':
        onKeyPress('dash');
        break;
      default:
        onKeyPress(key);
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-xl mx-auto max-w-md">
      <div className="grid grid-cols-4 gap-2 p-2">
        {keys.map((key, index) => (
          <button
            key={index}
            onClick={() => handleKeyPress(key)}
            className={`
              text-white text-2xl font-medium h-14 rounded-full
              ${key === '⌫' ? 'bg-gray-700' : key === '✓' ? 'bg-[#006FCF]' : 'bg-gray-600'}
              hover:opacity-90 active:opacity-75 flex items-center justify-center
            `}
          >
            {key === '⌫' ? <Delete size={20} /> : key === '✓' ? <Check size={20} /> : key}
          </button>
        ))}
      </div>
      <div className="h-4 bg-gray-800"></div>
    </div>
  );
};

export default NumericKeypad;