// Cipher Logic Implementation

export const ciphers = {
  caesar: {
    name: 'Caesar Cipher',
    description: 'Shifts each letter by a fixed number of positions down the alphabet.',
    encrypt: (text, shift = 3) => {
      return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + parseInt(shift)) % 26) + base);
      });
    },
    decrypt: (text, shift = 3) => {
      return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        let diff = (char.charCodeAt(0) - base - parseInt(shift)) % 26;
        if (diff < 0) diff += 26;
        return String.fromCharCode(diff + base);
      });
    },
    hasKey: true,
    defaultKey: 3
  },
  rot13: {
    name: 'ROT13',
    description: 'A special case of Caesar cipher that shifts letters by 13 positions.',
    encrypt: (text) => {
      return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
      });
    },
    decrypt: (text) => {
      return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
      });
    },
    hasKey: false
  },
  atbash: {
    name: 'Atbash Cipher',
    description: 'Maps the alphabet to its reverse (A->Z, B->Y, etc.).',
    encrypt: (text) => {
      return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
      });
    },
    decrypt: (text) => {
      return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
      });
    },
    hasKey: false
  },
  base64: {
    name: 'Base64',
    description: 'Encodes binary data to ASCII string format.',
    encrypt: (text) => {
      try {
        return btoa(text);
      } catch (e) {
        return 'Error: Invalid input for Base64';
      }
    },
    decrypt: (text) => {
      try {
        return atob(text);
      } catch (e) {
        return 'Error: Invalid Base64 string';
      }
    },
    hasKey: false
  }
};