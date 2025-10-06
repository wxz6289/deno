Deno.env.set('HELLO', 'world');
console.log(Deno.env.get('HELLO'));
console.log(Deno.env.get('HOME'));
// console.log(Deno.env.toObject());