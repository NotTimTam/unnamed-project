import Anchor from "./Anchor.js";
/**
 * Displays text on the screen.
 */
export default class Text extends Anchor {
	/**
	 * Create a new `Text` instance.
	 * @param {string} initialValue The initial value to display for the text.
	 * @param {Runtime} runtime The runtime to use.
	 */
	constructor(initialValue, runtime) {
		const element = document.createElement("p");
		element.innerText = initialValue;

		super(element, runtime);
	}

	/**
	 * Update the text display.
	 * @param {string} newText The new text to display.
	 */
	updateText(newText) {
		this.element.innerText = newText;
	}
}
