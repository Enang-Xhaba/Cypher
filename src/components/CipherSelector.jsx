import React from 'react';
import { motion } from 'framer-motion';
import { ciphers } from '../utils/ciphers';
import { clsx } from 'clsx';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck } = FiIcons;

const CipherSelector = ({ selectedCipher, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {Object.entries(ciphers).map(([key, cipher]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(key)}
          className={clsx(
            "p-4 rounded-xl text-left transition-all duration-300 border-2 relative overflow-hidden",
            selectedCipher === key
              ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200"
              : "bg-white border-rose-100 text-rose-900 hover:border-rose-300 hover:shadow-md"
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg mb-1">{cipher.name}</h3>
              <p className={clsx(
                "text-sm",
                selectedCipher === key ? "text-rose-100" : "text-rose-500"
              )}>
                {cipher.description}
              </p>
            </div>
            {selectedCipher === key && (
              <SafeIcon icon={FiCheck} className="text-2xl flex-shrink-0 ml-2" />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default CipherSelector;