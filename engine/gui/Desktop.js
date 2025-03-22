import Anchor from "./Anchor.js";
import Window from "./Window.js";

/**
 * A desktop window that displays content.
 */
export default class Desktop extends Anchor {
	/**
	 * Create a new `Window` instance.
	 * @param {GUI} gui The gui to use.
	 */
	constructor(gui) {
		super(document.createElement("main"), gui.runtime);
		this.gui = gui;

		this.windows = [];

		this.__initializeElements();

		/**
		 * Create a new `Window` instance.
		 * @returns {Window} The new `Window` instance.
		 */
		this.Window = () => new Window(this);
	}

	/**
	 * **Internal method.** Initializes a window's elements.
	 */
	__initializeElements() {
		this.element.className = "desktop";
	}
}
