import Construct from "./Construct.js";

/**
 * Manages GUI elements.
 */
export default class GUI extends Construct {
	/**
	 * A class that connects JavaScript events to DOM representations of those events.
	 */
	static Anchor = class extends Construct {
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
	};

	/**
	 * Displays text on the screen.
	 */
	static Text = class extends GUI.Anchor {
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
	};

	/**
	 * A desktop window that displays content.
	 */
	static Window = class Window extends GUI.Anchor {
		/**
		 * Create a new `Window` instance.
		 * @param {GUI} gui The gui to use.
		 */
		constructor(gui) {
			super(document.createElement("div"), gui.runtime);
			this.gui = gui;

			this.__initializeElements();
		}

		/**
		 * **Internal method.** Initializes a window's elements.
		 */
		__initializeElements() {
			this.element.className = "window";

			this.element.innerHTML = `
				<header class="window-header">
					<button type="button" class="close">[x]</button>
				</header>
			`;
		}

		/**
		 * Close this window.
		 */
		close() {
			this.gui.windows = this.gui.windows.filter(
				(window) => window !== this
			);

			this.destroy();
		}
	};

	/**
	 * Create a new `GUI` instance.
	 * @param {Runtime} runtime The runtime to use.
	 */
	constructor(runtime) {
		super(runtime);

		this.windows = [];

		/**
		 * Create a new `Anchor` instance using the GUI's runtime.
		 * @param {Element} element The element to anchor to.
		 * @returns {GUI.Anchor} The new `Anchor` instance.
		 */
		this.Anchor = (element) => new GUI.Anchor(element, runtime);

		/**
		 * Create a new `Text` instance using the GUI's runtime.
		 * @param {string} initialValue The initial text value.
		 * @returns {GUI.Text} The new `Text` instance.
		 */
		this.Text = (initialValue) => new GUI.Text(initialValue, runtime);

		/**
		 * Create a new `Window` instance.
		 * @returns {GUI.Window} The new `Window` instance.
		 */
		this.Window = () => new GUI.Window(this);
	}
}
