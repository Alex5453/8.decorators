"use strict";

// Задача 1 — Кеширующий декоратор на 5 элементов с md5
function cachingDecoratorNew(func) {
  const cache = [];

  return function (...args) {
    const hash = md5(args);
    const cachedItem = cache.find(item => item.hash === hash);

    if (cachedItem) {
      console.log("Из кеша: " + cachedItem.result);
      return "Из кеша: " + cachedItem.result;
    }

    const result = func(...args);
    cache.push({ hash, result });

    if (cache.length > 5) {
      cache.shift(); // удаляем самый старый элемент
    }

    console.log("Вычисляем: " + result);
    return "Вычисляем: " + result;
  };
}

// Задача 2 — debounceDecoratorNew
function debounceDecoratorNew(func, delay) {
  let timeoutId;
  let isFirstCall = true;

  function wrapper(...args) {
    wrapper.allCount++;

    if (isFirstCall) {
      func(...args);
      wrapper.count++;
      isFirstCall = false;
      return;
    }

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
      wrapper.count++;
    }, delay);
  }

  wrapper.count = 0;
  wrapper.allCount = 0;

  return wrapper;
}



// Пример для cachingDecoratorNew
const sum = (...args) => args.reduce((a, b) => a + b, 0);
const cachedSum = cachingDecoratorNew(sum);

cachedSum(1, 2, 3); // Вычисляем: 6
cachedSum(1, 2, 3); // Из кеша: 6
cachedSum(2, 2, 2);
cachedSum(3, 2, 2);
cachedSum(4, 2, 2);
cachedSum(5, 2, 2);
cachedSum(6, 2, 2); // удалит первый кеш
cachedSum(1, 2, 3); // снова вычислит

// Пример для debounceDecoratorNew
const send = (id) => console.log("Сигнал отправлен", id);
const debouncedSend = debounceDecoratorNew(send, 2000);

setTimeout(() => debouncedSend(1), 0);
setTimeout(() => debouncedSend(2), 300);
setTimeout(() => debouncedSend(3), 900);
setTimeout(() => debouncedSend(4), 1200);
setTimeout(() => debouncedSend(5), 2300);
setTimeout(() => debouncedSend(6), 4400);
setTimeout(() => debouncedSend(7), 4500);
setTimeout(() => {
  console.log("Вызовов выполнено:", debouncedSend.count); // 3
  console.log("Вызовов всего:", debouncedSend.allCount); // 6
}, 7000);