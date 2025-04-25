export default class Prefab {
	/**
	 * Create a new `Prefab` instance.
	 */
	constructor() {
		this._id = crypto.randomUUID();

		this.runtime.prefabs.push(this);
	}

	get runtime() {
		return window.runtime;
	}

	/**
	 * Destroy this prefab by removing it from the runtime.
	 */
	destroy() {
		this.runtime.prefabs = this.runtime.prefabs.filter(
			(prefab) => prefab !== this
		);
	}
}
