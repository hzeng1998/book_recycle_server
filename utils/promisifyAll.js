const {promisify} = require('util');

const excludeFunction = Object.getOwnPropertyNames(Object.prototype).reduce((map, func) => {
  map[func] = true;
  return map;
});

const _promisifyAll = (object) => {
  for (const key of Object.getOwnPropertyNames(object)) {
    if (excludeFunction[key]) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    if (!descriptor.get) {
      const func = object[key];
      if (typeof func === 'function') {
        object[`${key}Async`] = promisify(func);
      }
    }
  }
};

module.exports = (object) => {
  _promisifyAll(object);
  const prototype = Object.getPrototypeOf(object);
  if (prototype) {
    _promisifyAll(prototype);
  }
  return object;
};