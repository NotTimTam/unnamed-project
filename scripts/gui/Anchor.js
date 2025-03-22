import Construct from "../core/Construct.js";

/**
 * A class that connects JavaScript events to DOM representations of those events.
 */
export default class Anchor extends Construct {
	/**
	 * Create a new `Anchor` instance.
	 * @param {Element} element The element to anchor to.
	 * @param {Runtime} runtime The runtime to use.
	 */
	constructor(element, runtime) {
		super(runtime);

		this.element = element;
	}

	/**
	 * Erase this anchor's element and the reference to it.
	 * The next step would be to erase all references to this anchor in order to fully remove it.
	 */
	destroy() {
		this.element.parentNode.removeChild(this.element);

		this.element = null;
	}
}
