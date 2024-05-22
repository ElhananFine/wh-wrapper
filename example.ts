import { C } from "ts-toolbelt";

type test0 = C.Class<[string, number], {}>;

declare const SomeClass: test0;

const obj = new SomeClass("foo", 42);

/// `create` takes an instance constructor and creates an instance of it
declare function create<C extends new (...args: any[]) => any>(c: C): C.InstanceOf<C>;

class A {}
class B {}

let a = create(A); // A
let b = create(B); // B
