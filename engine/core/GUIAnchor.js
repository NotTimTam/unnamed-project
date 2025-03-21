import Construct from "./Construct.js";

/**
 * A class that connects JavaScript events to DOM representations of those events.
 */
export default class GUIAnchor extends Construct {
	/**
	 * Create a new `GUIAnchor` instance.
	 * @param {Element} element The element to anchor to.
	 * @param {function} handler The method to call after each tick.
	 */
	constructor(element, handler) {
		super(window.runtime);

		this.element = element;
		this.handler = handler;
	}

	onAfterTick = () => {
		this.handler && this.handler();
	};

	/**
	 * Erase this anchor's element and the reference to it.
	 * The next step would be to erase all references to this anchor in order to fully remove it.
	 */
	destroy() {
		this.element.parentNode.removeChild(this.element);

		this.element = null;
	}
}

/**
 * Displays text on the screen.
 */
export class Text extends GUIAnchor {
	/**
	 * Create a new `Text` instance.
	 * @param {string} initialValue The initial value to display for the text.
	 */
	constructor(initialValue) {
		const element = document.createElement("p");
		element.innerText = initialValue;

		super(element);
	}

	/**
	 * Update the text display.
	 * @param {string} newText The new text to display.
	 */
	updateText(newText) {
		this.element.innerText = newText;
	}
}
