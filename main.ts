import { add } from '@scope/add';
import { log } from '@scope/log';

if (import.meta.main) {
  log("Add 2 + 3 =", add(2, 3));
}
