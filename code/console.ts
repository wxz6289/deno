console.log("wild %cblue", "color: blue; font-size: 20px;", "yonder");

const people = {
  'john': { age: 30, city: 'New York' },
  'jane': { age: 25, city: 'San Francisco' },
  'doe': { age: 22, city: 'Los Angeles' }
};

console.table(people);
console.table(people, ['city']);

console.count();
console.time("fetching data");
await new Promise(resolve => setTimeout(resolve, 2000));
console.timeLog("fetching data");
console.table(people);
console.count();
console.timeEnd("fetching data");
console.count();

console.log('%cHello, %cWorld!', 'color: green; font-size: 16px; background-color: lightgray; padding: 4px; border-radius: 4px;', 'color: blue; font-size: 16px; background-color: lightgray; padding: 4px; border-radius: 4px;');