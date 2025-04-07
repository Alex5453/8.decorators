describe("Декоратор cachingDecoratorNew", function () {
  it("должен возвращать кэшированный результат при одинаковых аргументах", function () {
    const func = jasmine.createSpy("sum").and.callFake((...args) => args.reduce((a, b) => a + b, 0));
    const decorated = cachingDecoratorNew(func);

    const result1 = decorated(1, 2, 3); // вычисление
    const result2 = decorated(1, 2, 3); // из кеша

    expect(func).toHaveBeenCalledTimes(1);
    expect(result2).toBe(result1);
  });

  it("должен сохранять не более 5 значений в кэше", function () {
    const func = jasmine.createSpy("sum").and.callFake((...args) => args.reduce((a, b) => a + b, 0));
    const decorated = cachingDecoratorNew(func);

    // 6 различных вызовов
    decorated(1, 1);
    decorated(2, 2);
    decorated(3, 3);
    decorated(4, 4);
    decorated(5, 5);
    decorated(6, 6);

    // Повтор старого (должен снова вычислить)
    decorated(1, 1);

    expect(func).toHaveBeenCalledTimes(7); // т.к. первый был удалён из кеша
  });
});


describe("Декоратор debounceDecoratorNew", function () {
  jasmine.clock().install(); // управляем временем вручную

  afterAll(function () {
    jasmine.clock().uninstall();
  });

  it("должен вызывать функцию сразу при первом вызове", function () {
    const spy = jasmine.createSpy("callback");
    const decorated = debounceDecoratorNew(spy, 1000);

    decorated("A");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("A");
  });

  it("должен вызывать функцию только один раз по истечении задержки", function () {
    const spy = jasmine.createSpy("callback");
    const decorated = debounceDecoratorNew(spy, 1000);

    decorated("1");
    jasmine.clock().tick(300);
    decorated("2");
    jasmine.clock().tick(300);
    decorated("3");
    jasmine.clock().tick(500);
    decorated("4");

    jasmine.clock().tick(1000); // ожидание конца таймера

    expect(spy.calls.count()).toBe(2); // первый и последний
    expect(decorated.count).toBe(2);
    expect(decorated.allCount).toBe(4);
  });
});
