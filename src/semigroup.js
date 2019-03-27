import { type } from './typeclasses';

export const Semigroup = type(class Semigroup {
  static name = 'Semigroup';
  append(left, right) {
    let { append } = this(left);
    return append(left, right);
  }
});

export const { append } = Semigroup.prototype;
