type Clx = string | Array<string | boolean | undefined | null>;

export const clx = (input: Clx) => {
	if (Array.isArray(input)) {
		return input.filter(Boolean).join(" ");
	} else if (typeof input === "string") {
		return input.trim();
	}
	return "";
};

//  export type StyleProps<T> = {
// [K in keyof Partial<
// 	Omit<Omit<Omit<T, "classes">, "compounds">, "default">>]: boolean;
// };

export type StyleProps<T> = {
	[K in keyof Partial<T>]: boolean
}

export class Clazzx<T extends Record<string, Clx> = Record<string, Clx>> {
	public static clx = clx;
	public readonly base: Clx = [];
	public readonly compounds: Array<{
		states: Array<string>;
		classes: Clx;
	}> = [];
	public readonly default: Clx = [];

	constructor(props?: T){
		if(props){
			for(const [key, val] of Object.entries(props)){
				this[key] = val
			}
		}
	}

	public classes(input?: StyleProps<this & T>): string {
		const acc = new Map();
		
		
		if(input && "base" in input && !input.base){
			// not including base. Maybe do something here?
		}else{
			acc.set("base", clx(this.base))
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
					//@ts-ignore
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
				compound.states.every((state) => {
					//@ts-ignore
					if (key in this && input[key]) return true;
				})
			) {
				acc.set("compound" + i, clx(compound.classes));
			}
		}
		return Array.from(acc.values()).join(" ").replace(/\B\s+|\s+\B/, "");
	}
}



