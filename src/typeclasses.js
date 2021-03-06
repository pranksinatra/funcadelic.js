import invariant from 'invariant';

const { keys, getOwnPropertyDescriptors, defineProperty } = Object;

invariant(getOwnPropertyDescriptors, `funcadelic.js requires Object.getOwnPropertyDescriptors. See https://github.com/cowboyd/funcadelic.js#compatibility`)
invariant("name" in Function.prototype && "name" in (function x() {}), `funcadelic.js requires Function.name. See https://github.com/cowboyd/funcadelic.js#compatibility`);

const VERSION = 0;
let uniqueTag = 0;

export function type(Class) {

  let name =  Class.name;

  if (!name) {
    throw new Error('invalid typeclass name: ' + name);
  }

  let symbolName = `@@funcadelic-${VERSION}/${name}/${uniqueTag++}`;
  let symbol = Symbol[symbolName] ? Symbol[symbolName] : Symbol[symbolName] = Symbol(symbolName);

  Class.for = function _for(value) {
    let i = value[symbol];
    if (!i) {
      throw new Error(`No instance found on ${value} of typeclass ${name}`);
    }
    return i;
  };

  Class.instance = function(constructor, methods) {
    defineProperty(constructor.prototype, symbol, {
      value: methods,
      configurable: true,
      // make the prototype non-enumerable to prevent it from showing in Safari debugger
      enumerable: false
    });
  };

  Class.symbolName = symbolName;
  Class.symbol = symbol;

  let properties = getOwnPropertyDescriptors(Class.prototype);
  keys(properties).filter(key => key != 'constructor').forEach(key => {
    Class.prototype[key] = Class.prototype[key].bind(Class.for);
  });

  return Class;
}
