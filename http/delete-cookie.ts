import { Response } from "https://deno.land/std/http/server.ts";
import { deleteCookie } from "https://deno.land/std/http/cookie.ts";

let response: Response = {};
deleteCookie(response, "deno");

const cookieHeader = response.headers && response.headers.get("set-cookie");
console.log("Set-Cookie:", cookieHeader);
