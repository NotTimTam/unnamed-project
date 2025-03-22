import Anchor from "./Anchor.js";
/**
 * Displays a button on the screen.
 */
export default class Button extends Anchor {
	/**
	 * Create a new `Button` instance.
	 * @param {string} text The initial value to display for the button text.
	 * @param {function} event The event to run when the button is clicked.
	 * @param {Runtime} runtime The runtime to use.
	 */
	constructor(text, event, runtime) {
		const element = document.createElement("button");
		element.innerText = text;
		element.onclick = event;

		super(element, runtime);
	}
}
