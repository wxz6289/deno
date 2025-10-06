import { it } from '@std/testing/bdd';
Deno.test({
  name: 'ignore test',
  ignore: Deno.build.os === 'windows',
  fn() {
    console.log('This test will be ignored');
  },
});

it.ignore('this test will be ignored', () => {
  console.log('This test will be ignored');
});

Deno.test.ignore('this test will be ignored B', () => {
  console.log('This test will be ignored B');
});

/* Deno.test.only('this test will be run only', () => {
  console.log('This test will be run on only');
}); */