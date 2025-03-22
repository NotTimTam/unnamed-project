/**
 * An object jacked into the runtime and given access to the gameloop.
 */
export default class Construct {
	/**
	 * Create a new `Construct` instance.
	 * @param {Runtime} runtime The runtime this construct will use.
	 */
	constructor(runtime) {
		if (!runtime)
			throw new Error("No runtime provided to Construct constructor.");

		this.runtime = runtime;
		runtime.constructs.push(this);

		this.id = crypto.randomUUID();
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
