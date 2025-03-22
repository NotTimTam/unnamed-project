import Construct from "./Construct.js";
import Anchor from "../gui/Anchor.js";
import Text from "../gui/Text.js";
import Button from "../gui/Button.js";
import Desktop from "../gui/Desktop.js";

/**
 * Manages GUI elements.
 */
export default class GUI extends Construct {
	/**
	 * Create a new `GUI` instance.
	 * @param {Runtime} runtime The runtime to use.
	 */
	constructor(runtime) {
		super(runtime);

		this.desktop = new Desktop(this);

		/**
		 * Create a new `Anchor` instance using the GUI's runtime.
		 * @param {Element} element The element to anchor to.
		 * @returns {Anchor} The new `Anchor` instance.
		 */
		this.Anchor = (element) => new Anchor(element, runtime);

		/**
		 * Create a new `Text` instance using the GUI's runtime.
		 * @param {string} initialValue The initial text value.
		 * @returns {Text} The new `Text` instance.
		 */
		this.Text = (initialValue) => new Text(initialValue, runtime);

		/**
		 * Create a new `Window` instance.
		 * @param {string} text The initial value to display for the button text.
		 * @param {function} event The event to run when the button is clicked.
		 * @returns {Window} The new `Window` instance.
		 */
		this.Button = (text, event) => new Button(text, event, runtime);
	}

	/**
	 * Reset the GUI display to default.
	 */
	reset() {
		this.desktop.reset();
	}
}
