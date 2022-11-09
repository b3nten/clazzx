type Clx = string | Array<string | boolean>;
export const clx = (input: Clx) => {
	if (Array.isArray(input)) {
		return input.filter(Boolean).join(" ");
	} else if (typeof input === "string") {
		return input.trim();
	}
	return "";
};

interface StyleOptions {
	before?: string | Array<string | boolean>;
	after?: string | Array<string | boolean>;
	additional?: Record<string | number, Clx>;
}

type Flatten<T extends object> =
  { [K in keyof T]:
    T[K] extends (Array<any> | string) ? (x: Record<K, T[K]>) => void :
    T[K] extends object ? (x: Flatten<T[K]>) => void : never
  }[keyof T] extends (x: infer I) => void ? { [K in keyof I]: I[K] } : never;

type StyleProps<T> = {
	[K in keyof Partial<
			Omit<
				Omit<
					Omit<Omit<Omit<Omit<T, "base">, "classes">, "compounds">, "default">,
					"__before"
				>,
				"__after"
			>
	>]: boolean;
};


export class Style {
	protected base: Clx = [];
	protected compounds: Array<{
		keys: Array<string>;
		classes: Clx;
	}> = [];
	protected default: Clx = [];
	protected __before: Clx = [];
	protected __after: Clx = [];

	constructor(options?: StyleOptions) {
		if (options?.before) {
			this.__before = options.before;
		}
		if (options?.after) {
			this.__after = options.after;
		}
	}

	classes(input?: StyleProps<this>): string {
		const acc = new Map();

		acc.set("base", clx(this.base));
		acc.set("before", clx(this.__before));

		if (input) {
			for (const [key, value] of Object.entries(input)) {
				if (
					key !== "base" &&
					key !== "default" &&
					key !== "compounds" &&
					key !== "classes" &&
					key !== "__before" &&
					key !== "__after" &&
					value === true
					&& key in this
				) {
					//@ts-ignore
					acc.set(key, clx(this[key]));
					// if (key in this) {
					// 	acc.set(key, clx(this[key as keyof Style]));
					// } else {
					// 	for (const [thiskey, thisvalue] of Object.entries(this)) {
					// 		if (typeof thisvalue === "object" && key in thisvalue) {
					// 			acc.delete(thiskey);
					// 			acc.set(thiskey, clx(thisvalue[key as keyof Style]));
					// 		}
					// 	}
					// }
				}
			}
		}
		// If nothing provided, use default values
		if (!input || Object.entries(input).length === 0) {
			acc.set("default", clx(this.default));
		}

		// handle compounds
		for (const [i, compound] of this.compounds.entries()) {
			if (
				compound.keys.every((key) => {
					//@ts-ignore
					if (key in this && input[key]) return true;
				})
			) {
				acc.set("compound" + i, clx(compound.classes));
			}
		}

		acc.set("after", clx(this.__after));

		return Array.from(acc.values()).join(" ").replace(/\B\s+|\s+\B/, "");
	}
}



