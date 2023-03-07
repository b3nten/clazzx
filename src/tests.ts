import { assertEquals } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import { Clazzx, clx } from "../mod.ts";

// assertEquals(clx("text-3xl font-bold"), "text-3xl font-bold");
// assertEquals(clx(["text-3xl", "font-bold"]), "text-3xl font-bold");
// //@ts-expect-error: testing....
// assertEquals(clx({}), "");
// //@ts-expect-error: testing....
// assertEquals(clx(), "");

// class MyStyle extends Clazzx {
// 	base = "base";
// 	small = "text-sm";
// 	medium = "text-md";
// 	large = "text-lg";
// }
// const myStyle = new MyStyle();
// // console.log(myStyle.classes({medium: true}))

// const btn = new Clazzx({
// 	lol: 'ok',
// 	base: "this is sick",
// 	omg: ["lol"]
// })
// btn.classes({omg: true, base: false})

const lol = {
	base: "base",
	get small(){return "text-sm" + this.base}, 
}
