import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Option {
  id: string;
  text: {
    zh: string;
    en: string;
    ko: string;
    ja: string;
  };
  effect?: string;
}

interface QuantumSelectorProps {
  options: Option[];
  onSelect: (optionId: string) => void;
}

export const QuantumSelector: React.FC<QuantumSelectorProps> = ({ options, onSelect }) => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="quantum-selector space-y-4"
    >
      {options.map((option) => (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(option.id)}
          className="w-full p-4 text-left rounded-lg border border-[#00ff9d] 
                     bg-transparent text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black
                     transition-colors duration-300"
        >
          <div className="text-lg font-medium">
            {option.text[i18n.language as keyof Option['text']]}
          </div>
          {option.effect && (
            <div className="text-sm mt-2 opacity-75">
              {option.effect}
            </div>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}; 