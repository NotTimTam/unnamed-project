import Prefab from "./Prefab.js";

export default class Anchor extends Prefab {
	/**
	 * Create a new `Anchor` instance.
	 * @param {Node} element The element to anchor to.
	 * @param {String|Node} parent An optional parent for this element.
	 */
	constructor(element, parent) {
		super();

		this.element = element;

		if (parent) {
			if (typeof parent === "string")
				parent = document.querySelector(parent);

			if (
				parent &&
				parent instanceof Node &&
				!parent.contains(this.element)
			)
				parent.appendChild(this.element);
		}
	}

	/**
	 * Get the window's bounding client rect.
	 */
	get rect() {
		return this.element.getBoundingClientRect();
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
