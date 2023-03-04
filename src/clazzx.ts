type Clx = string | Array<string | boolean | undefined | null>;

export const clx = (input: Clx) => {
	if (Array.isArray(input)) {
		return input.filter(Boolean).join(" ");
	} else if (typeof input === "string") {
		return input.trim();
	}
	return "";
};

export type StyleProps<T> = {
	[K in keyof Partial<
		Omit<Omit<Omit<Omit<T, "base">, "classes">, "compounds">, "default">>]: boolean;
};

export class Clazzx {
	protected base: Clx = [];
	protected compounds: Array<{
		states: Array<string>;
		classes: Clx;
	}> = [];
	protected default: Clx = [];

	constructor(){
		//@ts-ignore
		const thisStore = this;
		return new Proxy(() => thisStore, {
			get(target, prop){
				return target()[prop]
			},
			apply(target, _, args){
				console.log( thisStore)
				return target().classes(args)
			}
		})
	}

	classes = (input?: StyleProps<this>): string => {
		const acc = new Map();

		acc.set("base", clx(this.base));

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



