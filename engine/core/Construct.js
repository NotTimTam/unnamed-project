import Runtime from "./Runtime.js";

/**
 * An object jacked into the runtime and given access to the gameloop.
 */
export default class Construct {
	/**
	 * Create a new `Construct` instance.
	 * @param {Runtime} runtime The runtime this construct will use.
	 */
	constructor(runtime) {
		this.runtime = runtime;
		runtime.constructs.push(this);
	}

	/**
	 * Destroy this construct by removing it from the runtime.
	 */
	destroy() {
		this.runtime.constructs = this.runtime.constructs.filter(
			(construct) => construct !== this
		);
	}
}
