function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function greet(name: string): string {
  return `Hello ${capitalize(name)}`;
}

console.log(greet('king'));