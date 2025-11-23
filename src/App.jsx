import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CipherSelector from './components/CipherSelector';
import Controls from './components/Controls';
import { ciphers } from './utils/ciphers';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiTrash2, FiCode } = FiIcons;

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedCipher, setSelectedCipher] = useState('caesar');
  const [mode, setMode] = useState('encrypt');
  const [key, setKey] = useState(3);
  const [copied, setCopied] = useState(false);

  const activeCipher = ciphers[selectedCipher];

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      const result = mode === 'encrypt' 
        ? activeCipher.encrypt(input, key)
        : activeCipher.decrypt(input, key);
      setOutput(result);
    } catch (error) {
      setOutput('Error processing text');
    }
  }, [input, selectedCipher, mode, key]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-rose-200 selection:text-rose-900">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-300">
              <SafeIcon icon={FiCode} className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-rose-950 tracking-tight">
              Cypher
            </h1>
          </div>
          <p className="text-rose-600 text-lg max-w-2xl mx-auto">
            Securely encode and decode messages with elegant simplicity.
          </p>
        </motion.div>

        <CipherSelector 
          selectedCipher={selectedCipher} 
          onSelect={setSelectedCipher} 
        />

        <Controls 
          mode={mode} 
          setMode={setMode} 
          cipherConfig={activeCipher}
          currentKey={key}
          setKey={setKey}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div 
            layout
            className="bg-white rounded-2xl shadow-xl shadow-rose-100 overflow-hidden border border-rose-100"
          >
            <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100 flex justify-between items-center">
              <h2 className="font-semibold text-rose-900">Input</h2>
              <button 
                onClick={() => setInput('')}
                className="text-rose-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-100 transition-colors"
                title="Clear"
              >
                <SafeIcon icon={FiTrash2} />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter text to ${mode}...`}
                className="w-full h-64 p-4 text-rose-900 placeholder-rose-300 bg-transparent border-none resize-none focus:ring-0 text-lg leading-relaxed font-mono"
                spellCheck="false"
              />
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div 
            layout
            className="bg-white rounded-2xl shadow-xl shadow-rose-100 overflow-hidden border border-rose-100 relative"
          >
            <div className="px-6 py-4 bg-rose-600 text-white flex justify-between items-center">
              <h2 className="font-semibold">Output</h2>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 text-sm"
              >
                <SafeIcon icon={FiCopy} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-rose-900/5 h-full min-h-[16rem]">
              <div className="w-full h-64 p-4 text-rose-900 font-mono text-lg leading-relaxed break-words overflow-y-auto">
                {output || <span className="text-rose-300 italic">Result will appear here...</span>}
              </div>
            </div>
          </motion.div>
        </div>
        
        <footer className="mt-12 text-center text-rose-400 text-sm">
          <p>© {new Date().getFullYear()} Cypher. All calculations performed locally.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;