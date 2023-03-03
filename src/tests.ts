import { assertEquals } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import { Clazzx, clx } from "../mod.ts";

assertEquals(clx("text-3xl font-bold"), "text-3xl font-bold");
assertEquals(clx(["text-3xl", "font-bold"]), "text-3xl font-bold");
assertEquals(clx({}), "");
assertEquals(clx(), "");

class MyStyle extends Clazzx {
	base = "base";

	small = "text-sm";
	medium = "text-md";
	large = "text-lg";
}

const myStyle = new MyStyle();
console.log(myStyle)

assertEquals(clx(myStyle(), "base"))
// assertEquals(
// 	clx(myStyle({ large: true })),
// 	"base text-lg"
// );
// assertEquals(
// 	clx(myStyle({ small: true, large: true })), 
// 	"base text-sm text-lg"
// )


