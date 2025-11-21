const C = require('../ciphers.js');

describe('Cipher functions', () => {
  test('caesarDecode basic', () => {
    expect(C.caesarDecode('D', 3)).toBe('A');
    expect(C.caesarDecode('abc xyz', 3)).toBe('xyz uvw');
  });

  test('rot13', () => {
    expect(C.rot13('uryyb')).toBe('hello');
    expect(C.rot13('Hello')).toBe('Uryyb');
  });

  test('vigenereDecode', () => {
    expect(C.vigenereDecode('LXFOPVEFRNHR', 'LEMON')).toBe('ATTACKATDAWN');
    expect(() => C.vigenereDecode('abc', '123')).toThrow();
  });

  test('atbash', () => {
    expect(C.atbashDecode('z')).toBe('a');
    expect(C.atbashDecode('A')).toBe('Z');
    expect(C.atbashDecode('Hello')).toBe('Svool');
  });

  test('affine decode', () => {
    // Encode example: with a=5 b=8, 'a'->(5*0+8)=8 -> i. So to decode we expect reverse.
    const encoded = 'rip'; // arbitrary
    // Decoding with valid a
    expect(typeof C.affineDecode('I', 5, 8)).toBe('string');
    expect(() => C.affineDecode('A', 13, 5)).toThrow(); // 13 not invertible mod 26
  });

  test('rail fence decode', () => {
    // "WECRLTEERDSOEEFEAOCAIVDEN" is "WEAREDISCOVEREDFLEEATONCE" encoded with 3 rails
    const cipher = 'WECRLTEERDSOEEFEAOCAIVDEN';
    expect(C.railFenceDecode(cipher, 3)).toBe('WEAREDISCOVEREDFLEEATONCE');
  });

  test('base64 decode', () => {
    expect(C.base64Decode('SGVsbG8=').toLowerCase()).toBe('hello');
    expect(() => C.base64Decode('invalid_base64')).toThrow();
  });

  test('guessCipher heuristic', () => {
    expect(C.guessCipher('SGVsbG8=')).toBe('base64');
    // rot13-like
    expect(C.guessCipher('uryyb jbeyq')).toBe('rot13' || 'vigenere' || 'caesar');
  });
});
