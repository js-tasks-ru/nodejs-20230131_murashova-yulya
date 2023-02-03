function sum(a, b) {
  /* ваш код */
  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('Один из аргументов не число');
  
  return a + b;
}

module.exports = sum;
