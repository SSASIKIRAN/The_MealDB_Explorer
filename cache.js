// Simple fallback cache – no external NPM modules needed
class Cache {
  constructor(max = 50) {
      this.max = max;
      this.map = new Map();
  }

  get(key) {
      return this.map.get(key);
  }

  set(key, value) {
      if (this.map.size >= this.max) {
          const first = this.map.keys().next().value;
          this.map.delete(first);
      }
      this.map.set(key, value);
  }
}

module.exports = new Cache(50);