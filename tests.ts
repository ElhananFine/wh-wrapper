type aType = string;
type bType = number;
type cType = boolean;
type dType = any[];

type AllowedKeys = "a" | "b" | "c" | "d";
type TypeMapping = { a: aType; b: bType; c: cType; d: dType };

type AllowedTypes = { [Key in AllowedKeys]: TypeMapping[Key] };

class Message {
  constructor(initData: Partial<AllowedTypes> = {}) {
    Object.entries(initData).forEach(([key, value]) => {
      this[key as AllowedKeys] = value;
    });
  }
}

// Usage
const msg = new Message({ a: "hello", b: 42 });
console.log(msg.a); // 'hello'
console.log(msg.b); // 42
