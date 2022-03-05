const ClassDeco = (...args: unknown[]): ClassDecorator => {
  return (target) => {};
};

@ClassDeco()
class Foo {}
