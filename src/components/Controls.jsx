import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRefreshCw, FiArrowRight, FiArrowLeft, FiSettings } = FiIcons;

const Controls = ({ mode, setMode, cipherConfig, setKey, currentKey }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
      <div className="flex items-center gap-2 bg-rose-50 p-1 rounded-lg">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'encrypt'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-600 hover:bg-rose-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiArrowRight} /> Encrypt
          </div>
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'decrypt'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-600 hover:bg-rose-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiArrowLeft} /> Decrypt
          </div>
        </button>
      </div>

      {cipherConfig.hasKey && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-rose-600">
            <SafeIcon icon={FiSettings} />
            <span className="text-sm font-medium">Shift Key:</span>
          </div>
          <input
            type="number"
            value={currentKey}
            onChange={(e) => setKey(e.target.value)}
            className="w-20 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-900 font-mono text-center"
            min="1"
            max="25"
          />
        </div>
      )}
    </div>
  );
};

export default Controls;