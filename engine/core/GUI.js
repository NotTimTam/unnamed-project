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
		 * Get the current window title.
		 */
		get title() {
			return this.element.querySelector(
				"header.window-header h2.header-title"
			).innerText;
		}

		/**
		 * Set the window's title.
		 */
		set title(n) {
			this.element.querySelector(
				"header.window-header h2.header-title"
			).innerText = n;
		}

		beginDrag = ({ clientX, clientY }) => {
			this.inDrag = true;

			const { x, y } = this.element.getBoundingClientRect();

			this.offset = [clientX - x, clientY - y];
		};

		endDrag = (e) => {
			this.inDrag = false;
		};

		mouseMove = ({ clientX, clientY }) => {
			if (!this.inDrag) return;

			const { width, height } = this.element.getBoundingClientRect();

			this.move(
				Math.min(clientX - this.offset[0], window.innerWidth - width),
				Math.min(clientY - this.offset[1], window.innerHeight - height)
			);
		};

		/**
		 * **Internal method.** Initializes a window's elements.
		 */
		__initializeElements() {
			this.element.className = "window";

			const header = document.createElement("header");
			header.className = "window-header";

			const dragArea = document.createElement("div");
			dragArea.className = "drag-area";
			header.appendChild(dragArea);

			window.addEventListener("mousemove", this.mouseMove);
			window.addEventListener("blur", this.mouseMove);
			window.addEventListener("mouseup", this.endDrag);
			dragArea.addEventListener("mousedown", this.beginDrag);

			dragArea.onmousedown = () => {
				this.inDrag = true;
			};

			const title = document.createElement("h2");
			title.className = "header-title";
			header.appendChild(title);
			title.innerHTML = "Untitled Window";

			const button = document.createElement("button");
			button.type = "button";
			button.className = "close";
			button.title = "Close window.";
			button.innerText = "[x]";
			button.onclick = () => this.close();
			header.appendChild(button);

			this.element.prepend(header);
		}

		/**
		 * Close this window.
		 */
		close() {
			this.gui.windows = this.gui.windows.filter(
				(window) => window !== this
			);

			window.removeEventListener("mousemove", this.mouseMove);
			window.removeEventListener("blur", this.mouseMove);
			window.removeEventListener("mouseup", this.endDrag);

			this.destroy();
		}

		/**
		 * Move the window.
		 * @param {number} x The new x-coordinate for the window.
		 * @param {number} y The new y-coordinate for the window.
		 */
		move = (x, y) => {
			this.element.style.top =
				Math.max(Math.min(y, window.innerHeight - 16), 0) + "px";
			this.element.style.left =
				Math.max(Math.min(x, window.innerWidth - 16), 0) + "px";
		};
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
