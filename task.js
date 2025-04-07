"use strict";

// Задача 1 — Кеширующий декоратор на 5 элементов с md5
function cachingDecoratorNew(func) {
  const cache = [];

  return function (...args) {
    const hash = md5(args);
    const cachedItem = cache.find(item => item.hash === hash);

    if (cachedItem) {
      console.log("Из кеша: " + cachedItem.result);
      return cachedItem.result;
    }

    const result = func(...args);
    cache.push({ hash, result });

    if (cache.length > 5) {
      cache.shift();
    }

    console.log("Вычисляем: " + result);
    return result;
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
