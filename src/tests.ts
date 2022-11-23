import { assertEquals } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import { Style, clx } from "../mod.ts";

assertEquals(clx("text-3xl font-bold"), "text-3xl font-bold");
assertEquals(clx(["text-3xl", "font-bold"]), "text-3xl font-bold");
assertEquals(clx({}), "");
assertEquals(clx(), "");

class MyStyle extends Style {
	base = "base";

	small = "text-sm";
	medium = "text-md";
	large = "text-lg";
}

const myStyle = new MyStyle();

assertEquals(clx(myStyle.classes()), "base");
assertEquals(
	clx(myStyle.classes({ large: true })),
	"base text-lg"
);
assertEquals(
	clx(myStyle.classes({ small: true, large: true })), 
	"base text-sm text-lg"
)


