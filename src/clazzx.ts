type Clx =
	| string
	| boolean
	| undefined
	| null
	| Array<string | boolean | undefined | null>;


/**
 * 
 *clx accepts any number of strings, booleans, undefined, null, or arrays of those types and returns a string of all truthy values.
 * @example
 * ```
 * clx("text-3xl font-bold") // "text-3xl font-bold"
 * clx(["text-3xl", "font-bold"]) // "text-3xl font-bold"
 * clx(["text-3xl", undefined, null]) // "text-3xl"
 * clx("text-3xl", "font-bold") // "text-3xl font-bold"
 * clx("text-3xl", undefined, null) // "text-3xl"
 * clx(["text-3xl"], ["font-bold"]) // "text-3xl font-bold"
 * ```
 */

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

type OmitIntrinsic<T> = Omit<T, "classes" | "compounds" | "default">;

/**
 * StyleProps creates a type from a ClazzX class that is used to define the input to the `compose` method.
 * @example
 * ```
 * class Btn extends ClazzX {
 *  base = "text-3xl font-bold";
 *  small = "text-sm";
 * }
 * 
 * function Button({...props}: StyleProps<Btn>) {
 *   return <button className={Btn.compose(props)} />;
 * }
 * ```
 */

export type StyleProps<T> = {
	[K in keyof Partial<
		OmitIntrinsic<T>
	>]: boolean;
};

/**
 *Inherit ClazzX and define your own base, default, compounds, and classes. Compose them by calling the static `compose` method.
 * Access the classes by calling the static `get` method.
 * @example
 * ```
 * class Btn extends ClazzX {
 *   base = "text-3xl font-bold";
 *   small = "text-sm";
 * }
 * const classes = Btn.compose({ small: true });
 * ```
 * @example
 * ```
 * class Input extends Btn {
 *   base = "text-3xl font-bold";
 *   error = "text-red-500"
 *   compounds = [{
 *     states: ["small", "error"],	
 *     classes: "hover:bg-red-200",
 *   }]
 * }
 * const classes = Input.compose({ small: true, error: true });
 * ```
 * @docs https://github.com/B3nten/clazzx
 */

export class ClazzX {
	public static clx = clx;

	public base: Clx = []
	public default: Clx = [];

	public compounds: Array<{
		states: Array<string>;
		classes: Clx;
	}> = [];

	public classes(input?: StyleProps<this>): string {
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

	public static compose<C extends ClazzX>(
		this: new (...args: unknown[]) => C,
		classes: StyleProps<C>
	) {
		const instance = new this();
		return instance.classes(classes);
	}
	public static get<C extends ClazzX>(
		this: new (...args: unknown[]) => C
	) {
		const instance = new this();
		return instance
	}
}
