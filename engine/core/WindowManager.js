import Construct from "./Construct.js";

/**
 * Manages `Window` instances.
 */
export default class WindowManager extends Construct {
	/**
	 * Create a new `WindowManager` instance.
	 * @param {Runtime} runtime The runtime to use.
	 */
	constructor(runtime) {
		super(runtime);

		this.windows = [];
	}
}
