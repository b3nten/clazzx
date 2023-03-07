type Clx =
	| string
	| boolean
	| undefined
	| null
	| Array<string | boolean | undefined | null>;

export const clx = (...input: Array<Clx>): string => {
	if (input.length === 1) {
		if (Array.isArray(input[0])) {
			return clx(...input[0]);
		} else if (typeof input[0] === "string") {
			return input[0];
		}
	}
	const acc: string[] = [];
	for (const item of input) {
		if (Array.isArray(item)) {
			acc.push(clx(...item));
		} else if (typeof item === "string") {
			acc.push(item);
		}
	}
	let str = "";
	for (let i = 0; i < acc.length; i++) {
		if (acc[i]) {
			str += acc[i] + (i < acc.length - 1 ? " " : "");
		}
	}
	return str;
};

export type StyleProps<T> = {
	[K in keyof Partial<
		Omit<Omit<Omit<T, "classes">, "compounds">, "default">
	>]: boolean;
};

type ClazzxProps =
	| {
			compounds?: Clazzx["compounds"];
			base?: Clazzx["base"];
			default?: Clazzx["default"];
	  }
	| Record<string, Clx>;

export class Clazzx {
	public static clx = clx;

	public base: Clx = []
	public default: Clx = [];

	public compounds: Array<{
		states: Array<string>;
		classes: Clx;
	}> = [];

	private classes(input?: StyleProps<this>): string {
		const acc = new Map();

		if (input && "base" in input && !input.base) {
			// not including base. Maybe do something here?
		} else {
			acc.set("base", clx(this.base));
		}

		if (input) {
			for (const [key, value] of Object.entries(input)) {
				if (
					key !== "base" &&
					key !== "default" &&
					key !== "compounds" &&
					key !== "classes" &&
					value === true
				) {
					//@ts-expect-error we're setting the value on the class dynamically
					acc.set(key, clx(this[key]));
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
				compound.states.every(
					//@ts-expect-error this is fine
					(key) => key in this && input && input[key]
				)
			) {
				acc.set("compound" + i, clx(compound.classes));
			}
		}

		return clx(Array.from(acc.values()));
	}

	public static c<C extends Clazzx>(
		this: new (...args: unknown[]) => C,
		classes: StyleProps<C>
	) {
		const instance = new this();
		return instance.classes(classes);
	}
}
