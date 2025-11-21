/* Updated app.js: uses ciphers.js functions, improved validation and UI messaging,
   supports new cipher options and extra languages.
*/
(function () {
  const C = (typeof window !== 'undefined' && window.Ciphers) ? window.Ciphers : (typeof require === 'function' ? require('./ciphers') : null);
  if (!C) throw new Error('Ciphers module not found');

  const elements = {
    langSelect: document.getElementById('langSelect'),
    cipherSelect: document.getElementById('cipherSelect'),
    keyInput: document.getElementById('keyInput'),
    textInput: document.getElementById('textInput'),
    decodeBtn: document.getElementById('decodeBtn'),
    result: document.getElementById('result'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    fileInput: document.getElementById('fileInput'),
    hintText: document.getElementById('hintText'),
    keyHint: document.getElementById('keyHint'),
  };

  // i18n loader
  let strings = {};
  async function loadLang(lang) {
    try {
      const res = await fetch(`i18n/${lang}.json`);
      strings = await res.json();
    } catch (e) {
      console.error('i18n load error', e);
      strings = {};
    }
    applyStrings();
    localStorage.setItem('cypher_lang', lang);
  }
  function applyStrings() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) el.textContent = strings[key];
    });
    elements.textInput.placeholder = strings['text_placeholder'] || '';
    elements.keyInput.placeholder = strings['key_placeholder'] || '';
    elements.keyHint.textContent = strings['key_hint'] || elements.keyHint.textContent;
  }

  function showResult(text) {
    elements.result.textContent = text;
    elements.result.classList.remove('pulse');
    void elements.result.offsetWidth;
    elements.result.classList.add('pulse');
  }

  function flash(msg, duration = 2200) {
    const node = document.createElement('div');
    node.textContent = msg;
    node.style.position = 'fixed';
    node.style.right = '18px';
    node.style.bottom = '18px';
    node.style.padding = '10px 14px';
    node.style.background = 'rgba(43,11,18,0.9)';
    node.style.color = 'white';
    node.style.borderRadius = '10px';
    node.style.zIndex = 9999;
    node.style.boxShadow = '0 12px 36px rgba(0,0,0,0.25)';
    document.body.appendChild(node);
    setTimeout(() => node.style.opacity = '0', duration);
    setTimeout(() => node.remove(), duration + 300);
  }

  elements.decodeBtn.addEventListener('click', () => {
    const cipher = elements.cipherSelect.value;
    const input = elements.textInput.value || '';
    const keyRaw = (elements.keyInput.value || '').trim();

    if (!input) {
      flash(strings['empty_input'] || 'Please provide input text');
      return;
    }

    try {
      let out = '';
      if (cipher === 'auto') {
        const guess = C.guessCipher(input);
        // run guessed decoder with safe defaults
        if (guess === 'base64') out = C.base64Decode(input);
        else if (guess === 'rot13') out = C.rot13(input);
        else if (guess === 'vigenere') out = C.vigenereDecode(input, keyRaw || '');
        else out = C.caesarDecode(input, keyRaw || 3);
      } else if (cipher === 'caesar') {
        out = C.caesarDecode(input, keyRaw === '' ? 3 : keyRaw);
      } else if (cipher === 'rot13') {
        out = C.rot13(input);
      } else if (cipher === 'vigenere') {
        out = C.vigenereDecode(input, keyRaw);
      } else if (cipher === 'atbash') {
        out = C.atbashDecode(input);
      } else if (cipher === 'affine') {
        // key form expected: "a,b" or "a b"
        const parts = keyRaw.split(/[, ]+/).filter(Boolean);
        if (parts.length < 2) throw new Error(strings['affine_key_format'] || 'Affine requires keys a and b (e.g., "5,8")');
        out = C.affineDecode(input, parts[0], parts[1]);
      } else if (cipher === 'railfence') {
        if (!keyRaw) throw new Error(strings['rail_key_required'] || 'Rail Fence requires number of rails as key');
        out = C.railFenceDecode(input.replace(/\r\n/g,''), keyRaw);
      } else if (cipher === 'base64') {
        out = C.base64Decode(input);
      } else {
        out = strings['not_implemented'] || 'Not implemented: custom cipher';
      }
      showResult(out);
    } catch (e) {
      showResult((strings['error_text'] || 'Error decoding') + ': ' + e.message);
    }
  });

  // Copy
  elements.copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(elements.result.textContent || '');
      flash(strings['copied'] || 'Copied to clipboard');
    } catch {
      flash(strings['copy_failed'] || 'Copy failed');
    }
  });

  // Download
  elements.downloadBtn.addEventListener('click', () => {
    const blob = new Blob([elements.result.textContent || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'decoded.txt'; document.body.appendChild(a);
    a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  // File input
  elements.fileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      elements.textInput.value = text;
      flash(strings['file_loaded'] || 'File loaded');
    } catch (e) {
      flash(strings['file_error'] || 'Could not read file');
    }
  });

  // Lang switch
  elements.langSelect.addEventListener('change', (e) => {
    loadLang(e.target.value);
  });

  (function init() {
    const savedLang = localStorage.getItem('cypher_lang') || 'en';
    elements.langSelect.value = savedLang;
    loadLang(savedLang);

    const style = document.createElement('style');
    style.innerHTML = `.pulse{animation: pulse .6s ease;} @keyframes pulse{0%{transform:scale(0.99)}50%{transform:scale(1.02)}100%{transform:scale(1)}}`;
    document.head.appendChild(style);
  })();
})();//sdsdsdsds
