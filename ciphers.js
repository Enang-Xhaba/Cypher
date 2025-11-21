/* ciphers.js
   UMD style so tests (node) can require it and browser can use window.Ciphers.
   Exposes:
     - caesarDecode(text, shift)
     - rot13(text)
     - vigenereDecode(text, key)
     - atbashDecode(text)
     - affineDecode(text, a, b)
     - railFenceDecode(text, rails)
     - base64Decode(text)
   Each function performs argument validation and preserves non-letter characters (when appropriate).
*/

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.Ciphers = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function assertString(x, name) {
    if (x == null) throw new Error((name || 'input') + ' is null/undefined');
    if (typeof x !== 'string') throw new Error((name || 'input') + ' must be a string');
  }

  function caesarDecode(text, shift = 3) {
    assertString(text, 'text');
    if (shift === '') shift = 0;
    if (isNaN(shift)) throw new Error('Caesar shift must be numeric');
    shift = ((Number(shift) % 26) + 26) % 26;
    return text.replace(/[A-Za-z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
    });
  }

  function rot13(text) {
    assertString(text, 'text');
    return text.replace(/[A-Za-z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
    });
  }

  function vigenereDecode(text, key = '') {
    assertString(text, 'text');
    if (!key || typeof key !== 'string') return text;
    const cleanKey = key.replace(/[^A-Za-z]/g, '').toLowerCase();
    if (!cleanKey) throw new Error('Vigenère key must contain letters A-Z');
    let ki = 0;
    return text.split('').map(ch => {
      if (/[A-Za-z]/.test(ch)) {
        const base = ch <= 'Z' ? 65 : 97;
        const k = cleanKey[ki % cleanKey.length].charCodeAt(0) - 97;
        const decoded = String.fromCharCode((ch.charCodeAt(0) - base - k + 26) % 26 + base);
        ki++;
        return decoded;
      }
      return ch;
    }).join('');
  }

  function atbashDecode(text) {
    assertString(text, 'text');
    return text.replace(/[A-Za-z]/g, c => {
      const isUpper = c <= 'Z';
      const base = isUpper ? 65 : 97;
      const alphaIndex = c.charCodeAt(0) - base;
      const mapped = 25 - alphaIndex;
      return String.fromCharCode(base + mapped);
    });
  }

  // Affine cipher: E(x) = (a*x + b) mod 26, decode uses modular inverse of a
  function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
    return null;
  }
  function affineDecode(text, a, b) {
    assertString(text, 'text');
    if (a == null || b == null) throw new Error('Affine requires numeric keys a and b (e.g., a=5, b=8)');
    if (isNaN(a) || isNaN(b)) throw new Error('Affine keys must be numeric');
    a = Number(a);
    b = Number(b);
    const inv = modInverse(a, 26);
    if (inv === null) throw new Error('Affine key "a" is not invertible mod 26 (choose a coprime with 26).');
    return text.replace(/[A-Za-z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      const x = c.charCodeAt(0) - base;
      const decoded = (inv * ((x - b + 26) % 26)) % 26;
      return String.fromCharCode(decoded + base);
    });
  }

  // Rail Fence decryption
  function railFenceDecode(cipher, rails) {
    assertString(cipher, 'cipher');
    if (rails == null) throw new Error('rails parameter required');
    if (isNaN(rails)) throw new Error('rails must be numeric');
    rails = Math.max(1, Math.floor(Number(rails)));
    if (rails === 1) return cipher;
    // build rail pattern indexes
    const n = cipher.length;
    const railLen = Array.from({length: rails}, () => []);
    let rail = 0, dir = 1;
    for (let i = 0; i < n; i++) {
      railLen[rail].push(i);
      rail += dir;
      if (rail === rails - 1) dir = -1;
      if (rail === 0) dir = 1;
    }
    // determine lengths
    const lens = railLen.map(arr => arr.length);
    // slice cipher into rows
    const rows = [];
    let pos = 0;
    for (let r = 0; r < rails; r++) {
      rows[r] = cipher.slice(pos, pos + lens[r]).split('');
      pos += lens[r];
    }
    // reconstruct plaintext by reading in zig-zag order
    let res = '', ri = Array.from({length: rails}, () => 0);
    rail = 0; dir = 1;
    for (let i = 0; i < n; i++) {
      res += rows[rail][ri[rail]++];
      rail += dir;
      if (rail === rails - 1) dir = -1;
      if (rail === 0) dir = 1;
    }
    return res;
  }

  function base64Decode(text) {
    assertString(text, 'text');
    try {
      if (typeof atob === 'function') {
        // browser
        return decodeURIComponent(Array.prototype.map.call(atob(text), function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      } else {
        // node
        return Buffer.from(text, 'base64').toString('utf8');
      }
    } catch (e) {
      throw new Error('Invalid Base64 input');
    }
  }

  function guessCipher(text) {
    // Simple heuristic for guess: if contains "==" or base64 chars and length%4===0 -> base64
    if (/[A-Za-z0-9+/]+=*$/.test(text.trim()) && text.trim().length % 4 === 0) return 'base64';
    // if many non-letter characters and short -> maybe rot13/caesar
    const letters = (text.match(/[A-Za-z]/g) || []).length;
    const all = text.length || 1;
    if (letters / all > 0.5) {
      // if common ROT13 pattern: "uryyb" -> detect rot13 if it decodes into many vowels
      try {
        const r = rot13(text);
        if ((r.match(/[aeiouAEIOU]/g) || []).length > (text.match(/[aeiouAEIOU]/g) || []).length) return 'rot13';
      } catch (e) { /* ignore */ }
      return 'vigenere';
    }
    return 'caesar';
  }

  return {
    caesarDecode,
    rot13,
    vigenereDecode,
    atbashDecode,
    affineDecode,
    railFenceDecode,
    base64Decode,
    guessCipher
  };
}));
