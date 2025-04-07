"use strict";

// Задача 1 — Кеширующий декоратор на 5 элементов с md5
function cachingDecoratorNew(func) {
  let cache = [];

  return function(...args) {
    const hash = args.join(","); // простейший хеш
    const cached = cache.find(item => item.hash === hash);

    if (cached) {
      console.log("Из кеша: " + cached.value);
      return cached.value;
    }

    const result = func(...args);
    cache.push({ hash, value: result });

    if (cache.length > 5) {
      cache.shift();
    }

    console.log("Из кеша: " + result);
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
