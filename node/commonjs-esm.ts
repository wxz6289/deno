import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const express = require("express");
console.log(express);
