// let url = new URL("https://doc.deno.land/builtin/stable#URL");
// console.log(url);

let urs = new URLSearchParams();
urs.append('name', 'king');
urs.append('pwd', '123');
console.log(urs.get('pwd'));
urs.delete('pwd');
console.log(urs.get('pwd'));
console.log(urs.has('name'));
urs.set('pwd', '234');
console.log(urs.get('pwd'));

urs.forEach((value, key, parent) => {
    console.log(value, key, parent);
});

for (const key of urs.keys()) {
    console.log(key);
}

for (const value of urs.values()) {
    console.log(value);
}

console.log(urs.toString());

for (const [key, value] of urs) {
    console.log(key, value);
}

// console.log(urs.keys());
// console.log(urs.values());






