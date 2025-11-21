````markdown
# Cypher — GUI Prototype (rose-theme, extra ciphers, tests, i18n)

This branch adds:
- Several new decoders: Atbash, Affine (a,b), Rail Fence (decryption), Base64.
- Hardened implementations for Caesar, ROT13, and Vigenère with edge-case handling and validation.
- A ciphers module (ciphers.js) usable in-browser and for Node tests.
- Rose-themed UI styling and updated language options.
- i18n JSON files including English, Spanish, French, German, Portuguese.
- Unit tests (Jest) covering all ciphers.

How to run locally:
1. Place files into the repository root:
   - index.html, styles.css, ciphers.js, app.js, package.json, jest.config.js
   - i18n/*.json (en.json, es.json, fr.json, de.json, pt.json)
   - tests/ciphers.test.js
2. For UI: open index.html in a browser.
3. For tests:
   - Install dev dependencies: `npm install`
   - Run tests: `npm test`

Notes:
- The ciphers module uses safe validation and throws descriptive errors for invalid keys; the UI catches these and displays them.
- The Affine cipher requires that 'a' be coprime to 26 (e.g., 1,3,5,7,9,11,15,17,19,21,23,25).
- Rail Fence decryption expects a numeric rail count.
````
