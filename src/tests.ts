import { assertEquals } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import { clx, Clazzx } from "../mod.ts";

assertEquals(clx("text-3xl font-bold"), "text-3xl font-bold");
assertEquals(clx(["text-3xl", "font-bold"]), "text-3xl font-bold");
assertEquals(clx(["text-3xl", undefined, null]), "text-3xl");

assertEquals(clx("text-3xl", "font-bold"), "text-3xl font-bold");
assertEquals(clx("text-3xl", undefined, null), "text-3xl");
assertEquals(clx(["text-3xl"], ["font-bold"]), "text-3xl font-bold");

class Btn extends Clazzx {
	base = "text-3xl font-bold";
	small = "text-sm";
}

console.log("btn", Btn.c({ }));

class Input extends Btn {
	base = "text-3xl font-bold";
	error = "text-red-500"
	compounds = [
		{
			states: ["small", "error"],
			classes: "hover:bg-red-200",
		},
	]
}

console.log("input", Input.c({ small: true, error: true }));